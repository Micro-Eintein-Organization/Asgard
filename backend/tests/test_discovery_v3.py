from asyncio import run
from itertools import combinations
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest

from app.core.errors import APIError
from app.modules.discovery import service, v3
from app.modules.discovery.definition import active_route, definition
from app.modules.recommendations.discovery_v3_rules import choose


@pytest.mark.parametrize("fields", list(combinations(v3.SCENARIOS, 2)))
def test_pair_routes_have_bridge_and_both_fields(fields):
    route = active_route({"interests": list(fields)}, 3)
    assert "bridge_" + "_".join(fields) in route
    assert all("activities_" + field in route for field in fields)
    assert "goals" not in route
    assert len(route) <= 10


def test_security_data_scenarios_and_inactive_answers():
    route = active_route(
        {
            "interests": ["data", "security"],
            "activities_security": ["respond"],
            "activities_data": ["analyze"],
            "activities_build": ["games"],
        },
        3,
    )
    assert "scenario_respond" in route and "scenario_analyze" in route
    assert "scenario_games" not in route
    assert len({q.question_id for q in definition(v3.ID).questions}) == 47


def test_experience_gate_rejects_missing_evidence(monkeypatch):
    from app.modules.competencies import service as skills

    monkeypatch.setattr(skills, "state", AsyncMock(return_value={"items": []}))
    monkeypatch.setattr(service, "one", AsyncMock(return_value=None))
    with pytest.raises(APIError):
        run(service.require_experience(object(), "owner"))
    assert service.one.call_args.args[2] == {"uid": "owner"}


def test_experience_gate_accepts_confirmed_unrated_skill(monkeypatch):
    from app.modules.competencies import service as skills

    monkeypatch.setattr(
        skills,
        "state",
        AsyncMock(return_value={"items": [{"evidence_confirmed": True, "level": None}]}),
    )
    run(service.require_experience(object(), "owner"))


def test_security_choice_is_represented_with_data():
    from uuid import uuid4

    answers = {
        "interests": ["data", "security"],
        "activities_data": ["analyze"],
        "activities_security": ["respond"],
    }
    session = SimpleNamespace(
        questionnaire_id=v3.ID,
        active_question_ids=v3.route(answers),
        answers=[SimpleNamespace(question_id=q, option_ids=v) for q, v in answers.items()],
    )
    catalog = [
        {"slug": slug, "career_id": str(uuid4()), "roadmap_ids": [str(uuid4())]}
        for slug in ("data-analyst", "cybersecurity-analyst")
    ]
    assert len(choose(session, catalog)) == 2
