"""Testes da lógica de re-scrape (apply_scrape_to_property)."""

from sqlmodel import Session, SQLModel, create_engine, select

from jobs import apply_scrape_to_property
from models import Property, PropertyHistory


def _memory_session():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )
    SQLModel.metadata.create_all(engine)
    return Session(engine), engine


def test_apply_error_sets_db_error():
    session, _engine = _memory_session()
    p = Property(
        user_id="u1",
        url="https://example.com/a",
        status="active",
        price=100.0,
    )
    session.add(p)
    session.commit()
    session.refresh(p)

    r = apply_scrape_to_property(session, p, {"status": "error", "error": "timeout"})
    assert r["status"] == "error"
    session.refresh(p)
    assert p.status == "error"


def test_apply_inactive_inserts_history():
    session, _engine = _memory_session()
    p = Property(
        user_id="u1",
        url="https://example.com/a",
        status="active",
        price=350000.0,
    )
    session.add(p)
    session.commit()
    session.refresh(p)

    r = apply_scrape_to_property(session, p, {"status": "inactive"})
    assert r["status"] == "listing_inactive"
    session.refresh(p)
    assert p.status == "inactive"
    h = list(session.exec(select(PropertyHistory)).all())
    assert len(h) == 1
    assert h[0].status == "inactive"


def test_apply_price_changed_updates_previous_and_history():
    session, _engine = _memory_session()
    p = Property(
        user_id="u1",
        url="https://example.com/a",
        status="active",
        price=100.0,
    )
    session.add(p)
    session.commit()
    session.refresh(p)

    data = {
        "status": "active",
        "title": "Imóvel",
        "price": 90.0,
        "property_type": "sale",
    }
    r = apply_scrape_to_property(session, p, data)
    assert r["status"] == "price_changed"
    session.refresh(p)
    assert p.price == 90.0
    assert p.previous_price == 100.0
    histories = list(
        session.exec(
            select(PropertyHistory).where(PropertyHistory.property_id == p.id),
        ).all(),
    )
    assert len(histories) >= 1


def test_apply_unchanged_no_new_history_line():
    session, _engine = _memory_session()
    p = Property(
        user_id="u1",
        url="https://example.com/a",
        status="active",
        price=100.0,
    )
    session.add(p)
    session.commit()
    session.refresh(p)

    h0 = PropertyHistory(property_id=p.id, price=100.0, status="active")
    session.add(h0)
    session.commit()

    data = {
        "status": "active",
        "title": "Imóvel",
        "price": 100.0,
        "property_type": "sale",
    }
    r = apply_scrape_to_property(session, p, data)
    assert r["status"] == "unchanged"
    count = len(
        list(
            session.exec(
                select(PropertyHistory).where(PropertyHistory.property_id == p.id),
            ).all(),
        ),
    )
    assert count == 1
