"""ZAP Imóveis and VivaReal — Next.js __NEXT_DATA__ + body fallback."""

from __future__ import annotations

from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.next_data_extract import extract_from_playwright_page
from adapters.parsing import detect_sale_rent, first_int, parse_brl_price
class ZapVivaRealAdapter(PortalAdapter):
    _hosts = ("zapimoveis.com.br", "vivareal.com.br")

    def can_handle(self, url: str) -> bool:
        h = urlparse(url).netloc.lower().replace("www.", "")
        return any(x in h for x in self._hosts)

    def get_source_label(self, url: str) -> str:
        h = urlparse(url).netloc.lower()
        if "zapimoveis" in h:
            return "ZAP Imóveis"
        if "vivareal" in h:
            return "VivaReal"
        return "ZAP/VivaReal"

    def get_wait_time(self) -> int:
        return 5000

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
        suites = nd.get("suites")
        parking = nd.get("parking_spots")
        size = nd.get("size")
        neighborhood = (nd.get("neighborhood") or "") or ""
        city = (nd.get("city") or "") or ""
        address = (nd.get("address") or "") or ""
        image_url = nd.get("image_url")
        condo_fee = nd.get("condo_fee")
        iptu = nd.get("iptu")
        description = nd.get("description")

        if bedrooms is None:
            bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm)", body_text)
        if bathrooms is None:
            bathrooms = first_int(r"(\d+)\s*banheiro", body_text)
        if suites is None:
            suites = first_int(r"(\d+)\s*su[ií]te", body_text)
        if parking is None:
            parking = first_int(r"(\d+)\s*vaga", body_text)

        pt = nd.get("property_type") or detect_sale_rent(url)
        if not pt:
            low = body_text[:2000].lower()
            if "aluguel" in low or "locação" in low:
                pt = "rent"
            else:
                pt = "sale"

        if not image_url:
            og_image = await page.locator('meta[property="og:image"]').get_attribute("content")
            image_url = og_image.strip() if og_image else None

        return PropertyData(
            title=title or "Imóvel",
            price=float(price) if price is not None else None,
            bedrooms=int(bedrooms) if bedrooms is not None else None,
            bathrooms=int(bathrooms) if bathrooms is not None else None,
            suites=int(suites) if suites is not None else None,
            size=size if isinstance(size, str) else None,
            parking_spots=int(parking) if parking is not None else None,
            address=address,
            neighborhood=neighborhood or "",
            city=city or "",
            property_type=pt,
            source=self.get_source_label(url),
            image_url=image_url,
            condo_fee=float(condo_fee) if condo_fee is not None else None,
            iptu=float(iptu) if iptu is not None else None,
            description=description,
            raw_text_sample=body_text[:800],
            status="active",
        )
