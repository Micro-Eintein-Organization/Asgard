import asyncio
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.core.errors import APIError
from app.core.security import Identity, current_identity
from app.main import create_app
from app.modules.progress import service


def test_new_reads_require_authentication():
    with TestClient(create_app(Settings(auth_enabled=True))) as client:
        for route in ["catalog-progress?roadmap_ids=" + str(uuid4()), str(uuid4()) + "/view"]:
            assert client.get("/api/v1/me/roadmaps/" + route).status_code == 401


@pytest.mark.parametrize("count", [1, 100])
def test_batch_reads_have_constant_query_count_and_account_filter(monkeypatch, count):
    ids = [uuid4() for _ in range(count)]
    uid = uuid4()
    calls = []

    async def rows(connection, sql, parameters):
        calls.append(sql)
        assert parameters["uid"] == str(uid)
        assert parameters["ids"] == ids
        if "FROM asgard_catalog.roadmaps" in sql:
            return [{"id": rid, "revision": 1} for rid in ids]
        if "asgard_private" in sql:
            assert "user_id=CAST(:uid AS uuid)" in sql
        return []

    monkeypatch.setattr(service, "rows", rows)
    result = asyncio.run(service.catalog_progress(None, uid, ids))
    assert len(calls) == 7
    assert len(result) == count
    assert all(not item["has_progress"] and item["percentage"] is None for item in result)


def test_batch_missing_roadmap_fails_without_private_reads(monkeypatch):
    rows = AsyncMock(return_value=[])
    monkeypatch.setattr(service, "rows", rows)
    with pytest.raises(APIError):
        asyncio.run(service.catalog_progress(None, uuid4(), [uuid4()]))
    assert rows.await_count == 1


@pytest.mark.parametrize("query", ["", "?roadmap_ids=invalid",
    "?" + "&".join("roadmap_ids=" + str(uuid4()) for _ in range(101))])
def test_batch_rejects_invalid_limits_before_database(query):
    app = create_app(Settings(auth_enabled=True))
    app.dependency_overrides[current_identity] = lambda: Identity(uuid4(), uuid4(), "aal1")
    with TestClient(app) as client:
        assert client.get("/api/v1/me/roadmaps/catalog-progress" + query).status_code == 422
