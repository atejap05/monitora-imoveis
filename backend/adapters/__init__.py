"""Portal adapters registry (auto-registered on import)."""

from __future__ import annotations

from adapters.registry import AdapterRegistry

from adapters.imovelweb import ImovelWebAdapter
from adapters.nova_freitas import NovaFreitasAdapter
from adapters.olx import OlxImoveisAdapter
from adapters.primeira_porta import PrimeiraPortaAdapter
from adapters.quintoandar import QuintoAndarAdapter
from adapters.univen import UnivenAdapter
from adapters.zap_vivareal import ZapVivaRealAdapter


def _register_all() -> None:
    AdapterRegistry.clear()
    # Most specific / regional first
    AdapterRegistry.register(PrimeiraPortaAdapter())
    AdapterRegistry.register(UnivenAdapter())
    AdapterRegistry.register(NovaFreitasAdapter())
    AdapterRegistry.register(OlxImoveisAdapter())
    AdapterRegistry.register(QuintoAndarAdapter())
    AdapterRegistry.register(ImovelWebAdapter())
    AdapterRegistry.register(ZapVivaRealAdapter())


_register_all()

__all__ = [
    "AdapterRegistry",
    "PrimeiraPortaAdapter",
    "UnivenAdapter",
    "NovaFreitasAdapter",
    "OlxImoveisAdapter",
    "QuintoAndarAdapter",
    "ImovelWebAdapter",
    "ZapVivaRealAdapter",
]
