"""Base types and abstract adapter for portal-specific scrapers."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass, field


@dataclass
class PropertyData:
    title: str
    price: float | None
    bedrooms: int | None
    bathrooms: int | None
    suites: int | None
    size: str | None
    parking_spots: int | None
    address: str
    neighborhood: str
    city: str
    property_type: str  # "sale" | "rent"
    source: str
    image_url: str | None
    condo_fee: float | None = None
    iptu: float | None = None
    description: str | None = None
    reference_code: str | None = None
    raw_text_sample: str = ""
    status: str = "active"

    def to_scrape_dict(self) -> dict:
        """Dict aligned with models.Property / router create_property."""
        d = asdict(self)
        return d


class PortalAdapter(ABC):
    @abstractmethod
    def can_handle(self, url: str) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def extract(self, page) -> PropertyData:
        raise NotImplementedError

    @abstractmethod
    def get_source_label(self, url: str) -> str:
        raise NotImplementedError

    def get_wait_time(self) -> int:
        return 2500
