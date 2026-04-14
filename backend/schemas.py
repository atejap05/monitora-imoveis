"""API response models with camelCase aliases for the Next.js frontend."""

from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

PropertyStatus = Literal["active", "inactive", "price_drop", "price_up"]
ListingStatus = Literal["active", "inactive", "error"]


class PropertyHistoryItemResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    price: float
    date: str
    status: PropertyStatus


class PropertyResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    id: int
    url: str
    title: str
    price: float
    previous_price: Optional[float] = None
    bedrooms: int
    bathrooms: int
    suites: int
    size: str
    parking_spots: int
    address: str
    neighborhood: str
    city: str
    # JSON key must be "type" for the frontend (not propertyType)
    property_type: Literal["sale", "rent"] = Field(serialization_alias="type")
    status: PropertyStatus
    listing_status: ListingStatus = Field(
        description="Status persistido no banco (edição manual / scraper).",
    )
    source: str
    image_url: str
    comment: str
    favorite: bool
    created_at: str
    updated_at: str
    history: list[PropertyHistoryItemResponse]


def _frontend_status(
    db_status: str,
    price: Optional[float],
    previous_price: Optional[float],
) -> PropertyStatus:
    if db_status in ("inactive", "error"):
        return "inactive"
    if price is not None and previous_price is not None and previous_price != price:
        if price < previous_price:
            return "price_drop"
        if price > previous_price:
            return "price_up"
    return "active"


def property_to_response(
    prop,
    histories: list,
) -> PropertyResponse:
    """Build PropertyResponse from ORM models (Property + ordered histories)."""
    from models import Property as PropertyModel  # noqa: PLC0415

    if not isinstance(prop, PropertyModel):
        raise TypeError("prop must be a Property model instance")

    price = prop.price if prop.price is not None else 0.0
    prev = prop.previous_price

    display_status = _frontend_status(prop.status, prop.price, prev)

    history_items: list[PropertyHistoryItemResponse] = []
    for h in sorted(histories, key=lambda x: x.checked_at):
        h_price = h.price if h.price is not None else price
        h_status: PropertyStatus
        if h.status in ("inactive", "error"):
            h_status = "inactive"
        else:
            h_status = "active"
        history_items.append(
            PropertyHistoryItemResponse(
                price=float(h_price),
                date=h.checked_at.date().isoformat(),
                status=h_status,
            )
        )

    if not history_items:
        history_items.append(
            PropertyHistoryItemResponse(
                price=float(price),
                date=prop.updated_at.date().isoformat(),
                status="inactive"
                if display_status == "inactive"
                else "active",
            )
        )

    pt = prop.property_type or "sale"
    if pt not in ("sale", "rent"):
        pt = "sale"

    db_raw = prop.status or "active"
    listing_status: ListingStatus = (
        db_raw if db_raw in ("active", "inactive", "error") else "active"
    )

    return PropertyResponse(
        id=prop.id,
        url=prop.url,
        title=prop.title or "Imóvel",
        price=float(price),
        previous_price=prev,
        bedrooms=prop.bedrooms or 0,
        bathrooms=prop.bathrooms or 0,
        suites=prop.suites or 0,
        size=prop.size or "—",
        parking_spots=prop.parking_spots or 0,
        address=prop.address or "",
        neighborhood=prop.neighborhood or "",
        city=prop.city or "",
        property_type=pt,  # alias "type" in JSON
        status=display_status,
        listing_status=listing_status,
        source=prop.source or "—",
        image_url=prop.image_url or "",
        comment=getattr(prop, "comment", None) or "",
        favorite=bool(getattr(prop, "favorite", False)),
        created_at=prop.created_at.isoformat().replace("+00:00", "Z"),
        updated_at=prop.updated_at.isoformat().replace("+00:00", "Z"),
        history=history_items,
    )
