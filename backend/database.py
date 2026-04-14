"""SQLAlchemy engine and session dependency (SQLite local dev or PostgreSQL via DATABASE_URL)."""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import event
from sqlmodel import Session, SQLModel, create_engine

load_dotenv(Path(__file__).resolve().parent / ".env")

from db_url import normalize_postgres_dialect_url

_raw_db = os.environ.get("DATABASE_URL", "").strip() or None
DATABASE_URL = normalize_postgres_dialect_url(_raw_db) if _raw_db else None

if DATABASE_URL:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=5,
        max_overflow=10,
    )
else:
    sqlite_file_name = "database.db"
    sqlite_url = f"sqlite:///{sqlite_file_name}"
    connect_args = {"check_same_thread": False}
    engine = create_engine(sqlite_url, echo=False, connect_args=connect_args)

    @event.listens_for(engine, "connect")
    def _set_sqlite_pragma(dbapi_conn, _connection_record) -> None:
        cursor = dbapi_conn.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


def is_postgresql() -> bool:
    return bool(DATABASE_URL)


def create_db_and_tables() -> None:
    from models import Property, PropertyHistory  # noqa: F401, PLC0415

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
