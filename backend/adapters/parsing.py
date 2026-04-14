"""Shared parsing helpers for Brazilian real estate pages."""

from __future__ import annotations

import re
from urllib.parse import urlparse


def host_label(url: str) -> str:
    netloc = urlparse(url).netloc.lower()
    if "primeiraporta" in netloc:
        return "Primeira Porta"
    return netloc.replace("www.", "") or "—"


def detect_sale_rent(url: str) -> str | None:
    u = url.lower()
    if "aluguel" in u or "locacao" in u or "locação" in u or "/alugar/" in u:
        return "rent"
    if "venda" in u or "/comprar" in u or "/vender" in u:
        return "sale"
    return None


def parse_brl_price(text: str) -> float | None:
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


def parse_all_brl_prices(text: str) -> list[float]:
    """All BRL prices in order of appearance (for condo/IPTU after main price)."""
    if not text:
        return []
    out: list[float] = []
    for m in re.findall(
        r"R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
        text.replace("\xa0", " "),
    ):
        normalized = m.replace(".", "").replace(",", ".")
        try:
            out.append(float(normalized))
        except ValueError:
            continue
    return out


def first_int(pattern: str, text: str) -> int | None:
    m = re.search(pattern, text, re.IGNORECASE)
    if not m:
        return None
    try:
        return int(m.group(1))
    except (ValueError, IndexError):
        return None


def infer_property_type_from_url(url: str) -> str | None:
    return detect_sale_rent(url)
