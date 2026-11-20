"""Transparent interest/experience tiers, using only the published candidate roster."""

from app.modules.discovery.v3 import SCENARIOS
from app.modules.recommendations.discovery_rules import ACTIVITY_CAREERS, ACTIVITY_LABELS
from app.modules.recommendations.schemas import UntrustedRecommendationItem

VERSION = "discovery-rules-4.1"


def choose(session, catalog, experience):
    available = {c["slug"]: c for c in catalog}
    field_for = {
        ACTIVITY_CAREERS[key]: field
        for field, (_, choices) in SCENARIOS.items()
        for key, _, _ in choices
    }
    answers = {
        a.question_id: a.option_ids
        for a in session.answers
        if a.question_id in session.active_question_ids
    }
    fields = set(answers.get("interests", [])) - {"unsure"}
    support, preferred = {}, set()
    for question, values in answers.items():
        if question.startswith(("activities_", "scenario_")):
            for value in values:
                slug = ACTIVITY_CAREERS.get(value)
                if slug in available:
                    support.setdefault(slug, set()).add(value)
                    if question.startswith("scenario_"):
                        preferred.add(slug)
    pool = {slug for slug in available if slug in support or experience.get(slug, 0)}
    if not pool:
        pool = {slug for slug in available if not fields or field_for.get(slug) in fields}

    def key(slug):
        tier = (
            0
            if slug in preferred
            else 1
            if slug in support and experience.get(slug)
            else 2
            if slug in support
            else 3
        )
        return tier, -len(support.get(slug, set())), -experience.get(slug, 0), slug

    main = sorted((s for s in pool if not fields or field_for.get(s) in fields), key=key)
    chosen = []
    coverage = fields or ({field_for[s] for s in main if s in field_for} if not support else set())
    for field in sorted(coverage):
        candidate = next((s for s in main if field_for.get(s) == field), None)
        if candidate:
            chosen.append(candidate)
    representatives = list(chosen)
    chosen.extend(s for s in main if s not in chosen)
    chosen = sorted(chosen[:3], key=key)
    outside = sorted(
        (
            s
            for s in pool
            if fields
            and field_for.get(s) not in fields
            and (experience.get(s, 0) >= 2 or s in experience.get("_task_roles", []))
        ),
        key=key,
    )
    if outside:
        retained = representatives[:2]
        retained.extend(s for s in chosen if s not in retained)
        chosen = sorted(retained[:2], key=key) + outside[:1]
    result = []
    for slug in chosen[:3]:
        facts = [
            f"discovery:{q}:{v}"
            for q, values in answers.items()
            for v in values
            if ACTIVITY_CAREERS.get(v) == slug
        ]
        if not facts:
            facts = [f"discovery:interests:{next(iter(answers.get('interests', ['unsure'])))}"]
        career = available[slug]
        work = next(
            (ACTIVITY_LABELS[key] for key, role in ACTIVITY_CAREERS.items() if role == slug), slug
        )
        rationale = (
            "This role emphasizes work such as "
            + work[0].lower()
            + work[1:]
            + ". "
            + (
                "It connects your stated direction with relevant supplied background."
                if experience.get(slug)
                else "Its responsibilities align with the work you want to explore."
            )
        )
        rival = next(
            (
                s
                for s in main
                if s != slug and field_for.get(s) == field_for.get(slug) and key(slug) < key(s)
            ),
            None,
        )
        if rival:
            distinction = (
                "your clarified work preference"
                if slug in preferred
                else "the combination of your work interests and supplied background"
                if slug in support and experience.get(slug)
                else "the supported responsibilities you want to explore"
            )
            rationale += (
                " Compared with "
                + available[rival].get("title", rival.replace("-", " "))
                + ", "
                + distinction
                + " gives this option stronger support."
            )
        if fields and field_for.get(slug) not in fields:
            rationale = (
                "Experience-supported alternative: "
                + rationale
                + " This extends beyond your selected fields."
            )
        result.append(
            UntrustedRecommendationItem(
                career_id=career["career_id"],
                roadmap_id=career["roadmap_ids"][0],
                evidence_fact_ids=facts,
                reason=rationale,
                uncertainty_note=(
                    "Suggestions support exploration; supplied experience "
                    "is not assessed proficiency."
                ),
            )
        )
    return result
