import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

logging.basicConfig(level=logging.INFO)
for _name in ("monitora.jobs", "monitora.scheduler"):
    logging.getLogger(_name).setLevel(logging.INFO)
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables, engine
from migrations_sqlite import migrate_sqlite_schema
from routers.jobs import router as jobs_router
from routers.properties import router as properties_router
from scheduler import shutdown_scheduler, start_scheduler


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_db_and_tables()
    migrate_sqlite_schema(engine)
    start_scheduler()
    yield
    shutdown_scheduler()
    engine.dispose()


app = FastAPI(title="Monitora Imóveis API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(properties_router)
app.include_router(jobs_router)


@app.get("/")
def read_root():
    return {"message": "Monitora Imóveis API is running"}
