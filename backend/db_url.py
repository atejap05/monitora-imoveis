"""Normalização de DATABASE_URL para o driver instalado (psycopg 3)."""


def normalize_postgres_dialect_url(url: str) -> str:
    """
    Neon e muitos dashboards devolvem `postgresql://` ou `postgres://`.
    O SQLAlchemy usa por defeito o dialecto `psycopg2` para `postgresql://`,
    mas este projeto depende de `psycopg` (v3): `postgresql+psycopg://`.
    """
    u = (url or "").strip()
    if not u:
        return u
    if u.startswith("postgresql+psycopg://") or u.startswith("postgresql+psycopg2://"):
        return u
    if u.startswith("postgresql://"):
        return "postgresql+psycopg://" + u[len("postgresql://") :]
    if u.startswith("postgres://"):
        return "postgresql+psycopg://" + u[len("postgres://") :]
    return u
