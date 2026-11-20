"""Connect current resume evidence without provider calls or document writes."""

from uuid import UUID

from app.modules.skill_matching.interpretation import saved_state
from app.modules.skill_matching.matcher import BenchmarkSkill, Career, ResumeEvidence, rank_careers
from app.modules.skill_matching.technology_evidence import technology_terms
from app.modules.storage import one, rows


async def saved_connections(connection, uid, context):
    if context.document is None:
        return {}
    document = await one(
        connection,
        "SELECT id,analysis_id,revision,evidence FROM asgard_private.documents "
        "WHERE user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid) AND status='active' "
        "AND analysis_id=CAST(:analysis AS uuid) AND revision=:revision",
        {
            "uid": str(uid),
            "id": str(context.document.document_id),
            "analysis": str(context.document.analysis_id),
            "revision": context.document.revision,
        },
    )
    if not document:
        return {}
    state, mappings = await saved_state(connection, uid, document)
    if state.status != "completed":
        mappings = []
    relationships = await rows(
        connection,
        "SELECT DISTINCT l.career_id,c.id,c.label,c.aliases,true AS learning_path "
        "FROM asgard_catalog.competencies c "
        "JOIN asgard_catalog.competency_links l ON l.competency_id=c.id "
        "JOIN asgard_catalog.roadmaps r ON r.id=l.roadmap_id "
        "JOIN asgard_catalog.topics t ON t.id=l.topic_id "
        "JOIN asgard_catalog.careers career ON career.id=l.career_id "
        "WHERE c.published AND r.status='published' AND t.retired_at IS NULL "
        "AND career.status='published' "
        "UNION SELECT s.career_id,c.id,c.label,c.aliases,false AS learning_path "
        "FROM asgard_catalog.competencies c "
        "JOIN asgard_catalog.career_skill_snapshot s ON s.competency_id=c.id "
        "JOIN asgard_catalog.career_skill_posting_versions v ON v.source=s.source "
        "AND v.source_version=s.source_version "
        "JOIN asgard_catalog.careers career ON career.id=s.career_id "
        "WHERE c.published AND s.published AND v.status='published' "
        "AND career.status='published'",
    )
    mappings = [*mappings, *direct_mappings(document, relationships)]
    return resolve_connections(mappings, relationships, context)


def direct_mappings(document, relationships):
    skills = {}
    for link in relationships:
        career_id, skill_id = UUID(str(link["career_id"])), UUID(str(link["id"]))
        by_id = skills.setdefault(career_id, {})
        terms = technology_terms(link["label"]) if link["learning_path"] else ()
        previous = by_id.get(skill_id)
        if previous:
            terms = tuple(dict.fromkeys((*previous.supporting_technologies, *terms)))
        by_id[skill_id] = BenchmarkSkill(str(skill_id), link["label"],
                                       tuple(link["aliases"] or []), skill_id, terms)
    evidence = [ResumeEvidence(item["kind"], item["text"], item["page"], item["span"])
                for item in document["evidence"]]
    indices = {id(item): index for index, item in enumerate(evidence)}
    matches = rank_careers([Career(key, str(key), tuple(values.values()))
                           for key, values in skills.items()], (), evidence)
    mappings = []
    for career in matches:
        for skill in career.skill_matches:
            canonical = skills[career.career_id][skill.competency_id]
            for signal in skill.resume_signals:
                mappings.append({
                    "competency_id": str(skill.competency_id),
                    "evidence_index": indices[id(signal.evidence)],
                    "quote": signal.evidence.text,
                    "matched_phrases": list(signal.matched_phrases),
                    "technology_evidence": not any(
                        phrase in (canonical.label, *canonical.aliases)
                        for phrase in signal.matched_phrases
                    ),
                })
    return mappings


def resolve_connections(mappings, relationships, context):
    facts = {fact.id: fact for fact in context.facts if fact.source == "pdf_analysis"}
    found = {}
    for mapping in mappings:
        fact_id = "pdf:" + str(mapping["evidence_index"])
        fact = facts.get(fact_id)
        quote = mapping["quote"]
        if (
            not fact
            or not quote
            or quote not in fact.description
            or fact.source_id != str(context.document.analysis_id)
            or fact.source_revision != context.document.revision
        ):
            continue
        for link in relationships:
            if str(link["id"]) == str(mapping["competency_id"]):
                key = str(link["career_id"])
                item = {
                    "label": link["label"],
                    "competency_id": str(link["id"]),
                    "fact_id": fact_id,
                    "quote": quote,
                    "matched_phrases": mapping.get("matched_phrases", []),
                    "technology_evidence": mapping.get("technology_evidence", False),
                }
                if not any(previous["competency_id"] == item["competency_id"]
                           and previous["fact_id"] == fact_id
                           for previous in found.setdefault(key, [])):
                    found[key].append(item)
    return found
