"""ImovelWeb (Navent/ZAP group) — same strategy as ZAP with longer wait (anti-bot)."""

from __future__ import annotations

from urllib.parse import urlparse

from adapters.zap_vivareal import ZapVivaRealAdapter


class ImovelWebAdapter(ZapVivaRealAdapter):
    def can_handle(self, url: str) -> bool:
        return "imovelweb.com.br" in urlparse(url).netloc.lower()

    def get_source_label(self, url: str) -> str:
        return "ImovelWeb"

    def get_wait_time(self) -> int:
        return 7000
