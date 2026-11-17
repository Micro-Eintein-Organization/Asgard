import asyncio
from datetime import UTC, date, datetime
from uuid import UUID

import pytest
from pydantic import ValidationError

from app.modules.progress import service
from app.modules.progress.schemas import ActivityMonth


@pytest.mark.parametrize(
    "values,current,longest",
    [
        ([], 0, 0),
        (["2026-11-16"], 1, 1),
        (["2026-11-16", "2026-11-16"], 1, 1),
        (["2026-11-14", "2026-11-15"], 2, 2),
        (["2026-11-13", "2026-11-14"], 0, 2),
        (["2026-10-30", "2026-10-31", "2026-11-01", "2026-11-16"], 1, 3),
        (["2025-12-31", "2026-01-01", "2026-01-02"], 0, 3),
        (["2026-11-16", "2026-11-14", "2026-11-15"], 3, 3),
    ],
)
def test_activity_streaks_use_all_distinct_account_dates(monkeypatch, values, current, longest):
    dates = [date.fromisoformat(value) for value in values]
    uid = UUID(int=1)
    reads = []

    async def rows(connection, statement, parameters):
        assert "user_id = CAST(:uid AS uuid)" in statement
        assert parameters["uid"] == str(uid)
        reads.append(statement)
        if "SELECT DISTINCT" in statement:
            return [{"local_date": day} for day in dates]
        return [{"local_date": day, "done_count": dates.count(day)} for day in sorted(set(dates))
                if parameters["start"] <= day < parameters["end"]]

    async def preferences(connection, account):
        assert account == uid
        return {"timezone": "Asia/Manila"}

    class Clock(datetime):
        @classmethod
        def now(cls, tz=None):
            # Manila is already November 16 while UTC is still November 15.
            return datetime(2026, 11, 15, 17, tzinfo=UTC)

    monkeypatch.setattr(service, "rows", rows)
    monkeypatch.setattr(service, "preferences", preferences)
    monkeypatch.setattr(service, "datetime", Clock)
    for month in ("2026-11", "2025-12"):
        result = asyncio.run(service.activity(None, uid, month))
        assert result["streak_days"] == current
        assert result["longest_streak_days"] == longest
        assert ActivityMonth.model_validate(result).longest_streak_days == longest
    assert len(reads) == 4
    if len(set(dates)) >= 3:
        dates[:] = [day for day in dates if day != sorted(set(dates))[1]]
        undone = asyncio.run(service.activity(None, uid, "2026-11"))
        assert undone["longest_streak_days"] < longest or longest <= 2


def test_longest_streak_contract_requires_nonnegative_value():
    with pytest.raises(ValidationError):
        ActivityMonth.model_validate({"month": "2026-11", "days": [], "streak_days": 0})
    with pytest.raises(ValidationError):
        ActivityMonth.model_validate({
            "month": "2026-11", "days": [], "streak_days": 0, "longest_streak_days": -1,
        })
