from app.core.content_cache import published_content
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
    parameters = {"id": str(roadmap_id)}
    groups = await rows(
        connection,
        "SELECT g.id, g.milestone_id, g.title, g.explanation, g.position "
        "FROM asgard_catalog.branch_groups g "
        "JOIN asgard_catalog.milestones m ON m.id = g.milestone_id "
        "WHERE m.roadmap_id = CAST(:id AS uuid) ORDER BY g.position, g.id",
        parameters,
    )
    branches = await rows(
        connection,
        "SELECT b.id, b.group_id, b.title, b.position "
        "FROM asgard_catalog.branches b "
        "JOIN asgard_catalog.branch_groups g ON g.id = b.group_id "
        "JOIN asgard_catalog.milestones m ON m.id = g.milestone_id "
        "WHERE m.roadmap_id = CAST(:id AS uuid) ORDER BY b.position, b.id",
        parameters,
    )
    topics = await rows(
        connection,
        "SELECT * FROM asgard_catalog.topics "
        "WHERE roadmap_id = CAST(:id AS uuid) ORDER BY position, id",
        parameters,
    )
    prerequisites = await rows(
        connection,
        "SELECT topic_id, prerequisite_id FROM asgard_catalog.topic_prerequisites "
        "WHERE roadmap_id = CAST(:id AS uuid) ORDER BY prerequisite_id",
        parameters,
    )
    topic_resources = await rows(
        connection,
        "SELECT r.topic_id, r.id, r.title, r.url, r.kind, r.is_free, r.license, "
        "r.reviewed_at, r.position FROM asgard_catalog.resources r "
        "JOIN asgard_catalog.topics t ON t.id = r.topic_id "
        "WHERE t.roadmap_id = CAST(:id AS uuid) ORDER BY r.position, r.id",
        parameters,
    )
    by_milestone = {item["id"]: item for item in result}
    by_group = {item["id"]: item for item in groups}
    by_topic = {item["id"]: item for item in topics}
    for milestone in result:
        milestone["branch_groups"] = []
        milestone["topics"] = []
        milestone.pop("roadmap_id")
    for group in groups:
        group["branches"] = []
        by_milestone[group.pop("milestone_id")]["branch_groups"].append(group)
    for branch in branches:
        by_group[branch.pop("group_id")]["branches"].append(branch)
    for item in topics:
        item["prerequisite_ids"] = []
        item["resources"] = []
        by_milestone[item["milestone_id"]]["topics"].append(item)
    for prerequisite in prerequisites:
        by_topic[prerequisite["topic_id"]]["prerequisite_ids"].append(
            prerequisite["prerequisite_id"]
        )
    for resource in topic_resources:
        by_topic[resource.pop("topic_id")]["resources"].append(resource)
    return result


@published_content
async def roadmap(connection, roadmap_id):
    # One statement supplies one publication snapshot, including every nested collection.
    record = required(await one(connection, """
        SELECT to_jsonb(r) || jsonb_build_object('milestones', COALESCE((
          SELECT jsonb_agg((to_jsonb(m) - 'roadmap_id') || jsonb_build_object(
            'branch_groups', COALESCE((SELECT jsonb_agg(
              (to_jsonb(g) - 'milestone_id' - 'roadmap_id') || jsonb_build_object('branches',
                COALESCE((SELECT jsonb_agg(to_jsonb(b) - 'group_id' - 'roadmap_id' - 'milestone_id' ORDER BY b.position, b.id)
                  FROM asgard_catalog.branches b WHERE b.group_id=g.id), '[]'::jsonb))
              ORDER BY g.position, g.id) FROM asgard_catalog.branch_groups g
              WHERE g.milestone_id=m.id), '[]'::jsonb),
            'topics', COALESCE((SELECT jsonb_agg(to_jsonb(t) || jsonb_build_object(
              'prerequisite_ids', COALESCE((SELECT jsonb_agg(p.prerequisite_id ORDER BY p.prerequisite_id)
                FROM asgard_catalog.topic_prerequisites p WHERE p.topic_id=t.id
                AND p.roadmap_id=r.id), '[]'::jsonb),
              'resources', COALESCE((SELECT jsonb_agg(to_jsonb(x) - 'topic_id' ORDER BY x.position, x.id)
                FROM asgard_catalog.resources x WHERE x.topic_id=t.id), '[]'::jsonb))
              ORDER BY t.position, t.id) FROM asgard_catalog.topics t
              WHERE t.milestone_id=m.id AND t.roadmap_id=r.id), '[]'::jsonb))
            ORDER BY m.position, m.id) FROM asgard_catalog.milestones m
          WHERE m.roadmap_id=r.id), '[]'::jsonb)) AS payload
        FROM asgard_catalog.roadmaps r WHERE r.id=CAST(:id AS uuid)
    """, {"id": str(roadmap_id)}))
    from app.modules.roadmaps.schemas import Roadmap

    return Roadmap.model_validate(record["payload"]).model_dump()
