"""APScheduler: periodic global re-scrape."""

from __future__ import annotations

import logging
import os
from datetime import datetime, timezone
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from database import engine
from jobs import rescrape_all_active_global, rescrape_interval_hours, set_interval_hours, set_scheduler_next_run

logger = logging.getLogger("monitora.scheduler")

_scheduler: AsyncIOScheduler | None = None
_JOB_ID = "rescrape_all_active"


def scheduler_enabled() -> bool:
    return os.environ.get("DISABLE_SCHEDULER", "").strip().lower() not in (
        "1",
        "true",
        "yes",
    )


def get_scheduler() -> AsyncIOScheduler | None:
    return _scheduler


def _sync_next_run_to_metrics() -> None:
    if _scheduler is None:
        return
    job = _scheduler.get_job(_JOB_ID)
    if job is None or job.next_run_time is None:
        return
    nr = job.next_run_time
    set_scheduler_next_run(nr.replace(tzinfo=None) if nr.tzinfo else nr)


def get_next_rescrape_time() -> datetime | None:
    if _scheduler is None:
        return None
    job = _scheduler.get_job(_JOB_ID)
    if job is None or job.next_run_time is None:
        return None
    t = job.next_run_time
    if t.tzinfo is None:
        return t.replace(tzinfo=timezone.utc)
    return t


async def _run_rescrape_job() -> None:
    logger.info("Scheduled job rescrape_all_active starting")
    try:
        await rescrape_all_active_global(engine)
    except Exception:
        logger.exception("rescrape_all_active failed")
    finally:
        _sync_next_run_to_metrics()


def start_scheduler() -> None:
    global _scheduler

    if not scheduler_enabled():
        logger.info("Scheduler disabled (DISABLE_SCHEDULER)")
        return

    hours = rescrape_interval_hours()
    set_interval_hours(hours)

    _scheduler = AsyncIOScheduler(
        job_defaults={
            "misfire_grace_time": 3600,
            "coalesce": True,
            "max_instances": 1,
        },
    )

    _scheduler.add_job(
        _run_rescrape_job,
        trigger=IntervalTrigger(hours=hours),
        id=_JOB_ID,
        replace_existing=True,
    )

    _scheduler.start()

    _sync_next_run_to_metrics()

    logger.info("APScheduler started: rescrape every %s h", hours)


def shutdown_scheduler() -> None:
    global _scheduler
    if _scheduler is None:
        return
    _scheduler.shutdown(wait=True)
    _scheduler = None
    logger.info("APScheduler shut down")
