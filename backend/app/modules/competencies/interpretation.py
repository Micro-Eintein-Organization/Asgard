"""Ephemeral skill previews and confirmed saves; descriptions are never persisted."""

import asyncio
import re

from app.core.errors import APIError
from app.modules.competencies import service
from app.modules.competencies.claims import positive_statements
from app.modules.competencies.schemas import SkillPreview, SkillSuggestion
from app.modules.skill_matching import interpretation
from app.modules.skill_matching.sources import CompetencyLinksSource, SnapshotSource
from app.modules.storage import one, rows, transaction


async def preview(request, identity, body):
    from app.modules.ai_guidance import reserve

    statements = positive_statements(body.text)
    sources = [{"text": value, "kind": "skill"} for value in statements[:30]]
    async with transaction(request, identity) as conn:
        catalog, _ = await interpretation.definitions(conn)
        topic_links = await rows(conn,
            "SELECT l.competency_id,l.career_id,t.id AS topic_id,t.roadmap_id,t.title "
            "FROM asgard_catalog.competency_links l "
            "JOIN asgard_catalog.topics t ON t.id=l.topic_id AND t.roadmap_id=l.roadmap_id "
            "JOIN asgard_catalog.roadmaps r ON r.id=t.roadmap_id "
            "JOIN asgard_catalog.milestones m ON m.id=t.milestone_id "
            "WHERE r.status='published' AND t.retired_at IS NULL AND m.retired_at IS NULL")
        paths = await CompetencyLinksSource().list_all(conn)
        settings = request.app.state.settings
        try:
            benchmark = await SnapshotSource(settings.skill_matching_benchmark_source,
                                            settings.skill_matching_benchmark_version).list_all(conn)
        except APIError as error:
            if error.status != 503:
                raise
            benchmark = None
    matches = {}
    owners = {}
    for skill in catalog:
        for term in (skill["label"], *skill["aliases"]):
            owners.setdefault(term.casefold(), set()).add(str(skill["id"]))
    for skill in catalog:
        for statement in statements:
            if any(re.search(r"(?<![\w+#])" + re.escape(term) + r"(?![\w+#])", statement, re.I)
                   for term in (skill["label"], *skill["aliases"])
                   if term and len(owners[term.casefold()]) == 1):
                matches[str(skill["id"])] = (statement, "exact")
                break
    available = bool(settings.groq_enabled and settings.groq_api_key.get_secret_value())
    if available and sources:
        async def budget(_retry):
            await reserve(request, identity, "skill_interpretation")
        try:
            async with asyncio.timeout(60):
                claims = await interpretation.generate(request.app.state.http, settings,
                    interpretation.request_batches(catalog, sources), budget)
            for claim in claims:
                matches.setdefault(claim["competency_id"], (claim["quote"], "interpreted"))
        except APIError as error:
            if error.status == 429:
                raise
            available = False
        except (TimeoutError, ValueError, KeyError, TypeError):
            available = False
    items = []
    for skill in catalog:
        match = matches.get(str(skill["id"]))
        if not match:
            continue
        applications = []
        for basis, source in (("learning_path", paths), ("benchmark", benchmark)):
            if source:
                for career in source.careers:
                    if any(s.competency_id == skill["id"] for s in career.skills):
                        applications.append({"career_id": career.career_id,
                            "title": career.name, "basis": basis,
                            "topics": [{key: link[key] for key in ("topic_id", "roadmap_id", "title")}
                                       for link in topic_links if basis == "learning_path"
                                       and link["competency_id"] == skill["id"]
                                       and link["career_id"] == career.career_id]})
        if applications:
            items.append(SkillSuggestion(competency_id=skill["id"], label=skill["label"],
                         quote=match[0], method=match[1], applications=applications))
    return SkillPreview(items=items[:30], interpretation_available=available)


async def confirm(request, identity, body):
    import json

    if len({item.competency_id for item in body.items}) != len(body.items):
        raise APIError(422, "duplicate_skills", "Select each skill once.")
    async with transaction(request, identity) as conn:
        await service.lock_account(conn, identity.user_id)
        await service.lock(conn, identity.user_id)
        current = await service.state(conn, identity.user_id)
        if current["version"] != body.expected_version:
            raise APIError(409, "competency_conflict", "Your skills changed. Reload before saving.")
        await one(conn, "SELECT asgard_private.confirm_reported_skills("
                  "CAST(:session AS uuid),:aal,:version,CAST(:items AS jsonb))", {
                      "session": str(identity.session_id), "aal": identity.aal,
                      "version": body.expected_version,
                      "items": json.dumps([item.model_dump(mode="json", exclude_unset=True)
                                           for item in body.items]),
                  })
        result = await service.state(conn, identity.user_id)
        result["recommendations_enabled"] = await service.privacy_ready(conn)
        return result
