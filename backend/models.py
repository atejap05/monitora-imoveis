from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import Column, ForeignKey, Integer, Numeric, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel


class Property(SQLModel, table=True):
    __table_args__ = (
        UniqueConstraint("user_id", "url", name="uq_property_user_url"),
    )

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    url: str = Field(index=True)
    title: Optional[str] = None
    price: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2), nullable=True),
    )
    previous_price: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2), nullable=True),
    )
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    suites: Optional[int] = None
    size: Optional[str] = None
    parking_spots: Optional[int] = None
    address: Optional[str] = None
    neighborhood: Optional[str] = None
    city: Optional[str] = None
    property_type: Optional[str] = None  # "sale" | "rent"
    source: Optional[str] = None
    image_url: Optional[str] = None
    # User-edited free text (not from scraper)
    comment: Optional[str] = Field(default=None, max_length=2000)
    favorite: bool = Field(default=False)
    condo_fee: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2), nullable=True),
    )
    iptu: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2), nullable=True),
    )
    description: Optional[str] = None
    reference_code: Optional[str] = None
    # DB health: active, inactive (listing gone), error (scrape failed)
    status: str = Field(default="active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    histories: List["PropertyHistory"] = Relationship(back_populates="property")


class PropertyHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    property_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey("property.id", ondelete="CASCADE"),
            nullable=False,
            index=True,
        ),
    )
    price: Optional[Decimal] = Field(
        default=None,
        sa_column=Column(Numeric(12, 2), nullable=True),
    )
    status: str = Field(default="active")
    checked_at: datetime = Field(default_factory=datetime.utcnow)

    property: Property = Relationship(back_populates="histories")
