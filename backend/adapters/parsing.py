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


def parse_primeira_porta_desc_tags_paragraphs(paragraphs: list[str]) -> dict[str, str]:
    """
    Parse key/value lines from Primeira Porta #desc_tags <p> inner_text.
    Format: "Rótulo: valor" (value may come from <b> tags, already flattened).
    """
    out: dict[str, str] = {}
    for raw in paragraphs:
        line = " ".join(raw.split())
        if ":" not in line:
            continue
        key, _, rest = line.partition(":")
        k = key.strip()
        v = rest.strip()
        if k and v:
            out[k] = v
    return out


def parse_condominio_fee_brl(text: str) -> float | None:
    """First price after 'Condomínio' / 'Condominio' label (listing header)."""
    if not text:
        return None
    m = re.search(
        r"Condom[ií]nio\s*R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
        text.replace("\xa0", " "),
        re.IGNORECASE,
    )
    if not m:
        return None
    normalized = m.group(1).replace(".", "").replace(",", ".")
    try:
        return float(normalized)
    except ValueError:
        return None


def parse_iptu_fee_brl(text: str) -> float | None:
    """First price after IPTU label (common on regional portals)."""
    if not text:
        return None
    m = re.search(
        r"IPTU\s*(?:Anual\s*)?R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
        text.replace("\xa0", " "),
        re.IGNORECASE,
    )
    if not m:
        return None
    normalized = m.group(1).replace(".", "").replace(",", ".")
    try:
        return float(normalized)
    except ValueError:
        return None


def area_text_to_size_field(value: str) -> str | None:
    """Normalize '122,00 m²' / '533 m2' to '122.00m²' style used in the app."""
    if not value:
        return None
    cleaned = value.replace("²", "2").replace("m2", "m²")
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*m", cleaned, re.IGNORECASE)
    if not m:
        return None
    return f"{m.group(1).replace(',', '.')}m²"


def parse_leading_int(text: str) -> int | None:
    """First integer in a string (e.g. amenity span '8' or '533 m²')."""
    if not text:
        return None
    m = re.search(r"(\d+)", text.replace("\xa0", " "))
    if not m:
        return None
    try:
        return int(m.group(1))
    except ValueError:
        return None
