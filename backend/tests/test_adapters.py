"""Unit tests for portal adapters (no live network)."""

from __future__ import annotations

import asyncio

from adapters.next_data_extract import extract_from_next_data_json
from adapters.nova_freitas import NovaFreitasAdapter
from adapters.parsing import detect_sale_rent, parse_brl_price
from adapters.primeira_porta import PrimeiraPortaAdapter
from adapters.registry import AdapterRegistry
from adapters.univen import UnivenAdapter
from adapters.zap_vivareal import ZapVivaRealAdapter


def test_parse_brl_price() -> None:
    assert parse_brl_price("Foo R$ 1.234,56 bar") == 1234.56
    assert parse_brl_price("R$ 300.000,00") == 300000.0
    assert parse_brl_price("") is None


def test_detect_sale_rent() -> None:
    assert detect_sale_rent("https://x.com/alugar/sp/cidade") == "rent"
    assert detect_sale_rent("https://x.com/venda/imovel") == "sale"
    assert detect_sale_rent("https://neutral.com/p") is None


def test_registry_routes_urls() -> None:
    assert isinstance(AdapterRegistry.find("https://www.primeiraporta.com.br/x"), PrimeiraPortaAdapter)
    assert isinstance(
        AdapterRegistry.find("http://www.gintervale.com.br/alugar/sp/x/y/z/1"),
        UnivenAdapter,
    )
    assert isinstance(
        AdapterRegistry.find("https://www.zapimoveis.com.br/imovel/venda-x-id-1/"),
        ZapVivaRealAdapter,
    )
    assert isinstance(
        AdapterRegistry.find("https://www.novafreitas.com.br/alugar/X/1"),
        NovaFreitasAdapter,
    )
    assert AdapterRegistry.find("https://unknown-example.org/listing") is None


def test_extract_from_next_data_json_minimal() -> None:
    payload = {
        "props": {
            "pageProps": {
                "listing": {
                    "name": "Apartamento X",
                    "price": {"value": 450000},
                    "bedrooms": 2,
                    "bathrooms": 2,
                    "business": "SALE",
                    "address": {"neighborhood": "Centro", "city": "SJC", "state": "SP"},
                },
            },
        },
    }
    out = extract_from_next_data_json(payload)
    assert out.get("title") == "Apartamento X"
    assert out.get("price") == 450000.0
    assert out.get("bedrooms") == 2
    assert out.get("property_type") == "sale"


class _FakeLocator:
    def __init__(self, page: "_FakePage", sel: str) -> None:
        self._page = page
        self._sel = sel

    async def count(self) -> int:
        if self._sel == "h1":
            return 0
        return 1

    @property
    def first(self) -> "_FakeLocator":
        return self

    async def inner_text(self) -> str:
        if self._sel == "body":
            return self._page.body_text
        if self._sel == "h1":
            return "H1"
        return ""

    async def get_attribute(self, name: str) -> str | None:
        if "og:title" in self._sel and name == "content":
            return "OG Title Long Enough"
        if "og:image" in self._sel and name == "content":
            return None
        return None


class _FakePage:
    url = "https://www.primeiraporta.com.br/imovel/1/x"
    body_text = (
        "Apartamento\nR$ 500.000,00\n3 quartos\n2 banheiros\n1 suíte\n2 vagas\n"
        "85 m²\nBairro Jardim\nSão José dos Campos - SP"
    )

    def locator(self, sel: str) -> _FakeLocator:
        return _FakeLocator(self, sel)

    async def title(self) -> str:
        return "Title"


def test_primeira_porta_extract_uses_og_title() -> None:
    async def run() -> None:
        adapter = PrimeiraPortaAdapter()
        data = await adapter.extract(_FakePage())
        assert data.title == "OG Title Long Enough"
        assert data.price == 500000.0
        assert data.bedrooms == 3

    asyncio.run(run())


def test_univen_extract_reference_and_condo() -> None:
    html = """
    # Apartamento para Locação no X
    Referência: AP11820
    ## BAIRRO - JACAREÍ/SP
    ### Locação
    #### R$ 2.300,00
    CondomínioR$ 500,00
    IPTU AnualR$ 750,00
    2 dormitórios
    sendo 1 suíte
    2 banheiros
    1 vaga
    62,00 m² total
    Descrição do imóvel
    Texto longo do imóvel aqui.
    """

    class UnivenLoc:
        def __init__(self, page: "UnivenFakePage", sel: str) -> None:
            self._page = page
            self._sel = sel

        async def count(self) -> int:
            return 0 if self._sel == "h1" else 1

        @property
        def first(self) -> "UnivenLoc":
            return self

        async def inner_text(self) -> str:
            if self._sel == "body":
                return self._page.body_html.strip()
            if self._sel == "h1":
                return "H1 título"
            return ""

        async def get_attribute(self, _name: str) -> None:
            return None

    class UnivenFakePage:
        body_html = html

        def __init__(self) -> None:
            self.url = (
                "http://www.gintervale.com.br/alugar/sp/jacarei/bairro/apartamento/123"
            )

        def locator(self, sel: str) -> UnivenLoc:
            return UnivenLoc(self, sel)

        async def title(self) -> str:
            return "T"

    async def run() -> None:
        data = await UnivenAdapter().extract(UnivenFakePage())
        assert data.reference_code == "AP11820"
        assert data.condo_fee == 500.0
        assert data.iptu == 750.0
        assert data.property_type == "rent"

    asyncio.run(run())
