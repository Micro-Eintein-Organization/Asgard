from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from app.modules.competencies.interpretation import positive_statements
from app.modules.competencies.schemas import ConfirmSkills, UserCompetency


@pytest.mark.parametrize("statement", ["I want to learn SQL", "I have no Python experience",
    "I haven't used Java", "I plan to use SQL", "I would use Python"])
def test_non_evidence_is_excluded(statement):
    assert positive_statements(statement) == []


def test_positive_task_survives_separate_aspiration():
    assert positive_statements("I used SQL for reports; I want to learn Python") == [
        "I used SQL for reports"]


def test_machine_learning_and_dotted_technology_names_are_preserved():
    assert positive_statements("I used Node.js and machine learning") == [
        "I used Node.js and machine learning"]


def test_save_preserves_absent_level_and_explicit_clear():
    skill = uuid4()
    body = ConfirmSkills(expected_version=0, items=[{"competency_id": skill}])
    assert body.items[0].model_dump(exclude_unset=True) == {"competency_id": skill}
    body = ConfirmSkills(expected_version=0, items=[{"competency_id": skill, "level": None}])
    assert "level" in body.items[0].model_dump(exclude_unset=True)


def test_confirmation_does_not_infer_level():
    from datetime import UTC, datetime
    item = UserCompetency(competency_id=uuid4(), label="SQL", level=None,
                          evidence_confirmed=True, updated_at=datetime.now(UTC))
    assert item.evidence_confirmed and item.level is None


def test_preview_and_confirmation_require_authentication():
    with TestClient(create_app(Settings(auth_enabled=True))) as client:
        for path, body in [("interpret", {"text": "I used SQL"}),
                           ("confirm", {"expected_version": 0,
                                        "items": [{"competency_id": str(uuid4())}]})]:
            assert client.post("/api/v1/me/competencies/" + path, json=body).status_code == 401


def test_selected_topic_and_milestone_are_resolved_for_counselor(monkeypatch):
    import asyncio
    from contextlib import asynccontextmanager
    from types import SimpleNamespace
    from unittest.mock import AsyncMock

    from app.modules import ai_guidance as guidance

    topic, milestone, roadmap, career, owner = [uuid4() for _ in range(5)]

    @asynccontextmanager
    async def tx(*args):
        yield None

    async def one(_conn, query, params):
        if "FROM asgard_catalog.topics" in query:
            return {"milestone_id": milestone, "title": "Virtual memory", "explanation": "Pages and swap", "status": "not_started"}
        return {"id": milestone, "title": "Kernel", "description": "Kernel architecture"}

    monkeypatch.setattr(guidance, "require_available", lambda request: None)
    monkeypatch.setattr(guidance, "transaction", tx)
    monkeypatch.setattr(guidance, "one", one)
    monkeypatch.setattr(guidance, "rows", AsyncMock(return_value=[]))
    monkeypatch.setattr(guidance.progress, "summary", AsyncMock(return_value={"milestones": []}))
    monkeypatch.setattr(guidance, "context", AsyncMock(return_value=([], [], {})))
    answer = AsyncMock(return_value={"answer": "Selected explanation"})
    monkeypatch.setattr(guidance, "answer", answer)
    body = guidance.GuidanceQuestion(question="Explain this milestone and topic", career_ids=[career],
        topic_id=topic, roadmap_id=roadmap, milestone_id=milestone,
        page_context=guidance.PageContext(path="/roadmaps/test"))
    asyncio.run(guidance.counselor_turn(None, SimpleNamespace(user_id=owner), body))
    page = answer.call_args.kwargs["page"]
    assert page["selected_topic"]["title"] == "Virtual memory"
    assert page["selected_topic"]["status"] == "not_started"
    assert page["milestone"]["description"] == "Kernel architecture"
