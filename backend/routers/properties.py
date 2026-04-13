"""REST endpoints for properties."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, field_validator
from sqlmodel import Session, select

from auth import get_current_user_id
from database import get_session
from models import Property, PropertyHistory
from schemas import PropertyResponse, property_to_response
from scraper import fetch_property_data

router = APIRouter(prefix="/api/properties", tags=["properties"])


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

    prop = Property(
        user_id=user_id,
        url=url,
        title=data.get("title"),
        price=data.get("price"),
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
        status=db_status,
    )

    if prop.price is None and db_status == "active":
        prop.price = 0.0

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


@router.delete("/{property_id}", status_code=204)
def delete_property(
    property_id: int,
    session: Annotated[Session, Depends(get_session)],
    user_id: Annotated[str, Depends(get_current_user_id)],
):
    prop = session.get(Property, property_id)
    if not prop or prop.user_id != user_id:
        raise HTTPException(status_code=404, detail="Imóvel não encontrado")

    for h in _histories_for(session, property_id):
        session.delete(h)
    session.delete(prop)
    session.commit()
    return None
