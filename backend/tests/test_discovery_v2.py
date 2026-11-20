from asyncio import run
from datetime import UTC, datetime
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from app.core.errors import APIError
from app.modules.discovery import service
from app.modules.discovery.definition import (
    QUESTIONNAIRE_ID,
    QUESTIONNAIRE_V2_ID,
    active_route,
    definition,
    validate_answer,
)
from app.modules.discovery.schemas import DiscoverySession, SaveDiscovery
from app.modules.recommendations.service import discovery_facts


@pytest.mark.parametrize(
    "field", ["build", "data", "design", "security", "infrastructure", "devices"]
)
def test_v2_each_field_has_one_activity_step(field):
    assert active_route({"interests": [field]}, 2) == [
        "experience_preference",
        "interests",
        f"activities_{field}",
        "goals",
    ]


def test_v2_uncertainty_and_follow_up_priority():
    answers = {
        "interests": ["infrastructure", "design"],
        "activities_design": ["layouts", "research"],
        "activities_infrastructure": ["cloud", "releases"],
        "prefer_ui_ux": ["research"],
    }
    assert active_route(answers, 2) == [
        "experience_preference",
        "interests",
        "activities_design",
        "activities_infrastructure",
        "prefer_ui_ux",
        "goals",
    ]
    answers["interests"] = ["unsure"]
    assert active_route(answers, 2) == [
        "experience_preference",
        "interests",
        "activities_general",
        "goals",
    ]
    answers["interests"] = ["design"]
    assert "prefer_ui_ux" in active_route(answers, 2)
    assert answers["prefer_ui_ux"] == ["research"]


def test_v2_mixed_ai_follow_up_requires_both_activity_answers():
    answers = {"interests": ["data", "build"], "activities_build": ["ai_features"]}
    assert "prefer_ai_ml" not in active_route(answers, 2)
    answers["activities_data"] = ["train_models"]
    assert active_route(answers, 2)[2:-1] == ["activities_build", "activities_data", "prefer_ai_ml"]


def test_v2_enforces_limit_and_keeps_v1_definition():
    questions = {item.question_id: item for item in definition(QUESTIONNAIRE_V2_ID).questions}
    validate_answer(questions["interests"], ["build", "data"])
    validate_answer(questions["experience_preference"], ["unsure"])
    for invalid in (["build", "data", "design"], ["build", "unsure"]):
        with pytest.raises(APIError):
            validate_answer(questions["interests"], invalid)
    assert definition(QUESTIONNAIRE_ID).version == 1
    assert len(questions["activities_general"].options) == 7


@pytest.mark.parametrize("published_v2", [False, True])
def test_default_questionnaire_requires_publication(monkeypatch, published_v2):
    authored = definition(QUESTIONNAIRE_V2_ID if published_v2 else QUESTIONNAIRE_ID)
    monkeypatch.setattr(
        service,
        "one",
        AsyncMock(
            side_effect=[
                None,
                None,
                {"id": QUESTIONNAIRE_V2_ID} if published_v2 else None,
                {"version": authored.version},
            ]
        ),
    )
    monkeypatch.setattr(
        service,
        "rows",
        AsyncMock(
            return_value=[
                {"id": question.question_id, "position": question.position}
                for question in authored.questions
            ]
        ),
    )
    assert run(service.questionnaire(object())).id == authored.id


@pytest.mark.parametrize("has_draft", [False, True])
def test_retake_uses_published_version_or_resumes_existing_draft(monkeypatch, has_draft):
    source = SimpleNamespace(
        id="source", questionnaire_id=QUESTIONNAIRE_ID, status="completed", revision=5
    )
    draft = SimpleNamespace(id="draft", answers=[])
    monkeypatch.setattr(service, "lock_account", AsyncMock())
    monkeypatch.setattr(service, "session", AsyncMock(side_effect=[source, draft]))
    monkeypatch.setattr(
        service, "questionnaire", AsyncMock(return_value=definition(QUESTIONNAIRE_V2_ID))
    )
    queries = AsyncMock(
        side_effect=[
            {"id": draft.id, "source_session_id": source.id} if has_draft else None,
            {"id": draft.id},
        ]
    )
    monkeypatch.setattr(service, "one", queries)
    body = SimpleNamespace(source_session_id=source.id, expected_revision=5)

    assert run(service.retake(object(), "owner", body)) is draft
    if has_draft:
        assert queries.await_count == 1
        service.questionnaire.assert_not_awaited()
    else:
        assert queries.await_args.args[2]["qid"] == str(QUESTIONNAIRE_V2_ID)


@pytest.mark.parametrize("preference", ["both", "research"])
def test_recommendation_evidence_excludes_inactive_answers_and_opening(preference):
    answers = {
        "experience_preference": ["use_experience"],
        "interests": ["design"],
        "activities_build": ["games"],
        "activities_design": ["layouts", "research"],
        "prefer_ui_ux": [preference],
        "goals": ["change"],
    }
    session = DiscoverySession(
        id=uuid4(),
        questionnaire_id=QUESTIONNAIRE_V2_ID,
        source_session_id=None,
        status="completed",
        revision=4,
        created_at=datetime.now(UTC),
        completed_at=datetime.now(UTC),
        next_question_id=None,
        active_question_ids=active_route(answers, 2),
        answers=[{"question_id": key, "option_ids": options} for key, options in answers.items()],
    )
    facts = {fact.id: fact.description for fact in discovery_facts(session)}
    assert not any("activities_build" in key or "experience_preference" in key for key in facts)
    assert "discovery:activities_design:layouts" in facts
    assert "discovery:activities_design:research" in facts
    if preference == "research":
        assert facts["discovery:prefer_ui_ux:research"].startswith("Preferred activity")
    else:
        assert not any("prefer_ui_ux" in key for key in facts)


@pytest.mark.parametrize(
    "revision, expected_code", [(1, "discovery_conflict"), (2, "discovery_route_changed")]
)
def test_checkpoint_rejects_stale_or_inactive_writes(monkeypatch, revision, expected_code):
    monkeypatch.setattr(service, "lock_account", AsyncMock())
    monkeypatch.setattr(
        service,
        "session",
        AsyncMock(
            return_value=SimpleNamespace(
                status="draft",
                revision=2,
                questionnaire_id=QUESTIONNAIRE_V2_ID,
                answers=[SimpleNamespace(question_id="interests", option_ids=["design"])],
            )
        ),
    )
    monkeypatch.setattr(
        service, "questionnaire", AsyncMock(return_value=definition(QUESTIONNAIRE_V2_ID))
    )
    conn = SimpleNamespace(execute=AsyncMock())
    body = SaveDiscovery(
        expected_version=revision,
        answers=[
            {"question_id": "activities_build", "option_ids": ["games"]},
        ],
    )
    with pytest.raises(APIError) as error:
        run(service.checkpoint(conn, "owner", "draft", body))
    assert error.value.code == expected_code
    conn.execute.assert_not_awaited()
