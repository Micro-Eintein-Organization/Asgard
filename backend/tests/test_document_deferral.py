import asyncio
from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.core.errors import APIError
from app.modules.documents import routes


def test_upload_and_analysis_are_blocked_before_processing():
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(
        settings=SimpleNamespace(documents_processing_enabled=False),
    )))
    for operation in (
        routes.upload(request, None, 1),
        routes.analyze(uuid4(), None, request, None),
    ):
        with pytest.raises(APIError) as error:
            asyncio.run(operation)
        assert error.value.code == "documents_deferred"


@pytest.mark.parametrize("enabled", [False, True])
def test_availability_tracks_processing_without_hiding_saved_background(monkeypatch, enabled):
    from unittest.mock import AsyncMock

    from app.core.config import Settings
    from app.modules.documents import service

    saved = {"id": uuid4(), "status": "active", "revision": 1, "failure_code": None,
             "created_at": "2026-11-20T00:00:00Z", "evidence": [],
             "purge_due_at": None, "purged_at": None}
    monkeypatch.setattr(service, "head", AsyncMock(return_value={"revision": 1}))
    monkeypatch.setattr(service, "expire", AsyncMock())
    monkeypatch.setattr(service, "rows", AsyncMock(return_value=[saved]))
    monkeypatch.setattr(service, "one", AsyncMock(return_value={"revision": 1}))
    settings = Settings(documents_enabled=True, documents_processing_enabled=enabled,
                        storage_service_key="synthetic")
    state = asyncio.run(service.state(None, uuid4(), settings))
    assert state.available is enabled
    assert state.active.id == saved["id"]
    assert state.synthetic_only
