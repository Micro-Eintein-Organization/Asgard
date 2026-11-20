from types import SimpleNamespace
from uuid import uuid4

from app.modules.discovery.v4 import metadata, route
from app.modules.recommendations.discovery_v4_rules import choose


def test_clear_work_choice_finishes_without_repeated_follow_up():
    answers = {"interests": ["infrastructure"], "activities_infrastructure": ["cloud"]}
    assert route(answers) == ["experience_preference", "interests", "activities_infrastructure"]
    assert "scenario_cloud" in route(answers, {"network-engineer": 1})


def test_two_uncertain_fields_stop_and_progress_has_stable_slots():
    answers = {
        "interests": ["data", "security"],
        "activities_data": ["unsure"],
        "activities_security": ["unsure"],
    }
    active = route(answers)
    assert len(active) == 4
    progress = metadata(answers, active)["progress_by_question"]
    assert list(progress.values()) == sorted(progress.values())
    assert (
        progress["activities_data"]
        == metadata(answers, active + ["scenario_analyze"])["progress_by_question"][
            "activities_data"
        ]
    )


def test_experience_introduces_candidate_and_outside_option_needs_support():
    values = {"interests": ["data"], "activities_data": ["analyze"]}
    session = SimpleNamespace(
        answers=[SimpleNamespace(question_id=q, option_ids=v) for q, v in values.items()],
        active_question_ids=route(values),
    )
    catalog = [
        {"slug": slug, "career_id": uuid4(), "roadmap_ids": [uuid4()]}
        for slug in ("data-analyst", "data-engineer", "cybersecurity-analyst")
    ]
    base = choose(session, catalog, {})
    assert len(base) == 1
    expanded = choose(session, catalog, {"data-engineer": 1, "cybersecurity-analyst": 2})
    assert len(expanded) == 3
    assert expanded[-1].career_id == catalog[-1]["career_id"]
    assert "alternative" in expanded[-1].reason


def test_outside_alternative_preserves_both_selected_fields():
    values = {
        "interests": ["data", "security"],
        "activities_data": ["analyze", "pipelines"],
        "activities_security": ["respond"],
    }
    session = SimpleNamespace(
        answers=[SimpleNamespace(question_id=q, option_ids=v) for q, v in values.items()],
        active_question_ids=route(values),
    )
    catalog = [
        {"slug": slug, "career_id": uuid4(), "roadmap_ids": [uuid4()]}
        for slug in ("data-analyst", "data-engineer", "cybersecurity-analyst", "backend-developer")
    ]
    result = choose(
        session, catalog, {"data-engineer": 4, "data-analyst": 3, "backend-developer": 2}
    )
    assert catalog[2]["career_id"] in {item.career_id for item in result}
    assert result[-1].career_id == catalog[-1]["career_id"]
