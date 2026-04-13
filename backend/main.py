from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables, engine
from routers.properties import router as properties_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    create_db_and_tables()
    yield
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


@app.get("/")
def read_root():
    return {"message": "Monitora Imóveis API is running"}
