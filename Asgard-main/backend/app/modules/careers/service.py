from app.core.errors import APIError
from app.modules.storage import one, required, rows


async def categories(connection):
    return await rows(connection, "SELECT * FROM asgard_catalog.categories ORDER BY position, id")


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
    return {
        key: result[key]
        for key in (
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
    ids = await rows(
        connection,
        "SELECT id FROM asgard_catalog.careers WHERE "
        + predicate
        + " ORDER BY title, id LIMIT :limit OFFSET :offset",
        parameters,
    )
    return {
        "items": [await career(connection, row["id"]) for row in ids],
        "total": count["total"],
        "limit": limit,
        "offset": offset,
        "catalog_release_id": release["id"],
    }
