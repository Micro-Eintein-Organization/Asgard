from app.core.errors import APIError
from app.modules.careers.exploration import skill_explanation
from app.modules.storage import lock_account, one, required, rows


async def privacy_ready(connection):
    result = await one(
        connection,
        "SELECT to_regprocedure('asgard_private.mutate_reported_skill"
        "(uuid,text,uuid,integer,integer,boolean)') IS NOT NULL AS ready",
    )
    return result["ready"]


async def lock(connection, user_id):
    await one(
        connection,
        "SELECT pg_advisory_xact_lock(hashtextextended(:uid, 411))",
        {"uid": str(user_id)},
    )


async def with_context(connection, items, identity_key):
    if not items:
        return items
    contexts = await rows(
        connection,
        "SELECT DISTINCT l.competency_id,c.id AS career_id,c.title FROM "
        "asgard_catalog.competency_links l JOIN asgard_catalog.careers c ON c.id=l.career_id "
        "WHERE l.competency_id=ANY(CAST(:ids AS uuid[])) ORDER BY c.title,c.id",
        {"ids": [str(item[identity_key]) for item in items]},
    )
    return [
        {
            **item,
            "explanation": skill_explanation(item[identity_key]),
            "career_context": [
                {"career_id": c["career_id"], "title": c["title"]}
                for c in contexts
                if c["competency_id"] == item[identity_key]
            ],
        }
        for item in items
    ]


async def state(connection, user_id):
    revision = await one(
        connection,
        "SELECT version FROM asgard_private.competency_state WHERE user_id=CAST(:uid AS uuid)",
        {"uid": str(user_id)},
    )
    items = await rows(
        connection,
        "SELECT u.competency_id,u.label,u.level,u.updated_at "
        "FROM asgard_private.user_competencies u "
        "WHERE u.user_id=CAST(:uid AS uuid) ORDER BY lower(u.label),u.competency_id",
        {"uid": str(user_id)},
    )
    return {
        "version": revision["version"] if revision else 0,
        "items": await with_context(connection, items, "competency_id"),
    }


async def search(connection, q, career_id, limit, offset):
    params = {
        "q": q.casefold(),
        "career": str(career_id) if career_id else None,
        "limit": limit,
        "offset": offset,
    }
    predicate = (
        "(strpos(lower(c.label),:q)>0 OR EXISTS (SELECT 1 FROM unnest(c.aliases) a "
        "WHERE strpos(lower(a),:q)>0)) AND (CAST(:career AS uuid) IS NULL OR EXISTS "
        "(SELECT 1 FROM asgard_catalog.competency_links l WHERE l.competency_id=c.id "
        "AND l.career_id=CAST(:career AS uuid)))"
    )
    count = await one(
        connection,
        "SELECT count(*) AS total FROM asgard_catalog.competencies c WHERE " + predicate,
        params,
    )
    items = await rows(
        connection,
        "SELECT c.id,c.label,c.source,c.source_version FROM "
        "asgard_catalog.competencies c WHERE "
        + predicate
        + " ORDER BY lower(c.label),c.id LIMIT :limit OFFSET :offset",
        params,
    )
    return {
        "items": await with_context(connection, items, "id"),
        "total": count["total"],
        "limit": limit,
        "offset": offset,
    }


async def change(connection, user_id, competency_id, body, remove=False, identity=None):
    integrated = identity is not None and await privacy_ready(connection)
    if integrated:
        await lock_account(connection, user_id)
    await lock(connection, user_id)
    current = await state(connection, user_id)
    if current["version"] != body.expected_version:
        raise APIError(
            409, "competency_conflict", "Your skills changed. Reload before saving again."
        )
    params = {"uid": str(user_id), "id": str(competency_id), "version": current["version"] + 1}
    if integrated:
        await one(
            connection,
            "SELECT asgard_private.mutate_reported_skill(CAST(:session AS uuid),:aal,"
            "CAST(:id AS uuid),:expected,CAST(:level AS integer),:remove)",
            {
                "session": str(identity.session_id),
                "aal": identity.aal,
                "id": str(competency_id),
                "expected": body.expected_version,
                "level": None if remove else body.level,
                "remove": remove,
            },
        )
        data = await state(connection, user_id)
        data["recommendations_enabled"] = True
        return data
    if not remove:
        reference = required(
            await one(
                connection,
                "SELECT id,label FROM asgard_catalog.competencies WHERE id=CAST(:id AS uuid)",
                params,
            )
        )
    await one(
        connection,
        "INSERT INTO asgard_private.competency_state(user_id,version) "
        "VALUES(CAST(:uid AS uuid),:version) ON CONFLICT(user_id) DO UPDATE SET "
        "version=excluded.version RETURNING version",
        params,
    )
    if remove:
        await rows(
            connection,
            "DELETE FROM asgard_private.user_competencies WHERE user_id=CAST(:uid AS uuid) "
            "AND competency_id=CAST(:id AS uuid) RETURNING competency_id",
            params,
        )
    else:
        params["level"] = body.level
        params["label"] = reference["label"]
        await one(
            connection,
            "INSERT INTO asgard_private.user_competencies(user_id,competency_id,label,level) "
            "VALUES(CAST(:uid AS uuid),CAST(:id AS uuid),:label,:level) ON "
            "CONFLICT(user_id,competency_id) "
            "DO UPDATE SET "
            "label=excluded.label,level=excluded.level,updated_at=statement_timestamp() "
            "RETURNING competency_id",
            params,
        )
    return await state(connection, user_id)


async def compare(connection, user_id, career_id):
    await lock(connection, user_id)
    linked = await rows(
        connection,
        "SELECT career.revision,c.id,c.label,c.source,c.source_version,t.id AS topic_id,"
        "t.roadmap_id,t.title,u.competency_id IS NOT NULL AS recorded,u.level,"
        "coalesce((SELECT version FROM asgard_private.competency_state WHERE user_id=CAST(:uid "
        "AS uuid)),0) AS account_version "
        "FROM asgard_catalog.careers career LEFT JOIN asgard_catalog.competency_links l ON "
        "l.career_id=career.id "
        "LEFT JOIN asgard_catalog.competencies c ON c.id=l.competency_id "
        "LEFT JOIN asgard_catalog.topics t ON t.id=l.topic_id "
        "LEFT JOIN asgard_private.user_competencies u ON u.competency_id=c.id AND "
        "u.user_id=CAST(:uid AS uuid) "
        "WHERE career.id=CAST(:id AS uuid) ORDER BY lower(c.label),c.id,t.position,t.id",
        {"id": str(career_id), "uid": str(user_id)},
    )
    required(linked or None)
    items = {}
    for row in linked:
        if row["id"] is None:
            continue
        key = str(row["id"])
        if key not in items:
            items[key] = {
                k: row[k] for k in ("id", "label", "source", "source_version", "recorded", "level")
            }
            items[key]["topics"] = []
        if row["topic_id"] is not None:
            items[key]["topics"].append({k: row[k] for k in ("topic_id", "roadmap_id", "title")})
    return {
        "career_id": career_id,
        "account_version": linked[0]["account_version"],
        "career_revision": linked[0]["revision"],
        "items": [
            {**item, "explanation": skill_explanation(item["id"])} for item in items.values()
        ],
    }
