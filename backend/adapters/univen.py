"""Adapter for Univen/Agiliza Union sites (GI Intervale, Trilar, Wilson Imóveis)."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import first_int, parse_all_brl_prices, parse_brl_price


_UNIVEN_HOSTS = (
    "gintervale.com.br",
    "trilarvaleimoveis.com.br",
    "wilsonimoveisvale.com.br",
)


def _label_for_host(netloc: str) -> str:
    n = netloc.lower().replace("www.", "")
    if "gintervale" in n:
        return "GI Intervale"
    if "trilar" in n:
        return "Trilar Imóveis"
    if "wilson" in n:
        return "Wilson Imóveis"
    return n or "—"


class UnivenAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        host = urlparse(url).netloc.lower().replace("www.", "")
        return any(h in host for h in _UNIVEN_HOSTS)

    def get_source_label(self, url: str) -> str:
        return _label_for_host(urlparse(url).netloc)

    def _property_type_from_path(self, path: str) -> str:
        p = path.lower()
        if "/alugar/" in p or "comprar-ou-alugar" in p and "alugar" in p:
            return "rent"
        if "/comprar/" in p:
            return "sale"
        return "sale"

    async def extract(self, page) -> PropertyData:
        body_text = await page.locator("body").inner_text()
        url = page.url
        parsed = urlparse(url)
        path = parsed.path or ""

        title = await page.title()
        h1_loc = page.locator("h1")
        if await h1_loc.count() > 0:
            h1 = (await h1_loc.first.inner_text()).strip()
            if len(h1) > 3:
                title = h1

        price = parse_brl_price(body_text)

        bedrooms = first_int(r"(\d+)\s*dormit", body_text) or first_int(
            r"(\d+)\s*dorms",
            body_text,
        )
        suites_m = re.search(
            r"sendo\s+(\d+)\s*su[ií]te",
            body_text,
            re.IGNORECASE,
        )
        suites = int(suites_m.group(1)) if suites_m else first_int(
            r"(\d+)\s*su[ií]te",
            body_text,
        )
        bathrooms = first_int(r"(\d+)\s*banheiro", body_text)
        parking = first_int(r"(\d+)\s*vaga", body_text)

        area_m = re.search(
            r"(\d+(?:[.,]\d+)?)\s*m[²2]\s*(?:total|útil|terreno|constru[ií]da)?",
            body_text,
            re.IGNORECASE,
        )
        size: str | None = None
        if area_m:
            size = f"{area_m.group(1).replace(',', '.')}m²"

        neighborhood = ""
        city = ""
        sub = re.search(
            r"^([^-\n]+)\s*[-–]\s*([^/\n]+/SP)",
            body_text,
            re.MULTILINE,
        )
        if sub:
            neighborhood = sub.group(1).strip()[:120]
            city = sub.group(2).strip()

        ref = None
        ref_m = re.search(
            r"(?:Referência|Referencia|Ref\.)\s*[:\s]*([A-Z]{0,3}\d+)",
            body_text,
            re.IGNORECASE,
        )
        if ref_m:
            ref = ref_m.group(1).strip()

        condo_fee: float | None = None
        iptu: float | None = None
        condo_m = re.search(
            r"Condom[ií]nio\s*R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
            body_text.replace("\xa0", " "),
            re.IGNORECASE,
        )
        if condo_m:
            try:
                condo_fee = float(
                    condo_m.group(1).replace(".", "").replace(",", "."),
                )
            except ValueError:
                pass

        iptu_m = re.search(
            r"IPTU\s*(?:Anual|Mensal)?\s*R\$\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
            body_text.replace("\xa0", " "),
            re.IGNORECASE,
        )
        if iptu_m:
            try:
                iptu = float(iptu_m.group(1).replace(".", "").replace(",", "."))
            except ValueError:
                pass

        description: str | None = None
        dm = re.search(
            r"Descrição do imóvel\s*[-—]*\s*([\s\S]{50,2000}?)(?:###|Mais detalhes|Características|Itens do Imóvel)",
            body_text,
            re.IGNORECASE,
        )
        if dm:
            description = dm.group(1).strip()[:2000]

        pl = path.lower()
        if "/alugar/" in pl and "comprar-ou-alugar" not in pl:
            pt = "rent"
        elif "/comprar/" in pl and "comprar-ou-alugar" not in pl:
            pt = "sale"
        elif "comprar-ou-alugar" in pl:
            low = body_text.lower()
            venda_pos = low.find("venda")
            loc_pos = low.find("locação")
            if loc_pos != -1 and (venda_pos == -1 or loc_pos < venda_pos):
                pt = "rent"
            else:
                pt = "sale"
        else:
            pt = self._property_type_from_path(path)

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        prices = parse_all_brl_prices(body_text)
        if prices and price is None:
            price = prices[0]

        return PropertyData(
            title=title or "Imóvel",
            price=price,
            bedrooms=bedrooms,
            bathrooms=bathrooms,
            suites=suites,
            size=size,
            parking_spots=parking,
            address="",
            neighborhood=neighborhood,
            city=city,
            property_type=pt,
            source=self.get_source_label(url),
            image_url=og_image.strip() if og_image else None,
            condo_fee=condo_fee,
            iptu=iptu,
            description=description,
            reference_code=ref,
            raw_text_sample=body_text[:800],
            status="active",
        )
