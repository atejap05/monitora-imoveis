"""Playwright sync scraper used by the API and jobs.

Portal-specific logic lives in `adapters/` (e.g. `scrape_cid_imoveis_sync`, Primeira Porta
`#desc_tags` parsing) and is mirrored by `AdapterRegistry` adapters for async tests.
"""

from __future__ import annotations

import asyncio
import json
import re
from urllib.parse import urlparse

from playwright.sync_api import sync_playwright

from adapters.cid_imoveis import scrape_cid_imoveis_sync
from adapters.parsing import (
    area_text_to_size_field,
    parse_brl_price,
    parse_condominio_fee_brl,
    parse_iptu_fee_brl,
    parse_primeira_porta_desc_tags_paragraphs,
)

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
)


def _host_label(url: str) -> str:
    netloc = urlparse(url).netloc.lower()
    if "primeiraporta" in netloc:
        return "Primeira Porta"
    return netloc.replace("www.", "") or "—"


def _detect_sale_rent(url: str) -> str | None:
    u = url.lower()
    if "from=rent" in u or "from=aluguel" in u:
        return "rent"
    if "from=sale" in u or "from=venda" in u:
        return "sale"
    if "aluguel" in u or "locacao" in u or "locação" in u:
        return "rent"
    if "venda" in u:
        return "sale"
    return None


def _first_int(pattern: str, text: str) -> int | None:
    m = re.search(pattern, text, re.IGNORECASE)
    if not m:
        return None
    try:
        return int(m.group(1))
    except (ValueError, IndexError):
        return None


def _first_int_any(patterns: list[str], text: str) -> int | None:
    for pat in patterns:
        v = _first_int(pat, text)
        if v is not None:
            return v
    return None


def _parse_i9vale_url(url: str) -> dict:
    """
    Slug Kenlo/i9vale costuma trazer quartos e m² no path, ex.:
    .../apartamento-sao-jose-dos-campos-4-quartos-278-m/AP4891-I9V
    """
    path = urlparse(url).path
    out: dict = {}
    m = re.search(r"-(\d+)-quartos-(\d+)-m(?:/|$)", path, re.IGNORECASE)
    if m:
        out["bedrooms"] = int(m.group(1))
        out["size"] = f"{m.group(2)}m²"
    return out


def _collect_desc_tags_sync(page) -> dict[str, str]:
    loc = page.locator("#desc_tags p")
    n = loc.count()
    if n == 0:
        return {}
    paragraphs: list[str] = []
    for i in range(n):
        paragraphs.append(loc.nth(i).inner_text())
    return parse_primeira_porta_desc_tags_paragraphs(paragraphs)


def _scrape_i9vale_sync(page) -> dict:
    """Kenlo / i9vale: rótulos colados ao número (ex.: Quartos4) ou URL com -N-quartos-M-m."""
    title = page.title()
    body_text = page.locator("body").inner_text()
    page_url = page.url
    url_hints = _parse_i9vale_url(page_url)

    price = parse_brl_price(body_text)

    # Número depois do rótulo (comum) ou antes ("4 Quartos")
    bedrooms = _first_int_any(
        [
            r"Quartos\s*(\d+)",
            r"Dormit[oó]rios?\s*(\d+)",
            r"(\d+)\s*Quartos\b",
            r"(\d+)\s*quartos\b",
        ],
        body_text,
    )
    if bedrooms is None and url_hints.get("bedrooms") is not None:
        bedrooms = url_hints["bedrooms"]

    suites = _first_int_any(
        [
            r"Su[ií]tes\s*(\d+)",
            r"Su[ií]te\s*(\d+)",
            r"(\d+)\s*Su[ií]tes?\b",
        ],
        body_text,
    )

    bathrooms = _first_int_any(
        [
            r"Banheiros?\s*(\d+)",
            r"(\d+)\s*Banheiros?\b",
        ],
        body_text,
    )

    parking_spots = _first_int_any(
        [
            r"Vagas\s*(\d+)",
            r"(\d+)\s*Vagas\b",
        ],
        body_text,
    )

    size: str | None = None
    for pat in (
        r"Área\s+útil\s*(\d+)\s*m",
        r"Área\s+privativa\s*(\d+)\s*m",
        r"Área\s+construída\s*(\d+)\s*m",
        r"Área\s+bruta\s*(\d+)\s*m",
        r"Área\s+do\s+terreno\s*(\d+)\s*m",
    ):
        m = re.search(pat, body_text, re.IGNORECASE)
        if m:
            size = f"{m.group(1)}m²"
            break
    if not size and url_hints.get("size"):
        size = url_hints["size"]
    if not size:
        area_m = re.search(
            r"(\d+)\s*m\s*[²2]",
            body_text,
            re.IGNORECASE,
        )
        if area_m:
            size = f"{area_m.group(1)}m²"

    neighborhood = ""
    city = ""
    address = ""
    loc = re.search(r"Localiza[çc][ãa]o\s*(.+)", body_text, re.IGNORECASE)
    if loc:
        first_line = loc.group(1).strip().split("\n")[0]
        line = re.sub(r"\s+", " ", first_line)[:300]
        address = line
        parts = [p.strip() for p in line.split(" - ") if p.strip()]
        if len(parts) >= 2:
            last = parts[-1]
            city = last.replace("/", " - ", 1).strip() if "/" in last else last
            neighborhood = parts[-2]
        elif len(parts) == 1:
            city = parts[0]

    og_title = page.locator('meta[property="og:title"]').get_attribute("content")
    if og_title and len(og_title) > 5:
        title = og_title.strip()

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
        "raw_text_sample": body_text[:800],
        "status": "active",
    }


