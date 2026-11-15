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
    from app.modules.careers.schemas import Career, CareerPage

    snapshot = await one(connection, """
      WITH filtered AS MATERIALIZED (
        SELECT * FROM asgard_catalog.careers WHERE status='published'
        AND (:q='' OR strpos(lower(title),lower(:q)) > 0 OR EXISTS (
          SELECT 1 FROM unnest(skills) s WHERE strpos(lower(s),lower(:q)) > 0))
        AND (CAST(:category AS uuid) IS NULL OR category_id=CAST(:category AS uuid))
      ), page AS (SELECT * FROM filtered ORDER BY title,id LIMIT :limit OFFSET :offset)
      SELECT (SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1) AS release_id,
        (SELECT count(*) FROM filtered) AS total,
        COALESCE((SELECT jsonb_agg(to_jsonb(c) || jsonb_build_object('roadmap_ids',
          COALESCE((SELECT jsonb_agg(r.id ORDER BY r.id) FROM asgard_catalog.roadmaps r
            WHERE r.career_id=c.id AND r.status='published'), '[]'::jsonb)) ORDER BY c.title,c.id)
          FROM page c), '[]'::jsonb) AS items
    """, {"q": q or "", "category": str(category_id) if category_id else None,
          "limit": limit, "offset": offset})
    if snapshot["release_id"] is None:
        raise APIError(503, "catalog_unpublished", "The first career curriculum is awaiting publication.")
    from uuid import UUID

    snapshot["items"] = [{key: value for key, value in item.items()
                           if key in Career.model_fields} for item in snapshot["items"]]
    for item in snapshot["items"]:
        item["exploration"] = career_explanation(UUID(item["id"]))
    return CareerPage.model_validate({"items": snapshot["items"], "total": snapshot["total"],
        "limit": limit, "offset": offset, "catalog_release_id": snapshot["release_id"]}).model_dump()


@published_content
async def catalog_summary(connection):
    from app.modules.careers.schemas import CatalogSummary

    snapshot = await one(connection, """
      SELECT (SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1) AS release_id,
        COALESCE((SELECT jsonb_agg(to_jsonb(c) ORDER BY position,id)
          FROM asgard_catalog.categories c), '[]'::jsonb) AS categories,
        COALESCE((SELECT jsonb_object_agg(category_id,total) FROM (
          SELECT category_id,count(*) AS total FROM asgard_catalog.careers
          WHERE status='published' GROUP BY category_id) counts), '{}'::jsonb) AS counts
    """)
    required(snapshot["release_id"])
    return CatalogSummary.model_validate({"categories": snapshot["categories"],
        "catalog_release_id": snapshot["release_id"], "by_category": snapshot["counts"],
        "total": sum(snapshot["counts"].values())}).model_dump()
