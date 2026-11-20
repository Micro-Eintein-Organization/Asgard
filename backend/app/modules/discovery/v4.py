"""Bounded, versioned question planning and stable phase progress."""

from uuid import NAMESPACE_URL, uuid5

from app.modules.discovery.v3 import SCENARIOS
from app.modules.recommendations.discovery_rules import ACTIVITY_CAREERS

ID = uuid5(NAMESPACE_URL, "asgard/content/questionnaire/4")
VERSION = "discovery-planner-4"


def definition(base):
    return base.model_copy(update={"id": ID, "version": 4})


def route(answers, experience=None):
    fields = [field for field in SCENARIOS if field in answers.get("interests", [])]
    bases = ["activities_" + field for field in fields] or ["activities_general"]
    result = ["experience_preference", "interests"]
    unsure = 0
    for question in bases:
        result.append(question)
        if question not in answers:
            return result
        unsure = unsure + 1 if answers[question] == ["unsure"] else 0
        if unsure == 2:
            return result
    for field in fields:
        selected = answers.get("activities_" + field, [])
        selected = [key for key, _, _ in SCENARIOS[field][1] if key in selected]
        supported = {ACTIVITY_CAREERS[key] for key in selected}
        from app.modules.discovery.follow_ups import SITUATIONS

        available_roles = (
            {ACTIVITY_CAREERS[key] for key, _, _ in SITUATIONS[selected[0]][1]}
            if selected
            else set()
        )
        conflict = any(
            (experience or {}).get(ACTIVITY_CAREERS[key], 0)
            for key, _, _ in SCENARIOS[field][1]
            if ACTIVITY_CAREERS[key] not in supported and ACTIVITY_CAREERS[key] in available_roles
        )
        if selected and (len(selected) > 1 or conflict):
            question = "scenario_" + selected[0]
            result.append(question)
            if question not in answers:
                return result
            unsure = unsure + 1 if answers[question] == ["unsure"] else 0
            if unsure == 2:
                break
    return result


def metadata(answers, active, changed=False):
    fields = [field for field in SCENARIOS if field in answers.get("interests", [])]
    slots = max(1, len(fields)) + 2
    values = {}
    for index, question in enumerate(active):
        values[question] = (
            0 if index == 0 else 20 if index == 1 else (35 + 55 * (index - 2) / slots)
        )
    return {
        "planner_version": VERSION,
        "phases": ["Background", "Interests", "Explore work", "Results"],
        "progress_by_question": values,
        "experience_changed": changed,
    }
