"""Account-locked runtime bridge to immutable occupational evidence."""

from itertools import zip_longest

from app.modules.competencies import service as skills
from app.modules.recommendations.occupational_context import reported_facts, select_references
from app.modules.storage import one


async def reference_release(connection):
    ready = await one(
        connection,
        "SELECT to_regclass('asgard_catalog.occupational_active_release') IS NOT NULL AS ready",
    )
    if not ready["ready"]:
        return None
    active = await one(
        connection,
        "SELECT asgard_catalog.lock_occupational_release() AS release_id",
    )
    return str(active["release_id"]) if active and active["release_id"] else None


async def context_additions(connection, uid):
    if not await skills.privacy_ready(connection):
        return None, []
    await skills.lock(connection, uid)
    reports = await skills.state(connection, uid)
    release = await reference_release(connection)
    refs = []
    limitations = [
        "References are an agent-reviewed local-test subset; "
        "independent content approval is pending.",
        "At most six observations per career are supplied; full profiles are available separately.",
    ]
    if release:
        row = await one(
            connection,
            "SELECT payload FROM asgard_catalog.occupational_releases WHERE id=CAST(:id AS uuid)",
            {"id": release},
        )
        references_by_career = [
            select_references(release, profile, reports)["references"]
            for profile in row["payload"]["profiles"]
        ]
        all_refs = [
            ref
            for group in zip_longest(*references_by_career)
            for ref in group
            if ref is not None
        ]
        refs = all_refs[:72]
        if len(all_refs) > len(refs):
            limitations.append("Occupational evidence was capped across the expanded catalog.")
    else:
        limitations.append(
            "Occupational references are unavailable; only user context is supplied."
        )
    return {
        "skill_profile_version": reports["version"],
        "occupational_release_id": release,
        "source_references": refs,
        "coverage_limitations": limitations,
    }, reported_facts(reports)


def prepare_selection(settings, content, diagnostics=None):
    from app.modules.recommendations.provider import ProviderFailure, prepare_request
    from app.modules.recommendations.selection import provider_payload

    compact = settings.groq_model in ("openai/gpt-oss-120b", "openai/gpt-oss-20b")
    while True:
        payload, candidates, facts = provider_payload(content, compact=compact)
        try:
            prepared = prepare_request(settings, payload, diagnostics=diagnostics)
            return payload, candidates, facts, prepared
        except ProviderFailure as exc:
            refs = content["context"].get("source_references", [])
            if exc.stage != "input_budget" or not refs:
                raise
            counts = {}
            for ref in refs:
                career = ref["career_id"]
                counts[career] = counts.get(career, 0) + 1
            career = max(counts, key=lambda key: (counts[key], key))
            index = max(i for i, ref in enumerate(refs) if ref["career_id"] == career)
            refs.pop(index)
            note = "Occupational evidence was reduced to fit the generation budget."
            limitations = content["context"].setdefault("coverage_limitations", [])
            if note not in limitations:
                limitations.append(note)
