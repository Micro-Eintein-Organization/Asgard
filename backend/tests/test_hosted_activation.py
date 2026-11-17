import asyncio
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

from app.modules.recommendations import service


def test_ineligible_latest_preserves_previous_success(monkeypatch):
    uid, old, latest = uuid4(), uuid4(), uuid4()
    monkeypatch.setattr(service, "read_learning", AsyncMock(return_value={"context_revision": 2}))
    monkeypatch.setattr(service, "expire_if_needed", AsyncMock())
    monkeypatch.setattr(service, "release_id", AsyncMock(return_value=uuid4()))
    monkeypatch.setattr(service, "rows", AsyncMock(return_value=[
        {"id": latest, "rank": 1, "status": "completed", "eligible": False, "bundled_items": []},
        {"id": old, "rank": 2, "status": "completed", "eligible": True, "bundled_items": []},
    ]))
    formatted = SimpleNamespace(id=old)
    render = AsyncMock(return_value=formatted)
    monkeypatch.setattr(service, "run", render)
    monkeypatch.setattr(service.discovery, "latest_completed_identity", AsyncMock(return_value=None))
    monkeypatch.setattr(service.occupational_runtime, "reference_release", AsyncMock(return_value=None))
    monkeypatch.setattr(service.occupational_runtime.skills, "privacy_ready", AsyncMock(return_value=False))
    settings = SimpleNamespace(groq_enabled=False)
    result = asyncio.run(service.state(None, uid, settings))
    assert result["current"] is None
    assert result["previous_eligible_success"] is formatted
    assert render.await_count == 1
    assert render.call_args.args[2] == old
