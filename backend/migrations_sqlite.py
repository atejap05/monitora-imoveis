"""Idempotent SQLite ALTERs for existing database files (create_all alone does not add new columns)."""

from __future__ import annotations

from sqlalchemy import text

from models import Property


def migrate_sqlite_schema(engine) -> None:
    """Add columns missing from older DBs. Safe to run on every startup."""
    table_name = Property.__tablename__ or "property"

    with engine.connect() as raw_conn:
        conn = raw_conn.execution_options(isolation_level="AUTOCOMMIT")
        rows = conn.execute(text(f'PRAGMA table_info("{table_name}")')).all()
        # cid, name, type, notnull, dflt_value, pk
        existing = {str(r[1]) for r in rows}

        if "favorite" not in existing:
            conn.execute(
                text(
                    f'ALTER TABLE "{table_name}" ADD COLUMN favorite INTEGER NOT NULL DEFAULT 0'
                ),
            )
        if "comment" not in existing:
            conn.execute(
                text(
                    f'ALTER TABLE "{table_name}" ADD COLUMN comment TEXT NULL'
                ),
            )
