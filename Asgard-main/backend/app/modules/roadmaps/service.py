from app.modules.storage import one, required, rows


async def resources(connection, topic_id):
    result = await rows(
        connection,
        (
            "SELECT id, title, url, kind, is_free, license, reviewed_at, position "
            "FROM asgard_catalog.resources WHERE topic_id = CAST(:id AS uuid) ORDER"
            " BY position, id"
        ),
        {"id": str(topic_id)},
    )
    return result


async def topic(connection, roadmap_id, topic_id):
    result = required(
        await one(
            connection,
            (
                "SELECT * FROM asgard_catalog.topics WHERE roadmap_id = CAST(:roadmap "
                "AS uuid) AND id = CAST(:id AS uuid)"
            ),
            {"roadmap": str(roadmap_id), "id": str(topic_id)},
        )
    )
    result["prerequisite_ids"] = [
        row["prerequisite_id"]
        for row in await rows(
            connection,
            (
                "SELECT prerequisite_id FROM asgard_catalog.topic_prerequisites WHERE "
                "roadmap_id = CAST(:roadmap AS uuid) AND topic_id = CAST(:id AS uuid) "
                "ORDER BY prerequisite_id"
            ),
            {"roadmap": str(roadmap_id), "id": str(topic_id)},
        )
    ]
    result["resources"] = await resources(connection, topic_id)
    return result


async def milestones(connection, roadmap_id):
    required(
        await one(
            connection,
            "SELECT id FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid)",
            {"id": str(roadmap_id)},
        )
    )
    result = await rows(
        connection,
        (
            "SELECT * FROM asgard_catalog.milestones WHERE roadmap_id = CAST(:id AS"
            " uuid) ORDER BY position, id"
        ),
        {"id": str(roadmap_id)},
    )
    for milestone in result:
        groups = await rows(
            connection,
            (
                "SELECT id, title, explanation, position FROM "
                "asgard_catalog.branch_groups WHERE milestone_id = CAST(:id AS uuid) "
                "ORDER BY position, id"
            ),
            {"id": str(milestone["id"])},
        )
        for group in groups:
            group["branches"] = await rows(
                connection,
                (
                    "SELECT id, title, position FROM asgard_catalog.branches WHERE group_id"
                    " = CAST(:id AS uuid) ORDER BY position, id"
                ),
                {"id": str(group["id"])},
            )
        milestone["branch_groups"] = groups
        ids = await rows(
            connection,
            (
                "SELECT id FROM asgard_catalog.topics WHERE milestone_id = CAST(:id AS "
                "uuid) ORDER BY position, id"
            ),
            {"id": str(milestone["id"])},
        )
        milestone["topics"] = [await topic(connection, roadmap_id, row["id"]) for row in ids]
        milestone.pop("roadmap_id")
    return result


async def roadmap(connection, roadmap_id):
    result = required(
        await one(
            connection,
            "SELECT * FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid)",
            {"id": str(roadmap_id)},
        )
    )
    result["milestones"] = await milestones(connection, roadmap_id)
    return result
