"""Adapter for novafreitas.com.br (Kurole-style URLs)."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from adapters.base import PortalAdapter, PropertyData
from adapters.parsing import first_int, parse_brl_price


class NovaFreitasAdapter(PortalAdapter):
    def can_handle(self, url: str) -> bool:
        return "novafreitas.com.br" in urlparse(url).netloc.lower()

    def get_source_label(self, url: str) -> str:
        return "Nova Freitas"

    def _type_from_url(self, path: str) -> str:
        pl = path.lower()
        if "/alugar/" in pl:
            return "rent"
        if "/vender/" in pl or "/venda/" in pl:
            return "sale"
        return "sale"

    async def extract(self, page) -> PropertyData:
        body_text = await page.locator("body").inner_text()
        url = page.url
        path = urlparse(url).path or ""

        title = await page.title()
        h1_loc = page.locator("h1")
        if await h1_loc.count() > 0:
            h1 = (await h1_loc.first.inner_text()).strip()
            if len(h1) > 3:
                title = h1

        price = parse_brl_price(body_text)

        bedrooms = first_int(r"(\d+)\s*(?:quarto|quartos|dorm|dormit)", body_text)
        suites = first_int(r"(\d+)\s*su[ií]te", body_text)
        bathrooms = first_int(r"(\d+)\s*banheiro", body_text)
        parking = first_int(r"(\d+)\s*(?:garagem|vaga)", body_text)

        area_m = re.search(
            r"(\d+(?:[.,]\d+)?)\s*m[²2]",
            body_text,
            re.IGNORECASE,
        )
        size: str | None = None
        if area_m:
            size = f"{area_m.group(1).replace(',', '.')}m²"

        ref = None
        ref_m = re.search(
            r"(?:Referência|Referencia|Cód\.?)\s*[:\s]*(\d+)",
            body_text,
            re.IGNORECASE,
        )
        if ref_m:
            ref = ref_m.group(1).strip()

        condo_fee: float | None = None
        condo_m = re.search(
            r"Condom[ií]nio\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
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

        iptu: float | None = None
        iptu_m = re.search(
            r"IPTU\s*([\d]{1,3}(?:\.\d{3})*(?:,\d{2})?)",
            body_text.replace("\xa0", " "),
            re.IGNORECASE,
        )
        if iptu_m:
            try:
                iptu = float(iptu_m.group(1).replace(".", "").replace(",", "."))
            except ValueError:
                pass

        neighborhood = ""
        city = ""
        loc_m = re.search(
            r"Localização[^\n]*\n*([^\n]+)",
            body_text,
            re.IGNORECASE,
        )
        if loc_m:
            neighborhood = loc_m.group(1).strip()[:200]

        desc_m = re.search(
            r"Descrição do Imóvel\s*([\s\S]{30,2000}?)(?:##|Itens do Imóvel|---)",
            body_text,
            re.IGNORECASE,
        )
        description = desc_m.group(1).strip()[:2000] if desc_m else None

        og_image = await page.locator('meta[property="og:image"]').get_attribute("content")

        pt = self._type_from_url(path)
        bl = body_text[:1200].lower()
        if pt == "sale" and ("aluguel" in bl or "locação" in bl) and "venda" not in bl[:200]:
            pt = "rent"

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
