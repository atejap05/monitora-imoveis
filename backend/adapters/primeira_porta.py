"""Adapter for primeiraporta.com.br listing pages."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import (
    area_text_to_size_field,
    detect_sale_rent,
    first_int,
    parse_brl_price,
    parse_condominio_fee_brl,
    parse_iptu_fee_brl,
    parse_primeira_porta_desc_tags_paragraphs,
)


async def _collect_desc_tags_async(page) -> dict[str, str]:
    loc = page.locator("#desc_tags p")
    n = await loc.count()
    if n == 0:
        return {}
    paragraphs: list[str] = []
    for i in range(n):
        paragraphs.append(await loc.nth(i).inner_text())
    return parse_primeira_porta_desc_tags_paragraphs(paragraphs)


class PrimeiraPortaAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        return "primeiraporta" in urlparse(url).netloc.lower()

    def get_source_label(self, url: str) -> str:
        return "Primeira Porta"

    async def extract(self, page) -> PropertyData:
        title = await page.title()
        body_text = await page.locator("body").inner_text()
        tags = await _collect_desc_tags_async(page)

        price = parse_brl_price(body_text)
        condo_fee = parse_condominio_fee_brl(body_text)
        iptu = parse_iptu_fee_brl(body_text)

        bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
        suites = first_int(r"(\d+)\s*(?:su[ií]te|su[ií]tes)", body_text)
        bathrooms = first_int(r"(\d+)\s*(?:banheiro|banheiros)", body_text)
        parking = first_int(r"(\d+)\s*(?:vaga|vagas)", body_text)

        size: str | None = None
        if "Área Útil" in tags:
            size = area_text_to_size_field(tags["Área Útil"])
        if size is None and "Área Total" in tags:
            size = area_text_to_size_field(tags["Área Total"])
        if size is None:
            area_m = re.search(
                r"(\d+(?:[.,]\d+)?)\s*m[²2]",
                body_text,
                re.IGNORECASE,
            )
            if area_m:
                size = f"{area_m.group(1).replace(',', '.')}m²"

        neighborhood = ""
        city = ""
        address = ""
        reference_code: str | None = None

        if tags.get("Bairro"):
            neighborhood = tags["Bairro"].strip()[:120]
        if tags.get("Endereço"):
            address = tags["Endereço"].strip()[:500]
        if tags.get("Código"):
            reference_code = tags["Código"].strip()[:80]

        loc_block = body_text[:4000]
        if not neighborhood:
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
            condo_fee=condo_fee,
            iptu=iptu,
            reference_code=reference_code,
            raw_text_sample=body_text[:800],
            status="active",
        )
