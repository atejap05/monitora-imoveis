"""Adapter for primeiraporta.com.br listing pages."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import detect_sale_rent, first_int, parse_brl_price


class PrimeiraPortaAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        return "primeiraporta" in urlparse(url).netloc.lower()

    def get_source_label(self, url: str) -> str:
        return "Primeira Porta"

    async def extract(self, page) -> PropertyData:
        title = await page.title()
        body_text = await page.locator("body").inner_text()

        price = parse_brl_price(body_text)

        bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
        suites = first_int(r"(\d+)\s*(?:su[ií]te|su[ií]tes)", body_text)
        bathrooms = first_int(r"(\d+)\s*(?:banheiro|banheiros)", body_text)
        parking = first_int(r"(\d+)\s*(?:vaga|vagas)", body_text)

        area_m = re.search(
            r"(\d+(?:[.,]\d+)?)\s*m[²2]",
            body_text,
            re.IGNORECASE,
        )
        size: str | None = None
        if area_m:
            size = f"{area_m.group(1).replace(',', '.')}m²"

        neighborhood = ""
        city = ""
        address = ""

        loc_block = body_text[:4000]
        nb = re.search(r"(?:Bairro|bairro)\s*[:\-]?\s*([^\n,]+)", loc_block)
        if nb:
            neighborhood = nb.group(1).strip()[:120]

        city_match = re.search(
            r"([A-Za-zÀ-ÿ\s]+)\s*[-–]\s*([A-Z]{2})\b",
            loc_block,
        )
        if city_match:
            city = f"{city_match.group(1).strip()} - {city_match.group(2)}"

        og_title = await page.locator('meta[property="og:title"]').get_attribute("content")
        if og_title and len(og_title) > 5:
            title = og_title.strip()

        current_url = page.url
        sr = detect_sale_rent(current_url)
        if not sr:
            body_lower = body_text[:800].lower()
            if "aluguel" in body_lower or "locação" in body_lower:
                sr = "rent"
            else:
                sr = "sale"

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        return PropertyData(
            title=title or "Imóvel",
            price=price,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            suites=suites,
            size=size,
            parking_spots=parking,
            address=address,
            neighborhood=neighborhood,
            city=city,
            property_type=sr,
            source=self.get_source_label(current_url),
            image_url=og_image.strip() if og_image else None,
            raw_text_sample=body_text[:800],
            status="active",
        )
