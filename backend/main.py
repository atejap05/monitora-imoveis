import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

logging.basicConfig(level=logging.INFO)
for _name in ("monitora.jobs", "monitora.scheduler"):
    logging.getLogger(_name).setLevel(logging.INFO)
from alembic import command
from alembic.config import Config
from fastapi.middleware.cors import CORSMiddleware

from database import DATABASE_URL, create_db_and_tables, engine
from migrations_sqlite import migrate_sqlite_schema
from routers.jobs import router as jobs_router
from routers.properties import router as properties_router
from scheduler import shutdown_scheduler, start_scheduler

_DEFAULT_DEV_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]


def _cors_allow_origins() -> list[str]:
    """Production: CORS_ORIGINS (comma-separated). Dev: localhost if unset."""
    raw = os.environ.get("CORS_ORIGINS", "").strip()
    if not raw:
        return list(_DEFAULT_DEV_ORIGINS)
    parts = [p.strip() for p in raw.split(",")]
    return [p for p in parts if p]


def _run_startup_schema() -> None:
    """SQLite dev: create_all + idempotent ALTERs. PostgreSQL: Alembic upgrade."""
    if os.environ.get("TESTING") == "1":
        create_db_and_tables()
        migrate_sqlite_schema(engine)
        return
    if DATABASE_URL:
        alembic_cfg = Config(str(Path(__file__).resolve().parent / "alembic.ini"))
        command.upgrade(alembic_cfg, "head")
    else:
        create_db_and_tables()
        migrate_sqlite_schema(engine)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    _run_startup_schema()
    start_scheduler()
    yield
    shutdown_scheduler()
    engine.dispose()


app = FastAPI(title="Monitora Imóveis API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_allow_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties_router)
app.include_router(jobs_router)


@app.get("/")
def read_root():
    return {"message": "Monitora Imóveis API is running"}
