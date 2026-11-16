import asyncio
import json
from contextlib import asynccontextmanager
from types import SimpleNamespace
from uuid import UUID

import pytest

from app.modules import ai_guidance as guidance

FOCUS, OTHER, FIRST, SECOND, MILESTONE, LEARNER, OTHER_LEARNER = (
    UUID(int=value) for value in range(1, 8)
)
PATHS = {
    FOCUS: {"id": FOCUS, "career_id": FOCUS, "title": "Focus"},
    OTHER: {"id": OTHER, "career_id": OTHER, "title": "Other"},
}


@pytest.fixture
def learner_context(monkeypatch):
    progress = {"active": {"roadmap_id": OTHER, "topic_id": SECOND}, "state": "in_progress"}
    progress_reads = []

    @asynccontextmanager
    async def transaction(request, identity):
        yield identity.user_id

    async def one(connection, statement, params):
        if "learning_state" in statement:
            return {"current_roadmap_id": FOCUS}
        if "roadmaps r" in statement:
            return PATHS.get(params["id"])
        if "JOIN asgard_catalog.milestones" in statement:
            assert params["uid"] == connection
            return {
                "title": "First" if params["topic"] == FIRST else "Second",
                "explanation": "Try it.",
            }
        raise AssertionError(statement)

    async def active(connection, uid):
        progress_reads.append(uid)
        return progress["active"] if uid == LEARNER else None

    async def summary(connection, uid, roadmap_id):
        state = progress["state"]
        return {
            "roadmap_id": roadmap_id,
            "milestones": [
                {"milestone_id": MILESTONE, "requires_branch_choice": state == "branch"}
            ],
            "next_topic_ids": [FIRST] if state == "in_progress" else [],
            "no_remaining_suggestions": state == "skipped",
            "fully_done": state == "done",
        }

    async def milestone(connection, statement, params):
        return {"milestone_id": MILESTONE}

    async def career(connection, career_id):
        return {
            "status": "published",
            "roadmap_ids": [career_id],
            "title": PATHS[career_id]["title"],
            "description": "A career",
            "exploration": None,
        }

    async def rows(connection, statement, params):
        return (
            [{"id": params["topic"], "title": "Selected", "explanation": "Try it."}]
            if params["topic"]
            else []
        )

    async def recommendation_state(*args):
        return {"current": None, "previous_eligible_success": None}

    async def resources(connection, topic_id):
        return [
            {"title": title, "url": "https://example.org/"}
            for title in ("Guide", "Example", "Extra")
        ]

    def exploration(career_id):
        return {
            "starter": {
                "roadmap_id": FOCUS,
                "topic_id": FIRST,
                "title": "Activity",
                "instructions": "Build it",
                "expected_result": "Check it",
            }
        }

    monkeypatch.setattr(guidance, "transaction", transaction)
    monkeypatch.setattr(guidance, "one", one)
    monkeypatch.setattr(guidance, "rows", rows)
    monkeypatch.setattr(guidance, "career", career)
    monkeypatch.setattr(guidance, "recommendation_state", recommendation_state)
    monkeypatch.setattr(guidance, "resources", resources)
    monkeypatch.setattr(guidance, "career_explanation", exploration)
    monkeypatch.setattr(guidance.progress, "active_topic", active)
    monkeypatch.setattr(guidance.progress, "summary", summary)
    monkeypatch.setattr(guidance.progress, "one", milestone)
    return progress, progress_reads


def context(uid, ids=(), roadmap=None, topic=None, *, include_saved=True):
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(settings=object())))
    identity = SimpleNamespace(user_id=uid)
    return asyncio.run(guidance.context(request, identity, ids, roadmap, topic, include_saved))[2]


def test_context_reads_current_learner_and_respects_explicit_scope(learner_context):
    progress, reads = learner_context
    active = context(LEARNER)
    assert active["next_step"][0].url == f"/roadmaps/{OTHER}?roadmap={OTHER}&topic={SECOND}"
    active_evidence = json.loads(active["practice"][1])
    assert active_evidence["action"] == "Resume learning"
    assert active_evidence["curated_resources"] == ["Guide", "Example"]
    assert "authored_activity" not in active_evidence

    scoped = context(LEARNER, roadmap=FOCUS, topic=FIRST)
    assert scoped == context(OTHER_LEARNER)
    assert json.loads(scoped["practice"][1])["authored_activity"]["expected_result"] == "Check it"

    progress["active"] = None
    assert context(LEARNER) == scoped
    assert len(reads) == 4
    assert not context(LEARNER, (FOCUS, OTHER), include_saved=False)
    assert not context(LEARNER, (FOCUS, OTHER))
    assert len(reads) == 4


