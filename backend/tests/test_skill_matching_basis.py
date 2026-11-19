import asyncio
from contextlib import asynccontextmanager
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.core.errors import APIError
from app.core.security import current_identity
from app.main import create_app
from app.modules.skill_matching import routes, service, sources


def test_snapshot_source_pins_versions_and_keeps_unmapped_careers(monkeypatch):
    career, empty, skill = uuid4(), uuid4(), uuid4()
    queries = []

    async def read(_connection, sql, params):
        queries.append(sql)
        assert params == {"source": "reviewed", "version": "v2"}
        if "SELECT posting.*" in sql:
            assert "version.status='published'" in sql
            assert "posting.source_version=:version" in sql
            return []
        assert "snap.published AND snap.source=:source" in sql
        assert "snap.source_version=:version" in sql
        assert "competency_links" not in sql
        return [
            {"career_id": career, "career_title": "Analyst", "competency_id": skill,
             "label": "SQL", "aliases": [], "source": "canonical", "source_version": "c1",
             "snapshot_id": uuid4(), "snapshot_published": True,
             "snapshot_posting_count": 2, "snapshot_total_postings": 5,
             "snapshot_source": "reviewed", "snapshot_source_version": "v2"},
            {"career_id": empty, "career_title": "Empty", "competency_id": None},
        ]

    monkeypatch.setattr(sources, "rows", read)
    catalog = asyncio.run(sources.SnapshotSource("reviewed", "v2").list_all(object()))
    response = service.assemble_response(catalog, [], None)
    assert response.source == "reviewed" and response.source_version == "v2"
    assert [item.display_count for item in response.items] == ["0 of 1", "0 of 0"]
    assert len(queries) == 2


@pytest.mark.parametrize("configured", [False, True])
def test_missing_benchmark_has_explicit_unavailable_state(monkeypatch, configured):
    async def read(*_args):
        return []

    monkeypatch.setattr(sources, "rows", read)
    with pytest.raises(APIError) as error:
        asyncio.run(sources.SnapshotSource("reviewed" if configured else "", "v1").list_all(None))
    assert error.value.status == 503 and error.value.code == "benchmark_unavailable"


def test_basis_route_defaults_preserve_old_clients_and_validate_selection(monkeypatch):
    app = create_app(Settings(skill_matching_benchmark_source="reviewed",
                              skill_matching_benchmark_version="v1"))
    identity = object()
    app.dependency_overrides[current_identity] = lambda: identity
    calls = []

    @asynccontextmanager
    async def transaction(_request, owner):
        assert owner is identity
        yield object()

    async def match(_connection, _owner, source):
        calls.append(source)
        return {"source": "test", "source_version": None, "sample_label": "test",
                "postings_sample_label": "test", "items": []}

    from types import SimpleNamespace
    identity = SimpleNamespace(user_id=uuid4())
    monkeypatch.setattr(routes, "transaction", transaction)
    monkeypatch.setattr(routes, "get_career_skill_matches", match)
    with TestClient(app) as client:
        path = "/api/v1/me/career-skill-matches"
        assert client.get(path).status_code == 200
        assert calls[-1] is None
        assert client.get(path, params={"basis": "benchmark"}).status_code == 200
        assert isinstance(calls[-1], sources.SnapshotSource)
        assert client.get(path, params={"basis": "other"}).status_code == 422


def test_private_reads_use_only_the_current_owner_and_active_document(monkeypatch):
    owner = uuid4()
    queries = []

    class EmptySource:
        async def list_all(self, _connection):
            return sources.CareerCatalog((), {}, None)

    async def read(_connection, sql, params):
        assert params == {"uid": str(owner)}
        assert "WHERE user_id = CAST(:uid AS uuid)" in sql
        queries.append(sql)
        return []

    monkeypatch.setattr(service, "rows", read)
    asyncio.run(service.get_career_skill_matches(None, owner, EmptySource()))
    assert len(queries) == 2
    assert "status = 'active'" in queries[1]
    assert "ORDER BY created_at DESC, id DESC LIMIT 1" in queries[1]
