from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.modules.discovery.definition import FIELDS, active_route
from app.modules.recommendations import discovery_rules


def selection(answers, excluded=()):
    catalog = [
        {"slug": slug, "career_id": uuid4(), "roadmap_ids": [uuid4()]}
        for slug in discovery_rules.ACTIVITY_CAREERS.values()
        if slug not in excluded
    ]
    completed = SimpleNamespace(
        active_question_ids=active_route(answers, 2),
        answers=[
            SimpleNamespace(question_id=question, option_ids=options)
            for question, options in answers.items()
        ],
    )
    items = discovery_rules.select(completed, catalog)
    assert items == discovery_rules.select(completed, list(reversed(catalog)))
    ids = {entry["career_id"]: entry["slug"] for entry in catalog}
    return [(ids[item.career_id], item) for item in items]


@pytest.mark.parametrize(
    "field,activity", [(field, activity) for field, _, choices in FIELDS for activity, _ in choices]
)
def test_each_activity_keeps_the_direct_match_ahead_of_published_alternatives(field, activity):
    items = selection({"interests": [field], f"activities_{field}": [activity]})
    expected = discovery_rules.ACTIVITY_CAREERS[activity]
    assert [slug for slug, _ in items] == [
        expected,
        *(slug for slug, _ in discovery_rules.RELATED_CAREERS[activity]),
    ]
    assert items[0][1].evidence_fact_ids == [f"discovery:activities_{field}:{activity}"]
    assert all(item.reason.startswith("Related option:") for _, item in items[1:])
    assert all(item.evidence_fact_ids == items[0][1].evidence_fact_ids for _, item in items)


def test_follow_up_first_then_interleave_fields_and_ignore_abandoned_branch():
    items = selection(
        {
            "interests": ["data", "build"],
            "activities_build": ["games", "ai_features"],
            "activities_data": ["train_models", "pipelines"],
            "activities_design": ["research"],
            "prefer_ai_ml": ["train_models"],
        }
    )
    assert [slug for slug, _ in items] == [
        "machine-learning-engineer",
        "game-developer",
        "data-engineer",
    ]
    assert items[0][1].evidence_fact_ids == ["discovery:prefer_ai_ml:train_models"]


def test_uncertain_answers_offer_distinct_broad_options():
    items = selection({"interests": ["unsure"], "activities_general": ["unsure"]}, ["frontend"])
    assert [slug for slug, _ in items] == ["backend-developer", "data-analyst", "ui-designer"]
    assert all(item.uncertainty_note for _, item in items)


def test_missing_exact_destination_uses_selected_field_with_a_caveat():
    items = selection({"interests": ["build"], "activities_build": ["games"]}, ["game-developer"])
    assert [slug for slug, _ in items] == ["frontend"]
    assert items[0][1].evidence_fact_ids == ["discovery:interests:build"]
    assert items[0][1].uncertainty_note


def test_related_careers_do_not_trigger_a_follow_up_or_fill_with_unrelated_roles():
    answers = {"interests": ["build"], "activities_build": ["ai_features"]}
    assert active_route(answers, 2) == [
        "experience_preference",
        "interests",
        "activities_build",
        "goals",
    ]
    items = selection(answers, ["machine-learning-engineer", "backend-developer"])
    assert [slug for slug, _ in items] == ["ai-engineer"]


def test_direct_matches_from_both_fields_precede_related_options():
    items = selection(
        {
            "interests": ["build", "data"],
            "activities_build": ["games"],
            "activities_data": ["pipelines"],
        }
    )
    assert [slug for slug, _ in items] == ["game-developer", "data-engineer", "frontend"]
    assert not items[1][1].reason.startswith("Related option:")
    assert items[2][1].evidence_fact_ids == ["discovery:activities_build:games"]
