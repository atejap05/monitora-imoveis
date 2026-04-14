"""Configuração de testes: não iniciar APScheduler durante pytest."""

import os

os.environ.setdefault("DISABLE_SCHEDULER", "1")
os.environ.setdefault("CLERK_ISSUER", "https://example.clerk.accounts.dev")
