from app.core.content_cache import published_content
from app.core.errors import APIError
from app.modules.careers.exploration import career_explanation
from app.modules.storage import one, required, rows


@published_content
async def categories(connection):
    return await rows(connection, "SELECT * FROM asgard_catalog.categories ORDER BY position, id")


@published_content
async def career(connection, career_id):
    result = required(
        await one(
            connection,
            "SELECT * FROM asgard_catalog.careers WHERE id = CAST(:id AS uuid)",
            {"id": str(career_id)},
        )
    )
    result["roadmap_ids"] = [
        row["id"]
        for row in await rows(
            connection,
            "SELECT id FROM asgard_catalog.roadmaps WHERE career_id = CAST(:id AS uuid) "
            "AND status = 'published' ORDER BY id",
            {"id": str(career_id)},
        )
    ]
    result["exploration"] = career_explanation(career_id)
    return {
        key: result[key]
        for key in (
            "exploration",
            "id",
            "category_id",
            "slug",
            "title",
            "description",
            "responsibilities",
            "skills",
            "roadmap_ids",
            "revision",
            "status",
            "revision_note",
            "reviewed_at",
        )
    }


@published_content
async def list_careers(connection, q=None, category_id=None, limit=20, offset=0):
    release = await one(
        connection, "SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1"
    )
    if release is None:
        raise APIError(
            503, "catalog_unpublished", "The first career curriculum is awaiting publication."
        )
    parameters = {
        "q": q or "",
        "category": str(category_id) if category_id else None,
        "limit": limit,
        "offset": offset,
    }
    predicate = (
        "status = 'published' AND (:q = '' OR strpos(lower(title), lower(:q)) > 0 "
        "OR EXISTS (SELECT 1 FROM unnest(skills) s WHERE strpos(lower(s), lower(:q)) > 0)) "
        "AND (CAST(:category AS uuid) IS NULL OR category_id = CAST(:category AS uuid))"
    )
    count = await one(
        connection,
        "SELECT count(*) AS total FROM asgard_catalog.careers WHERE " + predicate,
        parameters,
    )
    items = await rows(
        connection,
        "SELECT * FROM asgard_catalog.careers WHERE " + predicate
        + " ORDER BY title, id LIMIT :limit OFFSET :offset",
        parameters,
    )
    roadmap_rows = await rows(
        connection,
        "SELECT id, career_id FROM asgard_catalog.roadmaps "
        "WHERE career_id = ANY(:ids) AND status = 'published' ORDER BY id",
        {"ids": [item["id"] for item in items]},
    ) if items else []
    by_career = {item["id"]: [] for item in items}
    for item in roadmap_rows:
        by_career[item["career_id"]].append(item["id"])
    fields = ("id", "category_id", "slug", "title", "description", "responsibilities",
              "skills", "revision", "status", "revision_note", "reviewed_at")
    results = [
        {**{key: item[key] for key in fields},
         "roadmap_ids": by_career[item["id"]],
         "exploration": career_explanation(item["id"])}
        for item in items
    ]
    return {
        "items": results,
        "total": count["total"],
        "limit": limit,
        "offset": offset,
        "catalog_release_id": release["id"],
    }


@published_content
async def catalog_summary(connection):
    release = required(await one(connection,
        "SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1"))
    counts = await rows(connection,
        "SELECT category_id, count(*) AS total FROM asgard_catalog.careers "
        "WHERE status='published' GROUP BY category_id")
    return {"categories": await categories.__wrapped__(connection), "catalog_release_id": release["id"],
            "by_category": {str(row["category_id"]): row["total"] for row in counts},
            "total": sum(row["total"] for row in counts)}
