#!/usr/bin/env python3
"""
One-off: copiar dados de SQLite (database.db) para PostgreSQL (DATABASE_URL).

Uso (a partir da pasta backend/):
  DATABASE_URL='postgresql+psycopg://...' python scripts/migrate_data.py

Requisitos: banco destino vazio ou aceitar TRUNCATE das tabelas property / propertyhistory.
"""

from __future__ import annotations

import argparse
import os
import sys
from decimal import Decimal
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlmodel import Session, select

_BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(_BACKEND_ROOT))

load_dotenv(_BACKEND_ROOT / ".env")

from models import Property, PropertyHistory  # noqa: E402


def _money(v: object | None) -> Decimal | None:
    if v is None:
        return None
    return Decimal(str(v))


def main() -> int:
    parser = argparse.ArgumentParser(description="Migrar SQLite → PostgreSQL (Neon).")
    parser.add_argument(
        "--sqlite",
        type=Path,
        default=_BACKEND_ROOT / "database.db",
        help="Caminho para database.db (default: backend/database.db)",
    )
    args = parser.parse_args()

    target_url = os.environ.get("DATABASE_URL", "").strip()
    if not target_url:
        print("Erro: defina DATABASE_URL (PostgreSQL).", file=sys.stderr)
        return 1
    if not args.sqlite.exists():
        print(f"Erro: ficheiro SQLite não encontrado: {args.sqlite}", file=sys.stderr)
        return 1

    sqlite_eng = create_engine(
        f"sqlite:///{args.sqlite}",
        connect_args={"check_same_thread": False},
    )
    pg_eng = create_engine(
        target_url,
        pool_pre_ping=True,
    )

    with Session(sqlite_eng) as src, Session(pg_eng) as dst:
        props = src.exec(select(Property)).all()
        hists = src.exec(select(PropertyHistory)).all()

        print(f"Origem: {len(props)} imóveis, {len(hists)} linhas de histórico.")

        dst.execute(text("TRUNCATE propertyhistory, property RESTART IDENTITY CASCADE"))
        dst.commit()

        prop_ids = {p.id for p in props if p.id is not None}
        for p in sorted(props, key=lambda x: x.id or 0):
            if p.id is None:
                continue
            np = Property(
                id=p.id,
                user_id=p.user_id,
                url=p.url,
                title=p.title,
                price=_money(p.price),
                previous_price=_money(p.previous_price),
                bedrooms=p.bedrooms,
                bathrooms=p.bathrooms,
                suites=p.suites,
                size=p.size,
                parking_spots=p.parking_spots,
                address=p.address,
                neighborhood=p.neighborhood,
                city=p.city,
                property_type=p.property_type,
                source=p.source,
                image_url=p.image_url,
                comment=p.comment,
                favorite=bool(p.favorite),
                condo_fee=_money(p.condo_fee),
                iptu=_money(p.iptu),
                description=p.description,
                reference_code=p.reference_code,
                status=p.status or "active",
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
            dst.add(np)

        dst.commit()

        for h in sorted(hists, key=lambda x: x.id or 0):
            if h.id is None or h.property_id not in prop_ids:
                continue
            nh = PropertyHistory(
                id=h.id,
                property_id=h.property_id,
                price=_money(h.price),
                status=h.status or "active",
                checked_at=h.checked_at,
            )
            dst.add(nh)

        dst.commit()

        with pg_eng.connect() as raw:
            raw.execute(
                text(
                    "SELECT setval(pg_get_serial_sequence('property', 'id'), "
                    "(SELECT COALESCE(MAX(id), 1) FROM property))",
                ),
            )
            raw.execute(
                text(
                    "SELECT setval(pg_get_serial_sequence('propertyhistory', 'id'), "
                    "(SELECT COALESCE(MAX(id), 1) FROM propertyhistory))",
                ),
            )
            raw.commit()

    print("Migração concluída.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
