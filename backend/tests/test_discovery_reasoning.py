from types import SimpleNamespace

from app.modules.discovery.definition import definition
from app.modules.discovery.v3 import ID, SCENARIOS
from app.modules.recommendations.resume_connections import resolve_connections


def test_all_questionnaire_versions_have_clean_text():
    from app.modules.discovery.definition import QUESTIONNAIRE_ID, QUESTIONNAIRE_V2_ID
    from app.modules.discovery.v4 import ID as V4_ID

    for identifier in (QUESTIONNAIRE_ID, QUESTIONNAIRE_V2_ID, ID, V4_ID):
        text = definition(identifier).model_dump_json()
        assert not any(marker in text for marker in ("\u00c3", "\u00c2", "\ufffd"))
    question = next(q for q in definition(QUESTIONNAIRE_V2_ID).questions
                    if q.question_id == "prefer_ai_ml")
    assert question.options[-1].label == "Both or I'm not sure"


def test_removed_resume_cannot_supply_connections(monkeypatch):
    from asyncio import run
    from unittest.mock import AsyncMock

    from app.modules.recommendations import resume_connections

    lookup = AsyncMock(return_value=None)
    monkeypatch.setattr(resume_connections, "one", lookup)
    context = SimpleNamespace(
        document=SimpleNamespace(document_id="document", analysis_id="analysis", revision=2)
    )
    assert run(resume_connections.saved_connections(object(), "owner", context)) == {}
    assert lookup.call_args.args[2]["uid"] == "owner"
    assert lookup.call_args.args[2]["id"] == "document"


def test_follow_ups_do_not_repeat_activity_choices_or_each_other():
    questions = {q.question_id: q for q in definition(ID).questions}
    prompts = []
    for field, (_, choices) in SCENARIOS.items():
        labels = {
            option.label
            for option in questions["activities_" + field].options
            if option.id != "unsure"
        }
        for activity, _, _ in choices:
            follow_up = questions["scenario_" + activity]
            prompts.append(follow_up.prompt)
            assert not any(
                option.label in labels for option in follow_up.options if option.id != "unsure"
            )
            assert "Go deeper:" not in " ".join(o.label for o in follow_up.options)
    assert len(prompts) == len(set(prompts))


def test_resume_connection_requires_current_source_quote_and_career_relationship():
    context = SimpleNamespace(
        document=SimpleNamespace(analysis_id="analysis", revision=2),
        facts=[
            SimpleNamespace(
                id="pdf:0",
                source="pdf_analysis",
                source_id="analysis",
                source_revision=2,
                description="Document states: built SQL reports",
            )
        ],
    )
    relationships = [{"id": "skill", "career_id": "data", "label": "SQL reporting"}]
    mapping = {"competency_id": "skill", "evidence_index": 0, "quote": "built SQL reports"}
    assert resolve_connections([mapping], relationships, context)["data"][0]["fact_id"] == "pdf:0"
    assert (
        resolve_connections([{**mapping, "quote": "invented experience"}], relationships, context)
        == {}
    )
    assert (
        resolve_connections([{**mapping, "competency_id": "unrelated"}], relationships, context)
        == {}
    )
    context.document.revision = 3
    assert resolve_connections([mapping], relationships, context) == {}
