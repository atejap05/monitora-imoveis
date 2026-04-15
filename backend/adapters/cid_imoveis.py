"""CID Imóveis (cidimoveis.com.br) — barra de amenidades #amenity-*."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import (
    area_text_to_size_field,
    detect_sale_rent,
    parse_brl_price,
    parse_condominio_fee_brl,
    parse_iptu_fee_brl,
    parse_leading_int,
)


def _first_int_any(patterns: list[str], text: str) -> int | None:
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if not m:
            continue
        try:
            return int(m.group(1))
        except (ValueError, IndexError):
            continue
    return None


def _cid_amenity_int(page, amenity_id: str) -> int | None:
    loc = page.locator(f"#{amenity_id} span")
    if loc.count() == 0:
        return None
    return parse_leading_int(loc.first.inner_text())


def _cid_amenity_size(page, amenity_id: str) -> str | None:
    loc = page.locator(f"#{amenity_id} span")
    if loc.count() == 0:
        return None
    return area_text_to_size_field(loc.first.inner_text())


def scrape_cid_imoveis_sync(page) -> dict:
    """Sync Playwright page — used by scraper production path."""
    title = page.title()
    body_text = page.locator("body").inner_text()

    price = parse_brl_price(body_text)
    condo_fee = parse_condominio_fee_brl(body_text)
    iptu = parse_iptu_fee_brl(body_text)

    bedrooms = _cid_amenity_int(page, "amenity-dormitorios")
    if bedrooms is None:
        bedrooms = _first_int_any(
            [
                r"Quartos\s*(\d+)",
                r"(\d+)\s*(?:quarto|quartos|dorm)",
            ],
            body_text,
        )

    suites = _cid_amenity_int(page, "amenity-suites")
    if suites is None:
        suites = _first_int_any(
            [r"Su[ií]tes?\s*(\d+)", r"(\d+)\s*su[ií]tes?"],
            body_text,
        )

    bathrooms = _cid_amenity_int(page, "amenity-banheiros")
    if bathrooms is None:
        bathrooms = _first_int_any(
            [r"Banheiros?\s*(\d+)", r"(\d+)\s*(?:banheiro|banheiros)"],
            body_text,
        )

    parking_spots = _cid_amenity_int(page, "amenity-vagas")
    if parking_spots is None:
        parking_spots = _first_int_any(
            [r"Vagas\s*(\d+)", r"(\d+)\s*vagas?"],
            body_text,
        )

    size = _cid_amenity_size(page, "amenity-area-privativa")
    if size is None:
        size = _cid_amenity_size(page, "amenity-area-total")
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
    loc_block = body_text[:6000]
    nb = re.search(
        r"(?:Bairro|bairro)\s*[:\-]?\s*([^\n,]+)",
        loc_block,
    )
    if nb:
        neighborhood = nb.group(1).strip()[:120]

    city_match = re.search(
        r"([A-Za-zÀ-ÿ\s]+)\s*[-–/]\s*([A-Z]{2})\b",
        loc_block,
    )
    if city_match:
        city = f"{city_match.group(1).strip()} - {city_match.group(2)}"

    og_title = page.locator('meta[property="og:title"]').get_attribute("content")
    if og_title and len(og_title.strip()) > 5:
        title = og_title.strip()

    og_image = page.locator('meta[property="og:image"]').get_attribute("content")

    reference_code = None
    code_spans = page.locator(".property-amenities .col-md-1 span")
    if code_spans.count() > 0:
        ref_txt = code_spans.nth(0).inner_text().strip()
        if ref_txt.isdigit():
            reference_code = ref_txt

    return {
        "title": title or "Imóvel",
        "price": price,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "suites": suites,
        "size": size,
        "parking_spots": parking_spots,
        "address": address,
        "neighborhood": neighborhood,
        "city": city,
        "condo_fee": condo_fee,
        "iptu": iptu,
        "reference_code": reference_code,
        "image_url": og_image.strip() if og_image else None,
        "raw_text_sample": body_text[:800],
        "status": "active",
    }


async def _async_cid_amenity_int(page, amenity_id: str) -> int | None:
    loc = page.locator(f"#{amenity_id} span")
    if await loc.count() == 0:
        return None
    return parse_leading_int(await loc.first.inner_text())


async def _async_cid_amenity_size(page, amenity_id: str) -> str | None:
    loc = page.locator(f"#{amenity_id} span")
    if await loc.count() == 0:
        return None
    return area_text_to_size_field(await loc.first.inner_text())


class CidImoveisAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        return "cidimoveis.com.br" in urlparse(url).netloc.lower()

    def get_source_label(self, url: str) -> str:
        return "cidimoveis.com.br"

    def get_wait_time(self) -> int:
        return 3500

    async def extract(self, page) -> PropertyData:
        title = await page.title()
        body_text = await page.locator("body").inner_text()
        current_url = page.url

        price = parse_brl_price(body_text)
        condo_fee = parse_condominio_fee_brl(body_text)
        iptu = parse_iptu_fee_brl(body_text)

        bedrooms = await _async_cid_amenity_int(page, "amenity-dormitorios")
        if bedrooms is None:
            bedrooms = _first_int_any(
                [
                    r"Quartos\s*(\d+)",
                    r"(\d+)\s*(?:quarto|quartos|dorm)",
                ],
                body_text,
            )

        suites = await _async_cid_amenity_int(page, "amenity-suites")
        if suites is None:
            suites = _first_int_any(
                [r"Su[ií]tes?\s*(\d+)", r"(\d+)\s*su[ií]tes?"],
                body_text,
            )

        bathrooms = await _async_cid_amenity_int(page, "amenity-banheiros")
        if bathrooms is None:
            bathrooms = _first_int_any(
                [r"Banheiros?\s*(\d+)", r"(\d+)\s*(?:banheiro|banheiros)"],
                body_text,
            )

        parking_spots = await _async_cid_amenity_int(page, "amenity-vagas")
        if parking_spots is None:
            parking_spots = _first_int_any(
                [r"Vagas\s*(\d+)", r"(\d+)\s*vagas?"],
                body_text,
            )

        size = await _async_cid_amenity_size(page, "amenity-area-privativa")
        if size is None:
            size = await _async_cid_amenity_size(page, "amenity-area-total")
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
        loc_block = body_text[:6000]
        nb = re.search(
            r"(?:Bairro|bairro)\s*[:\-]?\s*([^\n,]+)",
            loc_block,
        )
        if nb:
            neighborhood = nb.group(1).strip()[:120]

        city_match = re.search(
            r"([A-Za-zÀ-ÿ\s]+)\s*[-–/]\s*([A-Z]{2})\b",
            loc_block,
        )
        if city_match:
            city = f"{city_match.group(1).strip()} - {city_match.group(2)}"

        og_title = await page.locator('meta[property="og:title"]').get_attribute("content")
        if og_title and len(og_title.strip()) > 5:
            title = og_title.strip()

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        reference_code = None
        code_spans = page.locator(".property-amenities .col-md-1 span")
        if await code_spans.count() > 0:
            ref_txt = (await code_spans.nth(0).inner_text()).strip()
            if ref_txt.isdigit():
                reference_code = ref_txt

        sr = detect_sale_rent(current_url)
        if not sr:
            low = body_text[:1500].lower()
            if "aluguel" in low or "locação" in low:
                sr = "rent"
            else:
                sr = "sale"

        return PropertyData(
            title=title or "Imóvel",
            price=price,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            suites=suites,
            size=size,
            parking_spots=parking_spots,
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
