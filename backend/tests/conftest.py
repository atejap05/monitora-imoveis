"""Configuração de testes: não iniciar APScheduler durante pytest."""

import os

# Evita Alembic/Postgres no lifespan quando o dev tem DATABASE_URL no .env
os.environ.setdefault("TESTING", "1")
os.environ.setdefault("DISABLE_SCHEDULER", "1")
os.environ.setdefault("CLERK_ISSUER", "https://example.clerk.accounts.dev")
