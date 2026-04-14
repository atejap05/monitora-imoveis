"""Generic fallback: og/meta tags, JSON-LD, regex on body text."""

from __future__ import annotations

import json
import re

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import detect_sale_rent, first_int, host_label, parse_brl_price


def _walk_json_ld_find_offers(obj, depth: int = 0) -> dict | None:
    """Find Product/RealEstate-like object with offers or price."""
    if depth > 18:
        return None
    if isinstance(obj, dict):
        if isinstance(obj.get("offers"), dict):
            return obj
        typ = obj.get("@type")
        ts = typ if isinstance(typ, str) else (typ[0] if isinstance(typ, list) and typ else "")
        if ts and any(
            x in str(ts) for x in ("Product", "Residence", "Apartment", "RealEstate", "House")
        ):
            return obj
        for v in obj.values():
            found = _walk_json_ld_find_offers(v, depth + 1)
            if found:
                return found
    elif isinstance(obj, list):
        for item in obj:
            found = _walk_json_ld_find_offers(item, depth + 1)
            if found:
                return found
    return None


class GenericAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        return True  # used only as explicit fallback, not registered

    def get_source_label(self, url: str) -> str:
        return host_label(url)

    async def extract(self, page) -> PropertyData:
        body_text = await page.locator("body").inner_text()
        url = page.url

        title = await page.title()
        og_title = await page.locator('meta[property="og:title"]').get_attribute("content")
        if og_title and len(og_title.strip()) > 5:
            title = og_title.strip()

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        ld_data = await page.evaluate(
            """() => {
              const nodes = document.querySelectorAll('script[type="application/ld+json"]');
              const out = [];
              nodes.forEach(n => { try { out.push(JSON.parse(n.textContent)); } catch (e) {} });
              return out;
            }""",
        )

        price: float | None = parse_brl_price(body_text)
        description: str | None = None
        address = ""
        city = ""
        neighborhood = ""

        for blob in ld_data or []:
            node = _walk_json_ld_find_offers(blob)
            if not isinstance(node, dict):
                continue
            name = node.get("name") or node.get("headline")
            if name and isinstance(name, str) and len(name) > 5:
                title = name
            offers = node.get("offers")
            if isinstance(offers, dict):
                p = offers.get("price") or offers.get("lowPrice")
                if p is not None:
                    try:
                        price = float(str(p).replace(",", "."))
                    except ValueError:
                        pass
            desc = node.get("description")
            if isinstance(desc, str) and len(desc) > 20:
                description = desc[:4000]
            addr = node.get("address")
            if isinstance(addr, dict):
                street = addr.get("streetAddress") or ""
                city = addr.get("addressLocality") or ""
                region = addr.get("addressRegion") or ""
                address = street
                if city or region:
                    neighborhood = (addr.get("addressNeighborhood") or "")[:120]
                    city = f"{city} - {region}".strip(" -") if region else city

        if price is None and ld_data:
            try:
                raw = json.dumps(ld_data)
                price = parse_brl_price(raw)
            except Exception:
                pass

        bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
        bathrooms = first_int(r"(\d+)\s*(?:banheiro|banheiros)", body_text)
        suites = first_int(r"(\d+)\s*su[ií]te", body_text)
        parking = first_int(r"(\d+)\s*vaga", body_text)

        area_m = re.search(
            r"(\d+(?:[.,]\d+)?)\s*m[²2]",
            body_text,
            re.IGNORECASE,
        )
        size: str | None = None
        if area_m:
            size = f"{area_m.group(1).replace(',', '.')}m²"

        sr = detect_sale_rent(url)
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
            parking_spots=parking,
            address=address,
            neighborhood=neighborhood,
            city=city,
            property_type=sr,
            source=self.get_source_label(url),
            image_url=og_image.strip() if og_image else None,
            description=description,
            raw_text_sample=body_text[:800],
            status="active",
        )
