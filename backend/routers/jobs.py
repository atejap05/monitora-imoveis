"""Endpoints de observabilidade dos jobs (scheduler)."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends

from auth import get_current_user_id
from jobs import get_job_metrics
from scheduler import get_next_rescrape_time
from schemas import JobStatusResponse

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


def _iso_utc(dt: datetime) -> str:
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc).replace(tzinfo=None)
    return dt.replace(microsecond=0).isoformat() + "Z"


@router.get(
    "/status",
    response_model=JobStatusResponse,
    response_model_by_alias=True,
)
def jobs_status(
    _user_id: Annotated[str, Depends(get_current_user_id)],
):
    m = get_job_metrics()
    nxt = get_next_rescrape_time()
    if nxt is not None:
        m["next_run_at"] = _iso_utc(nxt)
    return JobStatusResponse(**m)
