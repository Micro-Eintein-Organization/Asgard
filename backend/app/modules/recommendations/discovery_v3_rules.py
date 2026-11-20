"""Ground v3 explanations in saved scenarios and supplied experience."""

from collections import defaultdict

from app.modules.discovery.definition import definition
from app.modules.recommendations.discovery_rules import ACTIVITY_CAREERS, select
from app.modules.recommendations.schemas import UntrustedRecommendationItem


def choose(session, catalog, experience=None):
    available = {entry["slug"]: entry for entry in catalog}
    support = defaultdict(list)
    labels = {
        q.question_id: {o.id: o.label for o in q.options}
        for q in definition(session.questionnaire_id).questions
    }
    for answer in session.answers:
        if answer.question_id not in session.active_question_ids:
            continue
        if not answer.question_id.startswith(("scenario_", "activities_")):
            continue
        for value in answer.option_ids:
            slug = ACTIVITY_CAREERS.get(value)
            if slug in available:
                support[slug].append((answer.question_id, value))
    if not support:
        return select(session, catalog)
    ordered = sorted(
        support,
        key=lambda slug: (
            -sum(q.startswith("scenario_") for q, _ in support[slug]),
            -len(support[slug]),
            -(experience or {}).get(str(available[slug]["career_id"]), 0),
            slug,
        ),
    )
    # Reserve a supported destination for each selected field before filling alternatives.
    fields = [q for q in session.active_question_ids if q.startswith("activities_")]
    priority = next(
        (
            value
            for answer in session.answers
            if answer.question_id in session.active_question_ids
            and answer.question_id.startswith("bridge_")
            for value in answer.option_ids
            if "activities_" + value in fields
        ),
        None,
    )
    if priority:
        fields.sort(key=lambda field: field != "activities_" + priority)
    selected = []
    for field in fields:
        candidate = next(
            (slug for slug in ordered if any(q == field for q, _ in support[slug])), None
        )
        if candidate and candidate not in selected:
            selected.append(candidate)
    selected.extend(slug for slug in ordered if slug not in selected)
    return [
        UntrustedRecommendationItem(
            career_id=available[slug]["career_id"],
            roadmap_id=available[slug]["roadmap_ids"][0],
            evidence_fact_ids=[f"discovery:{q}:{value}" for q, value in support[slug]],
            reason="You chose: " + "; ".join(labels[q][value] for q, value in support[slug]) + ".",
        )
        for slug in selected[:3]
    ]


def explain(items, session, context):
    facts = {fact.id: fact for fact in context.facts}
    for item in items:
        activities = [key.rsplit(":", 1)[-1] for key in item.evidence_fact_ids]
        for activity in activities:
            scenario = next(
                (
                    fact
                    for fact in context.facts
                    if fact.source_id == "scenario_" + activity
                    and not fact.id.endswith(":unsure")
                    and fact.id not in item.evidence_fact_ids
                ),
                None,
            )
            if scenario:
                item.evidence_fact_ids.append(scenario.id)
                item.reason += " " + scenario.description
        item.reason += (' Explore this roadmap to connect the introductory foundations to '
            'practical work. Opening it keeps your current learning focus '
            'unchanged.')
        item.uncertainty_note = ('These choices describe work you want to explore, not assessed '
            'ability. Experience does not establish proficiency.')
        item.reason = item.reason[:1200]
        assert all(key in facts for key in item.evidence_fact_ids)
    return items
