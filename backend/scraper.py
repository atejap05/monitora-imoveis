"""Playwright scraper: Primeira Porta structured extraction + generic fallback."""

from __future__ import annotations

import asyncio
import json
import re
from urllib.parse import urlparse

from playwright.async_api import async_playwright

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
    if "aluguel" in u or "locacao" in u or "locação" in u:
        return "rent"
    if "venda" in u:
        return "sale"
    return None


def _parse_brl_price(text: str) -> float | None:
    """Extract first BRL price from text (e.g. R$ 1.300.000,00)."""
    if not text:
        return None
    matches = re.findall(
        r"R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
        text.replace("\xa0", " "),
    )
    for m in matches:
        normalized = m.replace(".", "").replace(",", ".")
        try:
            return float(normalized)
        except ValueError:
            continue
    return None


def _first_int(pattern: str, text: str) -> int | None:
    m = re.search(pattern, text, re.IGNORECASE)
    if not m:
        return None
    try:
        return int(m.group(1))
    except (ValueError, IndexError):
        return None


async def _scrape_primeira_porta(page) -> dict:
    """Structured extraction for primeiraporta.com.br listing pages."""
    title = await page.title()
    body_text = await page.locator("body").inner_text()

    price = _parse_brl_price(body_text)

    bedrooms = _first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
    suites = _first_int(r"(\d+)\s*(?:su[ií]te|su[ií]tes)", body_text)
    bathrooms = _first_int(r"(\d+)\s*(?:banheiro|banheiros)", body_text)
    parking = _first_int(r"(\d+)\s*(?:vaga|vagas)", body_text)

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

    # Common patterns: "Bairro X" / city line
    loc_block = body_text[:4000]
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

    # Try meta description / og for cleaner title
    og_title = await page.locator('meta[property="og:title"]').get_attribute("content")
    if og_title and len(og_title) > 5:
        title = og_title.strip()

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
        "raw_text_sample": body_text[:800],
        "status": "active",
    }


async def fetch_property_data(url: str) -> dict:
    """
    Fetch property data from a URL using Playwright.
    Returns keys aligned with models.Property (optional fields may be None).
    """
    parsed = urlparse(url)
    if not parsed.scheme or not parsed.netloc:
        return {"status": "error", "error": "URL inválida"}

    host = parsed.netloc.lower()
    is_primeira = "primeiraporta" in host
    source = _host_label(url)
    sale_rent = _detect_sale_rent(url)

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(user_agent=USER_AGENT)
        page = await context.new_page()

        try:
            response = await page.goto(
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

            await page.wait_for_timeout(2500)

            if is_primeira:
                data = await _scrape_primeira_porta(page)
            else:
                title = await page.title()
                body_text = await page.locator("body").inner_text()
                data = {
                    "title": title or "Imóvel",
                    "price": _parse_brl_price(body_text),
                    "bedrooms": _first_int(
                        r"(\d+)\s*(?:quarto|quartos|dorm)",
                        body_text,
                    ),
                    "bathrooms": _first_int(
                        r"(\d+)\s*(?:banheiro|banheiros)",
                        body_text,
                    ),
                    "suites": _first_int(r"(\d+)\s*su[ií]te", body_text),
                    "size": None,
                    "parking_spots": _first_int(r"(\d+)\s*vaga", body_text),
                    "address": "",
                    "neighborhood": "",
                    "city": "",
                    "raw_text_sample": body_text[:800],
                    "status": "active",
                }

            data["source"] = source
            if sale_rent:
                data["property_type"] = sale_rent
            elif is_primeira:
                # Infer from page text if URL did not contain venda/aluguel
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
            await browser.close()


if __name__ == "__main__":
    test_url = (
        "https://www.primeiraporta.com.br/imovel/4109009/"
        "apartamento-venda-sao-jose-dos-campos-sp-jardim-das-industrias"
    )
    print(f"Testing scraper on {test_url}")
    result = asyncio.run(fetch_property_data(test_url))
    print(json.dumps(result, indent=2, ensure_ascii=False))
