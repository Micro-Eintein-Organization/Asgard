import asyncio
import json
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr

from app.core.config import Settings
from app.main import create_app
from app.modules.skill_matching import interpretation, service
from app.modules.skill_matching.schemas import InterpretationState
from app.modules.skill_matching.sources import catalog_from_rows


@pytest.mark.parametrize("done", [False, True])
def test_learning_evidence_updates_counts_without_creating_proficiency(monkeypatch, done):
    owner, career, skill, roadmap, topic = (uuid4() for _ in range(5))
    catalog = catalog_from_rows([{
        "career_id": career, "career_title": "Developer", "competency_id": skill,
        "label": "Build APIs", "aliases": [], "source": "test", "source_version": "1",
    }])
    monkeypatch.setattr(service.CompetencyLinksSource, "list_all", AsyncMock(return_value=catalog))
    monkeypatch.setattr(interpretation, "saved_state", AsyncMock(return_value=(
        InterpretationState(status="no_resume"), [],
    )))

    async def read(connection, query, params):
        assert params["uid"] == str(owner)
        if "topic_progress" in query and done:
            return [{"career_id": career, "competency_id": skill, "roadmap_id": roadmap,
                     "topic_id": topic, "title": "API lesson"}]
        return []

    monkeypatch.setattr(service, "rows", read)
    response = asyncio.run(service.get_career_skill_matches(None, owner))
    result = response.items[0]
    assert result.evidence_count == int(done)
    assert result.matched_skill_count == 0
    assert result.skills[0].reported_level is None
    assert bool(result.skills[0].learning_signals) == done


@pytest.mark.parametrize("invalid", [None, "quote", "id"])
def test_interpretation_requires_allowed_skill_and_exact_resume_quote(invalid):
    skill = uuid4()
    batches = interpretation.request_batches([{
        "id": skill, "label": "Develop REST APIs", "aliases": [],
    }], [{"kind": "experience", "text": "Built REST endpoints"}])

    def respond(request):
        claim = {"competency_id": str(uuid4() if invalid == "id" else skill),
                 "evidence_index": 0,
                 "quote": "Invented claim" if invalid == "quote" else "Built REST endpoints"}
        return httpx.Response(200, json={"choices": [{"finish_reason": "stop", "message": {
            "content": json.dumps({"items": [claim]}),
        }}]})

    reserve = AsyncMock()

    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as http:
            return await interpretation.generate(http, SimpleNamespace(
                groq_model="synthetic", groq_api_key=SecretStr("synthetic"),
            ), batches, reserve)

    if invalid:
        with pytest.raises(ValueError):
            asyncio.run(run())
    else:
        assert asyncio.run(run())[0]["competency_id"] == str(skill)
    reserve.assert_awaited_once_with(False)


def test_anonymous_interpretation_is_denied_before_database_or_provider():
    with TestClient(create_app(Settings(auth_enabled=True, database_url=""))) as client:
        result = client.post(f"/api/v1/me/documents/{uuid4()}/skill-interpretation")
    assert result.status_code == 401
