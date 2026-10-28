"""Discovery route and selection-policy regression cases."""

import pytest

from app.core.errors import APIError
from app.modules.discovery.definition import active_route, definition, validate_answer


@pytest.mark.parametrize(
    "interests,activity",
    [
        (["tools"], "tools"),
        (["design"], "design"),
        (["investigation"], "investigation"),
        (["systems"], "systems"),
        (["tools", "design"], "general"),
        (["unsure"], "general"),
    ],
)
def test_route_changes_do_not_destroy_inactive_branch_answers(interests, activity):
    retained = {
        "interests": interests,
        "activities_design": ["plan_screens"],
        "activities_tools": ["automate_tasks"],
    }
    route = active_route(retained)
    assert route == ["interests", "activities_" + activity, "approach", "background", "goals"]
    assert retained["activities_design"] == ["plan_screens"]
    assert retained["activities_tools"] == ["automate_tasks"]
    questions = {question.question_id: question for question in definition().questions}
    assert all(question in questions for question in route)


@pytest.mark.parametrize(
    "question_id,selected",
    [
        ("interests", ["tools", "unsure"]),
        ("interests", ["tools", "tools"]),
        ("interests", ["unknown"]),
        ("goals", ["start", "explore"]),
        ("background", ["new", "technology"]),
        ("activities_systems", ["plan_screens"]),
    ],
)
def test_server_rejects_conflicting_or_cross_branch_answers(question_id, selected):
    question = next(item for item in definition().questions if item.question_id == question_id)
    with pytest.raises(APIError) as error:
        validate_answer(question, selected)
    assert error.value.status == 422


def test_background_overlap_and_uncertainty_are_not_skill_assessments():
    question = next(item for item in definition().questions if item.question_id == "background")
    validate_answer(question, ["new", "other_field"])
    validate_answer(question, ["technology", "other_field"])
    validate_answer(question, ["unsure"])
