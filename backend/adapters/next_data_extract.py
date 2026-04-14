"""Extract listing-like fields from Next.js __NEXT_DATA__ JSON (ZAP/VivaReal/ImovelWeb)."""

from __future__ import annotations

import json
from typing import Any


def _as_float(val: Any) -> float | None:
    if val is None:
        return None
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).replace(".", "").replace(",", ".") if isinstance(val, str) else str(val)
    try:
        return float(s)
    except ValueError:
        return None


def _walk_find_dicts_with_keys(obj: Any, keys: set[str], depth: int = 0) -> list[dict]:
    """Collect dicts that contain at least one of the given keys (case-insensitive)."""
    if depth > 24:
        return []
    found: list[dict] = []
    if isinstance(obj, dict):
        lower_keys = {k.lower() if isinstance(k, str) else str(k) for k in obj.keys()}
        if keys & lower_keys:
            found.append(obj)
        for v in obj.values():
            found.extend(_walk_find_dicts_with_keys(v, keys, depth + 1))
    elif isinstance(obj, list):
        for item in obj:
            found.extend(_walk_find_dicts_with_keys(item, keys, depth + 1))
    return found


def extract_from_next_data_json(data: dict) -> dict[str, Any]:
    """
    Best-effort extraction of listing fields from __NEXT_DATA__ JSON.
    Returns keys: title, price, bedrooms, bathrooms, suites, parking_spots,
    area_total, area_usable, neighborhood, city, state, image_url, property_type,
    condo_fee, iptu, description, reference_code
    """
    out: dict[str, Any] = {
        "title": None,
        "price": None,
        "bedrooms": None,
        "bathrooms": None,
        "suites": None,
        "parking_spots": None,
        "size": None,
        "neighborhood": None,
        "city": None,
        "address": None,
        "image_url": None,
        "property_type": None,
        "condo_fee": None,
        "iptu": None,
        "description": None,
    }

    candidates = _walk_find_dicts_with_keys(
        data,
        {
            "price",
            "listingprice",
            "rental",
            "business",
            "bedrooms",
            "bathrooms",
            "usableareas",
            "totalareas",
        },
    )

    best: dict | None = None
    for c in candidates:
        if "price" in c or "listingPrice" in c:
            best = c
            break
    if not best and candidates:
        best = candidates[0]

    if not best:
        return out

    # Title / name
    for k in ("name", "title", "listingTitle", "headline"):
        if k in best and best[k]:
            out["title"] = str(best[k])
            break

    # Price
    price_obj = best.get("price") or best.get("listingPrice") or best.get("rentalPrice")
    if isinstance(price_obj, dict):
        out["price"] = _as_float(
            price_obj.get("value") or price_obj.get("mainValue"),
        )
    elif price_obj is not None:
        out["price"] = _as_float(price_obj)

    # IPTU / condo nested
    for k in ("condoFee", "condominium", "condominiumFee"):
        if k in best:
            v = best[k]
            if isinstance(v, dict):
                out["condo_fee"] = _as_float(v.get("value"))
            else:
                out["condo_fee"] = _as_float(v)
    for k in ("iptu", "iptuFee", "IPTU"):
        if k in best:
            v = best[k]
            if isinstance(v, dict):
                out["iptu"] = _as_float(v.get("value"))
            else:
                out["iptu"] = _as_float(v)

    # Counts
    for k in ("bedrooms", "bedroomsTotal", "totalBedrooms"):
        if k in best and best[k] is not None:
            try:
                out["bedrooms"] = int(best[k])
            except (TypeError, ValueError):
                pass
            break
    for k in ("bathrooms", "totalBathrooms"):
        if k in best and best[k] is not None:
            try:
                out["bathrooms"] = int(best[k])
            except (TypeError, ValueError):
                pass
            break
    for k in ("suites", "totalSuites"):
        if k in best and best[k] is not None:
            try:
                out["suites"] = int(best[k])
            except (TypeError, ValueError):
                pass
            break
    for k in ("parkingSpaces", "parking", "totalParkingSpaces"):
        if k in best and best[k] is not None:
            try:
                out["parking_spots"] = int(best[k])
            except (TypeError, ValueError):
                pass
            break

    # Areas
    ua = best.get("usableAreas") or best.get("usableArea")
    ta = best.get("totalAreas") or best.get("totalArea")
    if isinstance(ua, dict):
        out["size"] = f"{ua.get('squareMeter', '')}m²" if ua.get("squareMeter") else None
    elif isinstance(ua, (int, float)):
        out["size"] = f"{ua}m²"
    if not out["size"] and isinstance(ta, dict):
        out["size"] = f"{ta.get('squareMeter', '')}m²" if ta.get("squareMeter") else None

    # Address
    addr = best.get("address") or best.get("fullAddress")
    if isinstance(addr, dict):
        out["neighborhood"] = addr.get("neighborhood") or addr.get("name")
        out["city"] = addr.get("city")
        st = addr.get("state")
        if out["city"] and st:
            out["city"] = f"{out['city']} - {st}"
        if addr.get("street"):
            out["address"] = addr.get("street")

    # Business type
    biz = best.get("business") or best.get("businessType")
    if isinstance(biz, str):
        if "RENT" in biz.upper() or "ALUGUEL" in biz.upper():
            out["property_type"] = "rent"
        elif "SALE" in biz.upper() or "VENDA" in biz.upper():
            out["property_type"] = "sale"

    # Images
    media = best.get("images") or best.get("medias")
    if isinstance(media, list) and media:
        m0 = media[0]
        if isinstance(m0, dict):
            out["image_url"] = m0.get("url") or m0.get("href")
        elif isinstance(m0, str):
            out["image_url"] = m0

    if best.get("description"):
        out["description"] = str(best["description"])[:4000]

    return out


async def extract_from_playwright_page(page) -> dict[str, Any]:
    """Load __NEXT_DATA__ from Playwright page and extract listing fields."""
    try:
        el = page.locator("script#__NEXT_DATA__")
        if await el.count() == 0:
            return {}
        raw = await el.first.inner_text()
        data = json.loads(raw)
        return extract_from_next_data_json(data)
    except Exception:
        return {}


def parse_next_data_script(html: str) -> dict | None:
    """Parse __NEXT_DATA__ from raw HTML string (fallback)."""
    start = html.find('id="__NEXT_DATA__"')
    if start == -1:
        start = html.find('id=\'__NEXT_DATA__\'')
    if start == -1:
        return None
    sub = html[start : start + 500000]
    m = sub.find(">")
    if m == -1:
        return None
    sub = sub[m + 1 :]
    end = sub.find("</script>")
    if end == -1:
        return None
    raw = sub[:end].strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None
