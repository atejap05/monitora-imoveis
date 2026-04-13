from typing import Optional, List
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime


class Property(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(index=True, unique=True)
    title: Optional[str] = None
    price: Optional[float] = None
    previous_price: Optional[float] = None
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
    # DB health: active, inactive (listing gone), error (scrape failed)
    status: str = Field(default="active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    histories: List["PropertyHistory"] = Relationship(back_populates="property")


class PropertyHistory(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    property_id: int = Field(foreign_key="property.id")
    price: Optional[float] = None
    status: str = Field(default="active")
    checked_at: datetime = Field(default_factory=datetime.utcnow)

    property: Property = Relationship(back_populates="histories")
