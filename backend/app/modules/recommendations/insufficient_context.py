"""Honest, evidence-only results when no career direction was supplied."""

from app.modules.discovery.definition import definition
from app.modules.recommendations.schemas import UntrustedRecommendationItem

VERSION = "experience-fallback-1"


def has_direction(session):
    if session is None:
        return False
    questions = {q.question_id: q for q in definition(session.questionnaire_id).questions}
    return any(
        answer.question_id in session.active_question_ids
        and questions[answer.question_id].stage in ("interests", "activities")
        and questions[answer.question_id].kind != "experience_preference"
        and any(value not in ("unsure", "both") for value in answer.option_ids)
        for answer in session.answers
    )


def select(catalog, context, reports, resume_links):
    facts = {fact.id: fact for fact in context.facts}
    supported = []
    for career in catalog:
        career_id = str(career["career_id"])
        evidence, labels, skills = [], [], set()
        for report in reports["items"]:
            fact_id = "reported-skill:" + str(report["competency_id"])
            positive = (report.get("level") or 0) > 0 or (
                report.get("level") is None and report.get("evidence_confirmed")
            )
            if positive and fact_id in facts and any(
                str(link["career_id"]) == career_id for link in report["career_context"]
            ):
                evidence.append(fact_id)
                labels.append(report["label"])
                skills.add(str(report["competency_id"]))
        for link in resume_links.get(career_id, []):
            if link["fact_id"] in facts:
                evidence.append(link["fact_id"])
                labels.append(link["label"])
                skills.add(str(link["competency_id"]))
        if not evidence or not career["roadmap_ids"]:
            continue
        supported.append((len(skills), career["slug"], UntrustedRecommendationItem(
            career_id=career_id,
            roadmap_id=career["roadmap_ids"][0],
            evidence_fact_ids=list(dict.fromkeys(evidence))[:20],
            reason="Your saved experience includes " + ", ".join(dict.fromkeys(labels))[:600]
            + ". These skills connect to " + career["title"] + ".",
            uncertainty_note="Based on supplied experience. Your interests remain unknown; "
            "this is not an assessment of proficiency or career suitability.",
        )))
    supported.sort(key=lambda item: (-item[0], item[1]))
    return [item[2] for item in supported[:3]]
