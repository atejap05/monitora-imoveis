"""Background re-scrape jobs: apply scrape results, batch rescrape, metrics."""

from __future__ import annotations

import asyncio
import logging
import math
import os
from datetime import datetime, timezone
from typing import Any

from sqlalchemy.engine import Engine
from sqlmodel import Session, select

from models import Property, PropertyHistory
from scraper import fetch_property_data

logger = logging.getLogger("monitora.jobs")

# --- Metrics (in-memory, for GET /api/jobs/status) ---

_last_run_at: datetime | None = None
_next_run_at: datetime | None = None
_interval_hours: float = 12.0
_last_properties_checked: int = 0
_last_price_changes: int = 0
_last_errors: int = 0
_last_inactive: int = 0


def get_job_metrics() -> dict[str, Any]:
    """Snapshot for GET /api/jobs/status (snake_case; API usa JobStatusResponse)."""
    return {
        "last_run_at": _last_run_at.isoformat().replace("+00:00", "Z")
        if _last_run_at
        else None,
        "next_run_at": _next_run_at.isoformat().replace("+00:00", "Z")
        if _next_run_at
        else None,
        "interval_hours": _interval_hours,
        "properties_checked": _last_properties_checked,
        "price_changes": _last_price_changes,
        "errors": _last_errors,
        "inactive_listings": _last_inactive,
    }


def set_scheduler_next_run(next_run: datetime | None) -> None:
    global _next_run_at
    _next_run_at = next_run


def set_interval_hours(hours: float) -> None:
    global _interval_hours
    _interval_hours = hours


def _utcnow() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def _env_int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return max(1, int(raw))
    except ValueError:
        return default


def _env_float(name: str, default: float) -> float:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return max(0.1, float(raw))
    except ValueError:
        return default


def max_concurrent_scrapes() -> int:
    return _env_int("RESCRAPE_MAX_CONCURRENT", 2)


def rescrape_interval_hours() -> float:
    return _env_float("RESCRAPE_INTERVAL_HOURS", 12.0)


def _price_equal(a: float | None, b: float | None) -> bool:
    if a is None and b is None:
        return True
    if a is None or b is None:
        return False
    return math.isclose(float(a), float(b), rel_tol=0.0, abs_tol=0.01)


def _normalize_active_price(price: float | None) -> float:
    if price is None:
        return 0.0
    return float(price)


def _merge_listing_fields(prop: Property, data: dict[str, Any]) -> None:
    if data.get("title"):
        prop.title = data.get("title")
    if data.get("bedrooms") is not None:
        prop.bedrooms = data.get("bedrooms")
    if data.get("bathrooms") is not None:
        prop.bathrooms = data.get("bathrooms")
    if data.get("suites") is not None:
        prop.suites = data.get("suites")
    if data.get("size"):
        prop.size = data.get("size")
    if data.get("parking_spots") is not None:
        prop.parking_spots = data.get("parking_spots")
    if data.get("address") is not None:
        prop.address = data.get("address") or ""
    if data.get("neighborhood") is not None:
        prop.neighborhood = data.get("neighborhood") or ""
    if data.get("city") is not None:
        prop.city = data.get("city") or ""
    if data.get("property_type") in ("sale", "rent"):
        prop.property_type = data.get("property_type")
    if data.get("source"):
        prop.source = data.get("source")
    if data.get("image_url"):
        prop.image_url = data.get("image_url")
    if data.get("condo_fee") is not None:
        prop.condo_fee = data.get("condo_fee")
    if data.get("iptu") is not None:
        prop.iptu = data.get("iptu")
    if data.get("description"):
        prop.description = data.get("description")
    if data.get("reference_code"):
        prop.reference_code = data.get("reference_code")


