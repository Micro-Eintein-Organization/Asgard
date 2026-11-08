import asyncio
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.errors import APIError
from app.main import create_app
from app.modules.competencies import service
from app.modules.competencies.schemas import SaveCompetency


@pytest.mark.parametrize("level", [None, 0, 1, 2, 3, 4])
def test_self_report_values(level):
    assert SaveCompetency(expected_version=0, level=level).level == level


@pytest.mark.parametrize("level", [-1, 5, True, "1", 1.5])
def test_invalid_levels(level):
    with pytest.raises(ValidationError):
        SaveCompetency(expected_version=0, level=level)


def test_identity_cannot_be_submitted():
    with pytest.raises(ValidationError):
        SaveCompetency(expected_version=0, level=None, user_id=str(uuid4()))


def test_stale_mutation_never_writes(monkeypatch):
    monkeypatch.setattr(service, "lock", AsyncMock())
    monkeypatch.setattr(service, "state", AsyncMock(return_value={"version": 8, "items": []}))
    write = AsyncMock()
    monkeypatch.setattr(service, "one", write)
    with pytest.raises(APIError) as error:
        asyncio.run(
            service.change(None, uuid4(), uuid4(), SaveCompetency(expected_version=7, level=0))
        )
    assert error.value.status == 409
    write.assert_not_called()


def test_comparison_keeps_unassessed_and_zero_distinct(monkeypatch):
    monkeypatch.setattr(service, "lock", AsyncMock())
    common = {
        "revision": 2,
        "source": "Asgard-authored",
        "source_version": "v1",
        "account_version": 3,
        "topic_id": None,
    }
    monkeypatch.setattr(
        service,
        "rows",
        AsyncMock(
            return_value=[
                common | {"id": uuid4(), "label": "Unknown", "recorded": False, "level": None},
                common | {"id": uuid4(), "label": "None yet", "recorded": True, "level": 0},
                common | {"id": uuid4(), "label": "Not rated", "recorded": True, "level": None},
            ]
        ),
    )
    result = asyncio.run(service.compare(None, uuid4(), uuid4()))
    assert [(x["recorded"], x["level"]) for x in result["items"]] == [
        (False, None),
        (True, 0),
        (True, None),
    ]
    assert result["account_version"] == 3


def test_routes_reject_anonymous():
    app = create_app(Settings(auth_enabled=True, database_url=""))
    cid = uuid4()
    with TestClient(app) as client:
        for method, path, body in [
            ("GET", "/competencies", None),
            ("GET", "/me/competencies", None),
            ("PATCH", f"/me/competencies/{cid}", {"expected_version": 0, "level": 0}),
            ("POST", f"/me/competencies/{cid}/remove", {"expected_version": 0}),
            ("GET", f"/me/careers/{cid}/competency-comparison", None),
        ]:
            response = client.request(method, "/api/v1" + path, json=body)
            assert response.status_code == 401


def test_draft_renderer_is_repeatable_and_does_not_publish():
    import sys
    from pathlib import Path

    sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
    try:
        from render_competencies import render

        with pytest.raises(ValueError):
            render(publish_reviewed=True)
        reviewed_sql = render(publish_reviewed=True, reviewer="Synthetic test reviewer")
        assert reviewed_sql.count("SET published=true") == 120
        sql = render()
        assert sql == render()
        assert sql.count("INSERT INTO asgard_catalog.competencies(") == 120
        assert sql.count("INSERT INTO asgard_catalog.competency_links(") == 120
        assert "published" not in sql
        assert "UPDATE asgard_private" not in sql
        assert "Conflicting skill reference" in sql
    finally:
        sys.path.pop(0)
