"""Reuse current validated resume mappings; recommendation reads never interpret documents."""

from app.modules.skill_matching.interpretation import saved_state
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
        return {}
    relationships = await rows(
        connection,
        "SELECT DISTINCT l.career_id,c.id,c.label FROM asgard_catalog.competencies c "
        "JOIN asgard_catalog.competency_links l ON l.competency_id=c.id "
        "JOIN asgard_catalog.roadmaps r ON r.id=l.roadmap_id "
        "JOIN asgard_catalog.topics t ON t.id=l.topic_id "
        "WHERE c.published AND r.status='published' AND t.retired_at IS NULL "
        "UNION SELECT s.career_id,c.id,c.label FROM asgard_catalog.competencies c "
        "JOIN asgard_catalog.career_skill_snapshot s ON s.competency_id=c.id "
        "JOIN asgard_catalog.career_skill_posting_versions v ON v.source=s.source "
        "AND v.source_version=s.source_version "
        "WHERE c.published AND s.published AND v.status='published'",
    )
    return resolve_connections(mappings, relationships, context)


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
                }
                if item not in found.setdefault(key, []):
                    found[key].append(item)
    return found