def apply_scrape_to_property(
    session: Session,
    prop: Property,
    data: dict[str, Any],
) -> dict[str, Any]:
    """
    Apply scraper output to a Property and optionally insert PropertyHistory.
    Returns one result item for batch API (snake_case keys; router can camelCase).
    """
    prop_id = prop.id
    assert prop_id is not None

    now = _utcnow()

    if data.get("status") == "error":
        err = str(data.get("error") or "Erro desconhecido no scrape.")
        logger.debug("apply_scrape: property_id=%s scrape error: %s", prop_id, err)
        prop.status = "error"
        prop.updated_at = now
        session.add(prop)
        session.commit()
        session.refresh(prop)
        return {
            "id": prop_id,
            "status": "error",
            "detail": err,
        }

    if data.get("status") == "inactive":
        logger.debug("apply_scrape: property_id=%s listing inactive (404/410)", prop_id)
        hist_price = _normalize_active_price(prop.price)
        prop.status = "inactive"
        prop.updated_at = now
        session.add(prop)
        hist = PropertyHistory(
            property_id=prop_id,
            price=hist_price,
            status="inactive",
        )
        session.add(hist)
        session.commit()
        session.refresh(prop)
        return {
            "id": prop_id,
            "status": "listing_inactive",
        }

    # Successful page load / active listing data
    new_price = data.get("price")
    new_price_norm = _normalize_active_price(new_price)
    old_price = prop.price
    old_status = prop.status or "active"

    if old_status == "inactive":
        _merge_listing_fields(prop, data)
        prop.status = "active"
        prop.price = new_price_norm
        prop.previous_price = old_price if old_price is not None else None
        prop.updated_at = now
        session.add(prop)
        hist = PropertyHistory(
            property_id=prop_id,
            price=new_price_norm,
            status="active",
        )
        session.add(hist)
        session.commit()
        session.refresh(prop)
        return {
            "id": prop_id,
            "status": "reactivated",
            "old_price": float(old_price) if old_price is not None else None,
            "new_price": new_price_norm,
        }

    _merge_listing_fields(prop, data)
    price_changed = not _price_equal(old_price, new_price_norm)

    if price_changed:
        logger.debug(
            "apply_scrape: property_id=%s price changed %s -> %s",
            prop_id,
            old_price,
            new_price_norm,
        )
        prop.previous_price = old_price if old_price is not None else None
        prop.price = new_price_norm
        prop.status = "active"
        prop.updated_at = now
        session.add(prop)
        hist = PropertyHistory(
            property_id=prop_id,
            price=new_price_norm,
            status="active",
        )
        session.add(hist)
        session.commit()
        session.refresh(prop)
        return {
            "id": prop_id,
            "status": "price_changed",
            "old_price": float(old_price) if old_price is not None else None,
            "new_price": new_price_norm,
        }

    logger.debug("apply_scrape: property_id=%s unchanged price=%s", prop_id, new_price_norm)
    prop.status = "active"
    prop.updated_at = now
    session.add(prop)
    session.commit()
    session.refresh(prop)
    return {
        "id": prop_id,
        "status": "unchanged",
    }


async def rescrape_single_property(session: Session, prop: Property) -> dict[str, Any]:
    """Fetch URL and apply result. Caller must have prop loaded."""
    if prop.id is None:
        raise ValueError("Property.id is required for rescrape")
    try:
        data = await fetch_property_data(prop.url)
        return apply_scrape_to_property(session, prop, data)
    except Exception as e:
        logger.warning("rescrape_single_property failed id=%s: %s", prop.id, e)
        now = _utcnow()
        prop.status = "error"
        prop.updated_at = now
        session.add(prop)
        session.commit()
        session.refresh(prop)
        return {
            "id": prop.id,
            "status": "error",
            "detail": str(e),
            "old_price": None,
            "new_price": None,
        }


def _summarize_batch_results(results: list[dict[str, Any]]) -> dict[str, int]:
    price_changes = 0
    errors = 0
    inactive = 0
    updated_count = 0
    for r in results:
        st = r.get("status")
        if st in ("price_changed", "reactivated"):
            price_changes += 1
            updated_count += 1
        elif st == "listing_inactive":
            inactive += 1
            updated_count += 1
        elif st == "error":
            errors += 1
            updated_count += 1
    return {
        "price_changes": price_changes,
        "errors": errors,
        "inactive": inactive,
        "updated": updated_count,
    }


async def rescrape_properties_for_user(engine: Engine, user_id: str) -> dict[str, Any]:
    """POST /api/properties/rescrape: all active listings for one user, sequential."""
    with Session(engine) as session:
        stmt = select(Property).where(
            Property.user_id == user_id,
            Property.status == "active",
        )
        props = list(session.exec(stmt).all())

    results: list[dict[str, Any]] = []
    for p in props:
        if p.id is None:
            continue
        with Session(engine) as session:
            prop = session.get(Property, p.id)
            if prop is None:
                continue
            if prop.status != "active":
                continue
            item = await rescrape_single_property(session, prop)
            results.append(item)

    summary = _summarize_batch_results(results)
    return {
        "total": len(results),
        "updated": summary["updated"],
        "price_changes": summary["price_changes"],
        "errors": summary["errors"],
        "inactive_listings": summary["inactive"],
        "results": results,
    }


async def rescrape_all_active_global(engine: Engine) -> None:
    """
    Scheduled job: process all rows with status == 'active' (all users).
    Uses semaphore for concurrent Playwright runs.
    """
    global _last_run_at, _last_properties_checked, _last_price_changes, _last_errors, _last_inactive

    sem = asyncio.Semaphore(max_concurrent_scrapes())

    with Session(engine) as session:
        stmt = select(Property).where(Property.status == "active")
        props = list(session.exec(stmt).all())
        ids = [p.id for p in props if p.id is not None]

    async def run_one(pid: int) -> dict[str, Any]:
        async with sem:
            with Session(engine) as session:
                prop = session.get(Property, pid)
                if prop is None or prop.status != "active":
                    return {"id": pid, "status": "skipped"}
                return await rescrape_single_property(session, prop)

    if not ids:
        results = []
    else:
        results = list(await asyncio.gather(*[run_one(pid) for pid in ids]))

    summary = _summarize_batch_results(results)
    _last_run_at = datetime.now(timezone.utc).replace(tzinfo=None)
    _last_properties_checked = len(results)
    _last_price_changes = summary["price_changes"]
    _last_errors = summary["errors"]
    _last_inactive = summary["inactive"]

    logger.info(
        "rescrape_all_active_global: checked=%s price_changes=%s errors=%s inactive=%s",
        _last_properties_checked,
        _last_price_changes,
        _last_errors,
        _last_inactive,
    )
