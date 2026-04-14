"""Registry of portal adapters (most specific first)."""

from __future__ import annotations

from adapters.base import PortalAdapter


class AdapterRegistry:
    _adapters: list[PortalAdapter] = []

    @classmethod
    def register(cls, adapter: PortalAdapter) -> None:
        cls._adapters.append(adapter)

    @classmethod
    def clear(cls) -> None:
        cls._adapters.clear()

    @classmethod
    def find(cls, url: str) -> PortalAdapter | None:
        for adapter in cls._adapters:
            if adapter.can_handle(url):
                return adapter
        return None
