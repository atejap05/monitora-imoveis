"""REST endpoints for properties."""

from __future__ import annotations

import logging
from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, field_validator
from pydantic.alias_generators import to_camel
from sqlalchemy import delete
from sqlmodel import Session, select
from starlette.responses import Response

from auth import get_current_user_id
from database import engine, get_session
from jobs import rescrape_properties_for_user
from models import Property, PropertyHistory
from schemas import (
    PropertyResponse,
    RescrapeBatchResponse,
    RescrapeResultItemResponse,
    property_to_response,
)
from scraper import fetch_property_data

router = APIRouter(prefix="/api/properties", tags=["properties"])

DbPropertyStatus = Literal["active", "inactive", "error"]


def _to_decimal(value: float | None) -> Decimal | None:
    if value is None:
        return None
    return Decimal(str(value))
MAX_COMMENT_LEN = 2000


class PropertyCreateBody(BaseModel):
    url: str

    @field_validator("url")
    @classmethod
    def normalize_url(cls, v: str) -> str:
        v = (v or "").strip()
        if not v:
            return v
        if not v.startswith(("http://", "https://")):
            v = f"https://{v}"
        return v


class PropertyUpdateBody(BaseModel):
    """Partial update; JSON keys may be camelCase (alias)."""

    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    neighborhood: Optional[str] = None
    price: Optional[float] = None
    comment: Optional[str] = None
    favorite: Optional[bool] = None
    status: Optional[DbPropertyStatus] = None

    @field_validator("comment")
    @classmethod
    def comment_len(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        s = v.strip()
        if len(s) > MAX_COMMENT_LEN:
            raise ValueError(
                f"Comentário muito longo (máximo {MAX_COMMENT_LEN} caracteres).",
            )
        return s if s else None

    @field_validator("neighborhood")
    @classmethod
    def strip_neighborhood(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        return v.strip()

    @field_validator("price")
    @classmethod
    def price_non_negative(cls, v: Optional[float]) -> Optional[float]:
        if v is None:
            return None
        if v < 0:
            raise ValueError("O preço não pode ser negativo.")
        return v


def _histories_for(session: Session, property_id: int) -> list[PropertyHistory]:
    stmt = select(PropertyHistory).where(PropertyHistory.property_id == property_id)
    return list(session.exec(stmt).all())


@router.get(
    "",
    response_model=list[PropertyResponse],
    response_model_by_alias=True,
)
def list_properties(
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    props = list(
        session.exec(select(Property).where(Property.user_id == user_id)).all(),
    )
    return [
        property_to_response(p, _histories_for(session, p.id))
        for p in props
        if p.id is not None
    ]


@router.get(
    "/{property_id}",
    response_model=PropertyResponse,
    response_model_by_alias=True,
)
def get_property(
    property_id: int,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    prop = session.get(Property, property_id)
    if not prop or prop.user_id != user_id:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")
    return property_to_response(prop, _histories_for(session, property_id))


@router.post(
    "/rescrape",
    response_model=RescrapeBatchResponse,
    response_model_by_alias=True,
)
async def rescrape_all_user_properties(
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    """Re-scrape em fila todos os imóveis com status `active` do usuário autenticado."""
    raw = await rescrape_properties_for_user(engine, user_id)
    items = [RescrapeResultItemResponse.model_validate(x) for x in raw["results"]]
    return RescrapeBatchResponse(
        total=raw["total"],
        updated=raw["updated"],
        price_changes=raw["price_changes"],
        errors=raw["errors"],
        inactive_listings=raw["inactive_listings"],
        results=items,
    )


@router.post(
    "",
    response_model=PropertyResponse,
    status_code=201,
    response_model_by_alias=True,
)
async def create_property(
    body: PropertyCreateBody,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    url = body.url.strip()
    if not url:
        raise HTTPException(status_code=422, detail="URL é obrigatória")

    existing = session.exec(
        select(Property).where(Property.user_id == user_id, Property.url == url),
    ).first()
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Este imóvel já está sendo monitorado.",
        )

    data = await fetch_property_data(url)

    if data.get("status") == "error":
        raise HTTPException(
            status_code=422,
            detail=data.get("error", "Falha ao extrair dados do anúncio."),
        )

    db_status = "active"
    if data.get("status") == "inactive":
        db_status = "inactive"

    raw_price = data.get("price")
    prop = Property(
        user_id=user_id,
        url=url,
        title=data.get("title"),
        price=_to_decimal(raw_price) if raw_price is not None else None,
        previous_price=None,
        bedrooms=data.get("bedrooms"),
        bathrooms=data.get("bathrooms"),
        suites=data.get("suites"),
        size=data.get("size"),
        parking_spots=data.get("parking_spots"),
        address=data.get("address") or "",
        neighborhood=data.get("neighborhood") or "",
        city=data.get("city") or "",
        property_type=data.get("property_type") or "sale",
        source=data.get("source"),
        image_url=data.get("image_url"),
        condo_fee=_to_decimal(data.get("condo_fee")),
        iptu=_to_decimal(data.get("iptu")),
        description=data.get("description"),
        reference_code=data.get("reference_code"),
        status=db_status,
    )

    if prop.price is None and db_status == "active":
        prop.price = Decimal("0")

    session.add(prop)
    session.commit()
    session.refresh(prop)

    hist_status = "inactive" if db_status == "inactive" else "active"
    hist = PropertyHistory(
        property_id=prop.id,
        price=prop.price,
        status=hist_status,
    )
    session.add(hist)
    session.commit()

    assert prop.id is not None
    return property_to_response(prop, _histories_for(session, prop.id))


@router.patch(
    "/{property_id}",
    response_model=PropertyResponse,
    response_model_by_alias=True,
)
def patch_property(
    property_id: int,
    body: PropertyUpdateBody,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    """Atualiza campos manuais do imóvel. Não grava linha em PropertyHistory (histórico vem do scrape/job)."""
    prop = session.get(Property, property_id)
    if not prop or prop.user_id != user_id:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    data = body.model_dump(exclude_unset=True)
    if not data:
        return property_to_response(prop, _histories_for(session, property_id))

    if "neighborhood" in data:
        prop.neighborhood = data["neighborhood"] or ""
    if "price" in data:
        prop.price = _to_decimal(data["price"])
    if "comment" in data:
        prop.comment = data["comment"]
    if "favorite" in data:
        prop.favorite = data["favorite"]
    if "status" in data:
        prop.status = data["status"]

    prop.updated_at = datetime.utcnow()
    session.add(prop)
    session.commit()
    session.refresh(prop)

    return property_to_response(prop, _histories_for(session, property_id))


@router.delete("/{property_id}", status_code=204)
def delete_property(
    property_id: int,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    prop = session.get(Property, property_id)
    if not prop or prop.user_id != user_id:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    try:
        # Remove históricos antes do imóvel (evita IntegrityError se FK CASCADE estiver ausente no PG).
        session.exec(delete(PropertyHistory).where(PropertyHistory.property_id == property_id))
        session.delete(prop)
        session.commit()
    except Exception:
        logging.exception("delete_property failed property_id=%s", property_id)
        raise

    return Response(status_code=204)
