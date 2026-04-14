"""Regressão: URLs estilo Neon (postgresql://) devem mapear para psycopg 3."""

from db_url import normalize_postgres_dialect_url


def test_neon_style_postgresql_prefix_uses_psycopg3_driver():
    out = normalize_postgres_dialect_url("postgresql://user:pass@host/db?sslmode=require")
    assert out.startswith("postgresql+psycopg://")
    assert "host/db" in out


def test_postgres_alias_prefix():
    out = normalize_postgres_dialect_url("postgres://user:pass@host/db")
    assert out.startswith("postgresql+psycopg://")


def test_already_psycopg_unchanged():
    u = "postgresql+psycopg://user:pass@host/db"
    assert normalize_postgres_dialect_url(u) == u
