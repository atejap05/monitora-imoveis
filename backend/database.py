"""SQLite engine and session dependency."""

from sqlmodel import Session, SQLModel, create_engine

sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, echo=False, connect_args=connect_args)


def create_db_and_tables() -> None:
    from models import Property, PropertyHistory  # noqa: F401, PLC0415

    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