@pytest.mark.parametrize(
    ("state", "title", "fragment"),
    [
        ("branch", "Choose your tool path", f"#milestone-{MILESTONE}"),
        ("skipped", "Review skipped topics", ""),
        ("done", "View completed roadmap", ""),
    ],
)
def test_roadmap_states(learner_context, state, title, fragment):
    progress, _ = learner_context
    progress["state"] = state
    learning = context(LEARNER, roadmap=FOCUS)
    assert learning["practice"] is None
    assert learning["next_step"][0].title == title
    assert learning["next_step"][0].url == f"/roadmaps/{FOCUS}?roadmap={FOCUS}{fragment}"


@pytest.mark.parametrize("kind", ["next_step", "practice", "clarification"])
def test_reply_uses_server_destination(monkeypatch, kind):
    settings = SimpleNamespace(groq_model="stub")
    request = SimpleNamespace(
        app=SimpleNamespace(state=SimpleNamespace(settings=settings, http=None)),
        state=SimpleNamespace(),
    )
    source = guidance.GuidanceSource(title="Topic", url="/roadmaps/trusted", kind="asgard")
    learning = {"next_step": (source, "Try this topic."), "practice": (source, "Try this topic.")}

    async def reserve(*args):
        pass

    def prepare(settings, payload, prompt, schema, name, **kwargs):
        assert "reply_kind" in schema["required"]
        assert payload["learning_context"] == {"next_step": "1", "practice": "1"}
        assert "/roadmaps/trusted" not in json.dumps(payload)
        assert "one short question" in prompt

    async def generate(*args, output_model, **kwargs):
        return output_model(answer="A reply", source_keys=[], reply_kind=kind)

    monkeypatch.setattr(guidance, "reserve", reserve)
    monkeypatch.setattr(guidance.provider, "prepare_structured", prepare)
    monkeypatch.setattr(guidance.provider, "generate", generate)
    reply = asyncio.run(
        guidance.answer(
            request,
            None,
            "counselor_turn",
            [],
            [],
            "What next?",
            [],
            False,
            learning=learning,
        )
    )
    assert reply["sources"] == ([] if kind == "clarification" else [source])


def test_explicit_comparison_overrides_active_roadmap(monkeypatch):
    from contextlib import asynccontextmanager
    from unittest.mock import AsyncMock
    from uuid import uuid4

    cloud, software = uuid4(), uuid4()
    @asynccontextmanager
    async def tx(*args):
        yield None

    monkeypatch.setattr(guidance, "require_available", lambda request: None)
    monkeypatch.setattr(guidance, "transaction", tx)
    monkeypatch.setattr(guidance, "rows", AsyncMock(return_value=[
        {"id": cloud, "title": "Cloud Engineer", "slug": "cloud-engineer"},
        {"id": software, "title": "Software Engineer", "slug": "software-engineer"},
    ]))
    context = AsyncMock(return_value=([], [], {}))
    monkeypatch.setattr(guidance, "context", context)
    monkeypatch.setattr(guidance, "answer", AsyncMock(return_value={"answer": "Comparison"}))
    question = guidance.GuidanceQuestion(
        question="what does a cloud engineer skills have in difference compared to SWE",
        roadmap_id=uuid4(), topic_id=uuid4(), search_web=False)
    asyncio.run(guidance.counselor_turn(None, None, question))
    assert context.call_args.args[2] == [cloud, software]
    assert context.call_args.args[3:6] == (None, None, False)


def test_page_context_uses_authored_question_identifiers_and_json():
    from uuid import uuid4
    value = guidance.PageContext(path="/discovery", questionnaire_id=uuid4(),
                                 question_id="experience_preference")
    assert value.question_id == "experience_preference"
    json.dumps(value.model_dump(mode="json"))