def _scrape_primeira_porta_sync(page) -> dict:
    """Structured extraction for primeiraporta.com.br listing pages."""
    title = page.title()
    body_text = page.locator("body").inner_text()

    tags = _collect_desc_tags_sync(page)

    price = parse_brl_price(body_text)
    condo_fee = parse_condominio_fee_brl(body_text)
    iptu = parse_iptu_fee_brl(body_text)

    bedrooms = _first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
    suites = _first_int(r"(\d+)\s*(?:su[ií]te|su[ií]tes)", body_text)
    bathrooms = _first_int(r"(\d+)\s*(?:banheiro|banheiros)", body_text)
    parking = _first_int(r"(\d+)\s*(?:vaga|vagas)", body_text)

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
        nb = re.search(
            r"(?:Bairro|bairro)\s*[:\-]?\s*([^\n,]+)",
            loc_block,
        )
        if nb:
            neighborhood = nb.group(1).strip()[:120]

    city_match = re.search(
        r"([A-Za-zÀ-ÿ\s]+)\s*[-–]\s*([A-Z]{2})\b",
        loc_block,
    )
    if city_match:
        city = f"{city_match.group(1).strip()} - {city_match.group(2)}"

    og_title = page.locator('meta[property="og:title"]').get_attribute("content")
    if og_title and len(og_title) > 5:
        title = og_title.strip()

    og_image = page.locator('meta[property="og:image"]').get_attribute("content")

    return {
        "title": title or "Imóvel",
        "price": price,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "suites": suites,
        "size": size,
        "parking_spots": parking,
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


def _fetch_property_data_sync(url: str) -> dict:
    """Playwright sync API (runs in a worker thread; avoids asyncio subprocess on Win+Selector loop)."""
    parsed = urlparse(url)
    host = parsed.netloc.lower()
    is_primeira = "primeiraporta" in host
    is_cid = "cidimoveis.com.br" in host
    is_i9vale = "i9vale.com.br" in host or "i9vale" in host
    source = _host_label(url)
    sale_rent = _detect_sale_rent(url)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(user_agent=USER_AGENT)
        page = context.new_page()

        try:
            response = page.goto(
                url,
                wait_until="domcontentloaded",
                timeout=30000,
            )

            if response and response.status in (404, 410):
                return {
                    "status": "inactive",
                    "error": f"HTTP {response.status}",
                    "source": source,
                }

            page.wait_for_timeout(2500)
            if is_primeira:
                try:
                    page.wait_for_selector("#desc_tags", timeout=4000)
                except Exception:
                    pass
            if is_cid:
                try:
                    page.wait_for_selector("#amenity-vagas, .property-amenities", timeout=4000)
                except Exception:
                    pass

            if is_primeira:
                data = _scrape_primeira_porta_sync(page)
            elif is_cid:
                data = scrape_cid_imoveis_sync(page)
            elif is_i9vale:
                data = _scrape_i9vale_sync(page)
            else:
                title = page.title()
                body_text = page.locator("body").inner_text()
                url_hints = _parse_i9vale_url(url)
                bedrooms = _first_int_any(
                    [
                        r"Quartos\s*(\d+)",
                        r"(\d+)\s*(?:quarto|quartos|dorm)",
                        r"Dormit[oó]rios?\s*(\d+)",
                    ],
                    body_text,
                )
                if bedrooms is None and url_hints.get("bedrooms") is not None:
                    bedrooms = url_hints["bedrooms"]
                size_val = None
                if url_hints.get("size"):
                    size_val = url_hints["size"]
                if not size_val:
                    area_m = re.search(
                        r"(\d+(?:[.,]\d+)?)\s*m[²2]",
                        body_text,
                        re.IGNORECASE,
                    )
                    if area_m:
                        size_val = f"{area_m.group(1).replace(',', '.')}m²"
                data = {
                    "title": title or "Imóvel",
                    "price": parse_brl_price(body_text),
                    "bedrooms": bedrooms,
                    "bathrooms": _first_int_any(
                        [
                            r"Banheiros?\s*(\d+)",
                            r"(\d+)\s*(?:banheiro|banheiros)",
                        ],
                        body_text,
                    ),
                    "suites": _first_int_any(
                        [
                            r"Su[ií]tes?\s*(\d+)",
                            r"(\d+)\s*su[ií]tes?",
                        ],
                        body_text,
                    ),
                    "size": size_val,
                    "parking_spots": _first_int_any(
                        [r"Vagas\s*(\d+)", r"(\d+)\s*vagas?"],
                        body_text,
                    ),
                    "address": "",
                    "neighborhood": "",
                    "city": "",
                    "raw_text_sample": body_text[:800],
                    "status": "active",
                }

            data["source"] = source
            if sale_rent:
                data["property_type"] = sale_rent
            elif is_primeira or is_i9vale or is_cid:
                body_lower = (data.get("raw_text_sample") or "").lower()
                if "aluguel" in body_lower or "locação" in body_lower:
                    data["property_type"] = "rent"
                else:
                    data["property_type"] = "sale"
            else:
                data["property_type"] = sale_rent or "sale"

            return data

        except Exception as e:
            return {"status": "error", "error": str(e), "source": source}
        finally:
            browser.close()


async def fetch_property_data(url: str) -> dict:
    """
    Fetch property data from a URL using Playwright.
    Returns keys aligned with models.Property (optional fields may be None).
    """
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return {"status": "error", "error": "URL inválida"}

    return await asyncio.to_thread(_fetch_property_data_sync, url)


if __name__ == "__main__":
    test_url = (
        "https://www.primeiraporta.com.br/imovel/4109009/"
        "apartamento-venda-sao-jose-dos-campos-sp-jardim-das-industrias"
    )
    print(f"Testing scraper on {test_url}")
    result = asyncio.run(fetch_property_data(test_url))
    print(json.dumps(result, indent=2, ensure_ascii=False))
