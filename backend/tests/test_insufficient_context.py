from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.modules.discovery.definition import QUESTIONNAIRE_ID, QUESTIONNAIRE_V2_ID, definition
from app.modules.discovery.v3 import ID as V3_ID
from app.modules.discovery.v4 import ID as V4_ID
from app.modules.recommendations.insufficient_context import has_direction, select


@pytest.mark.parametrize("version", [QUESTIONNAIRE_ID, QUESTIONNAIRE_V2_ID, V3_ID, V4_ID])
def test_uncertainty_is_not_direction_and_inactive_answers_are_ignored(version):
    questions = definition(version).questions
    session = SimpleNamespace(questionnaire_id=version,
        active_question_ids=["interests"], answers=[
            SimpleNamespace(question_id="interests", option_ids=["unsure"]),
            SimpleNamespace(question_id="activities_general", option_ids=["analyze"]),
        ])
    assert not has_direction(session)
    interest = next(q for q in questions if q.question_id == "interests")
    session.answers[0].option_ids = [next(o.id for o in interest.options if o.id != "unsure")]
    assert has_direction(session)


def test_no_completed_discovery_has_no_direction():
    assert not has_direction(None)


@pytest.mark.parametrize("level,confirmed,expected", [(0, True, 0), (None, False, 0),
    (None, True, 1), (1, False, 1)])
def test_only_positive_current_career_linked_reports_support_results(level, confirmed, expected):
    career, roadmap, competency = uuid4(), uuid4(), uuid4()
    fact = "reported-skill:" + str(competency)
    context = SimpleNamespace(facts=[SimpleNamespace(id=fact)])
    catalog = [{"career_id": career, "slug": "data-analyst", "title": "Data Analyst",
                "roadmap_ids": [roadmap]}]
    report = {"competency_id": competency, "label": "SQL", "level": level,
              "evidence_confirmed": confirmed, "career_context": [{"career_id": career}]}
    assert len(select(catalog, context, {"items": [report]}, {})) == expected
    assert not select(catalog, SimpleNamespace(facts=[]), {"items": [report]}, {})
    report["career_context"] = [{"career_id": uuid4()}]
    assert not select(catalog, context, {"items": [report]}, {})


def test_resume_only_uses_resolved_current_facts_and_does_not_pad():
    career, roadmap, competency = uuid4(), uuid4(), uuid4()
    catalog = [{"career_id": career, "slug": "data-analyst", "title": "Data Analyst",
                "roadmap_ids": [roadmap]}]
    links = {str(career): [{"competency_id": competency, "fact_id": "pdf:0", "label": "SQL"}]}
    context = SimpleNamespace(facts=[SimpleNamespace(id="pdf:0")])
    result = select(catalog, context, {"items": []}, links)
    assert len(result) == 1
    assert result[0].evidence_fact_ids == ["pdf:0"]
    assert "interests remain unknown" in result[0].uncertainty_note
    assert not select(catalog, SimpleNamespace(facts=[]), {"items": []}, links)


@pytest.mark.parametrize("level,expected", [(1, "completed"), (0, "failed")])
def test_experience_only_run_is_saved_without_provider_or_discovery(monkeypatch, level, expected):
    import asyncio
    from unittest.mock import AsyncMock

    from app.modules.competencies import service as skills
    from app.modules.discovery import experience
    from app.modules.recommendations import service

    uid, career, roadmap, competency, release, run_id = [uuid4() for _ in range(6)]
    fact_id = "reported-skill:" + str(competency)
    context = {"schema_version": "2", "context_revision": 2, "discovery": None,
        "document": None, "skill_profile_version": 1, "occupational_release_id": None,
        "source_references": [], "coverage_limitations": [], "facts": [{
            "id": fact_id, "source": "reported_skill", "source_id": str(competency),
            "source_revision": 1, "description": "Self-reported SQL"}]}
    report = {"competency_id": competency, "label": "SQL", "level": level,
        "evidence_confirmed": False, "career_context": [{"career_id": career}]}
    connection = SimpleNamespace(execute=AsyncMock())

    async def read_rows(connection, statement, params=None):
        if "SELECT c.id AS career_id" in statement:
            return [{"career_id": career, "slug": "data-analyst", "title": "Data Analyst",
                     "description": "Analyze data", "roadmap_id": roadmap}]
        return []

    async def read_one(connection, statement, params=None):
        return {"id": run_id} if statement.startswith("INSERT") else None

    monkeypatch.setattr(service, "rows", read_rows)
    monkeypatch.setattr(service, "one", read_one)
    monkeypatch.setattr(service, "snapshot", AsyncMock(return_value={"context": context}))
    monkeypatch.setattr(skills, "state", AsyncMock(return_value={"items": [report]}))
    monkeypatch.setattr(experience, "augment_reports", AsyncMock(side_effect=lambda c, u, r: r))
    monkeypatch.setattr(service, "run", AsyncMock(return_value="saved"))
    provider = AsyncMock()
    monkeypatch.setattr(service, "generate", provider)
    body = SimpleNamespace(idempotency_key=uuid4())
    assert asyncio.run(service.request_rules(
        connection, uid, body, {"context_revision": 2}, release, None)) == "saved"
    provider.assert_not_awaited()
    updates = [call.args[1] for call in connection.execute.await_args_list
               if "status" in call.args[1]]
    assert updates[-1]["status"] == expected
    assert updates[-1]["uid"] == str(uid)
