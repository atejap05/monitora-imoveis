"""OLX Imóveis — SPA; __NEXT_DATA__ / JSON-LD / body regex."""

from __future__ import annotations

from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.next_data_extract import extract_from_playwright_page
from adapters.parsing import detect_sale_rent, first_int, parse_brl_price


class OlxImoveisAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        u = urlparse(url)
        h = u.netloc.lower()
        return "olx.com.br" in h and "imoveis" in (u.path or "").lower()

    def get_source_label(self, url: str) -> str:
        return "OLX Imóveis"

    def get_wait_time(self) -> int:
        return 5500

    async def extract(self, page) -> PropertyData:
        url = page.url
        body_text = await page.locator("body").inner_text()

        nd = await extract_from_playwright_page(page)
        title = (nd.get("title") or "").strip() or await page.title()
        price = nd.get("price")
        if price is None:
            price = parse_brl_price(body_text)

        bedrooms = nd.get("bedrooms")
        bathrooms = nd.get("bathrooms")
        parking = nd.get("parking_spots")

        if bedrooms is None:
            bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm)", body_text)
        if bathrooms is None:
            bathrooms = first_int(r"(\d+)\s*banheiro", body_text)
        if parking is None:
            parking = first_int(r"(\d+)\s*vaga", body_text)

        pt = nd.get("property_type") or detect_sale_rent(url)
        if not pt:
            low = body_text[:2000].lower()
            if "aluguel" in low or "/aluguel/" in url.lower():
                pt = "rent"
            else:
                pt = "sale"

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        return PropertyData(
            title=title or "Imóvel",
            price=float(price) if price is not None else None,
            bedrooms=int(bedrooms) if bedrooms is not None else None,
            bathrooms=int(bathrooms) if bathrooms is not None else None,
            suites=int(nd.get("suites")) if nd.get("suites") is not None else None,
            size=nd.get("size") if isinstance(nd.get("size"), str) else None,
            parking_spots=int(parking) if parking is not None else None,
            address=(nd.get("address") or "") or "",
            neighborhood=(nd.get("neighborhood") or "") or "",
            city=(nd.get("city") or "") or "",
            property_type=pt,
            source=self.get_source_label(url),
            image_url=og_image.strip() if og_image else None,
            description=nd.get("description"),
            raw_text_sample=body_text[:800],
            status="active",
        )
