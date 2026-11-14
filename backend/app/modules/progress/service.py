from datetime import UTC, date, datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import text

from app.core.errors import APIError
from app.modules.roadmaps.service import roadmap
from app.modules.storage import lock_account, one, required, rows


def conflict():
    raise APIError(409, "state_conflict", "Your saved state changed. Reload before saving again.")


def learning_fields(state):
    return {key: state[key] for key in ("current_roadmap_id", "version", "context_revision")}


async def learning(connection, uid):
    return learning_fields(await lock_account(connection, uid))


async def preferences(connection, uid):
    await connection.execute(
        text(

                "INSERT INTO asgard_private.preferences (user_id) VALUES (CAST(:uid AS "
                "uuid)) ON CONFLICT (user_id) DO NOTHING"

        ),
        {"uid": str(uid)},
    )
    result = required(
        await one(
            connection,
            (
                "SELECT preferred_category_id, timezone, dismissed_guidance, version "
                "FROM asgard_private.preferences WHERE user_id = CAST(:uid AS uuid)"
            ),
            {"uid": str(uid)},
        )
    )
    return result


async def save_preferences(connection, uid, body):
    await lock_account(connection, uid)
    parameters = body.model_dump() | {"uid": str(uid)}
    parameters["preferred_category_id"] = (
        str(body.preferred_category_id) if body.preferred_category_id else None
    )
    if body.preferred_category_id:
        required(
            await one(
                connection,
                "SELECT id FROM asgard_catalog.categories WHERE id = CAST(:id AS uuid)",
                {"id": str(body.preferred_category_id)},
            )
        )
    if body.expected_version == 0:
        result = await one(
            connection,
            (
                "INSERT INTO asgard_private.preferences (user_id, "
                "preferred_category_id, timezone, dismissed_guidance) VALUES (CAST(:uid"
                " AS uuid), CAST(:preferred_category_id AS uuid), :timezone, "
                ":dismissed_guidance) ON CONFLICT (user_id) DO NOTHING RETURNING "
                "version"
            ),
            parameters,
        )
    else:
        result = await one(
            connection,
            (
                "UPDATE asgard_private.preferences SET preferred_category_id = "
                "CAST(:preferred_category_id AS uuid), timezone = :timezone, "
                "dismissed_guidance = :dismissed_guidance, version = version + 1 WHERE "
                "user_id = CAST(:uid AS uuid) AND version = :expected_version RETURNING"
                " version"
            ),
            parameters,
        )
    if result is None:
        conflict()
    return await preferences(connection, uid)


async def select_roadmap(connection, uid, body):
    state = await lock_account(connection, uid)
    if body.expected_version == 0:
        if not state["_created"]:
            conflict()
    elif body.expected_version != state["version"]:
        conflict()
    target = required(
        await one(
            connection,
            (
                "SELECT id FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid) "
                "AND status = 'published'"
            ),
            {"id": str(body.roadmap_id)},
        )
    )
    if state["current_roadmap_id"] == target["id"]:
        return learning_fields(state)
    if await one(
        connection,
        (
            "SELECT topic_id FROM asgard_private.topic_progress WHERE user_id = "
            "CAST(:uid AS uuid) AND status = 'learning'"
        ),
        {"uid": str(uid)},
    ):
        raise APIError(
            409,
            "learning_resolution_required",
            "Mark the Learning topic Done, Skip or Clear before changing roadmap.",
        )
    await connection.execute(
        text(

                "UPDATE asgard_private.learning_state SET current_roadmap_id = CAST(:id"
                " AS uuid), version = version + 1, updated_at = statement_timestamp() "
                "WHERE user_id = CAST(:uid AS uuid)"

        ),
        {"uid": str(uid), "id": str(body.roadmap_id)},
    )
    return await learning(connection, uid)


async def progress(connection, uid, roadmap_id):
    required(
        await one(
            connection,
            "SELECT id FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid)",
            {"id": str(roadmap_id)},
        )
    )
    return await rows(
        connection,
        (
            "SELECT roadmap_id, topic_id, status, version, updated_at FROM "
            "asgard_private.topic_progress WHERE user_id = CAST(:uid AS uuid) AND "
            "roadmap_id = CAST(:id AS uuid) ORDER BY topic_id"
        ),
        {"uid": str(uid), "id": str(roadmap_id)},
    )


async def save_progress(connection, uid, roadmap_id, topic_id, body):
    await lock_account(connection, uid)
    parameters = {
        "uid": str(uid),
        "roadmap": str(roadmap_id),
        "topic": str(topic_id),
        "status": body.status,
        "expected": body.expected_version,
    }
    target = required(
        await one(
            connection,
            (
                "SELECT t.id, t.retired_at, r.status AS roadmap_status FROM "
                "asgard_catalog.topics t JOIN asgard_catalog.roadmaps r ON r.id = "
                "t.roadmap_id WHERE t.id = CAST(:topic AS uuid) AND t.roadmap_id = "
                "CAST(:roadmap AS uuid)"
            ),
            parameters,
        )
    )
    old = await one(
        connection,
        (
            "SELECT * FROM asgard_private.topic_progress WHERE user_id = CAST(:uid "
            "AS uuid) AND roadmap_id = CAST(:roadmap AS uuid) AND topic_id = "
            "CAST(:topic AS uuid) FOR UPDATE"
        ),
        parameters,
    )
    if (old["version"] if old else 0) != body.expected_version:
        conflict()
    unavailable = target["retired_at"] is not None or target["roadmap_status"] != "published"
    if unavailable and not (old and old["status"] == "learning" and body.status != "learning"):
        raise APIError(
            409,
            "content_unavailable",
            "Only an existing Learning topic can be resolved after retirement.",
        )
    if old and old["status"] == body.status:
        return {
            key: old[key] for key in ("roadmap_id", "topic_id", "status", "version", "updated_at")
        }
    if body.status == "learning" and await one(
        connection,
        (
            "SELECT topic_id FROM asgard_private.topic_progress WHERE user_id = "
            "CAST(:uid AS uuid) AND status = 'learning' AND topic_id <> CAST(:topic"
            " AS uuid)"
        ),
        parameters,
    ):
        raise APIError(
            409,
            "learning_resolution_required",
            "Resolve the other Learning topic before starting this one.",
        )
    if old:
        saved = await one(
            connection,
            (
                "UPDATE asgard_private.topic_progress SET status = :status, version = "
                "version + 1, updated_at = statement_timestamp() WHERE user_id = "
                "CAST(:uid AS uuid) AND roadmap_id = CAST(:roadmap AS uuid) AND "
                "topic_id = CAST(:topic AS uuid) RETURNING roadmap_id, topic_id, "
                "status, version, updated_at"
            ),
            parameters,
        )
    else:
        saved = await one(
            connection,
            (
                "INSERT INTO asgard_private.topic_progress (user_id, roadmap_id, "
                "topic_id, status) VALUES (CAST(:uid AS uuid), CAST(:roadmap AS uuid), "
                "CAST(:topic AS uuid), :status) RETURNING roadmap_id, topic_id, status,"
                " version, updated_at"
            ),
            parameters,
        )
    await connection.execute(
        text(

                "INSERT INTO asgard_private.progress_events (user_id, roadmap_id, "
                "topic_id, from_status, to_status) VALUES (CAST(:uid AS uuid), "
                "CAST(:roadmap AS uuid), CAST(:topic AS uuid), :before, :status)"

        ),
        parameters | {"before": old["status"] if old else "not_started"},
    )
    if old and old["status"] == "done":
        await connection.execute(
            text(

                    "DELETE FROM asgard_private.completion_activity WHERE user_id = "
                    "CAST(:uid AS uuid) AND roadmap_id = CAST(:roadmap AS uuid) AND "
                    "topic_id = CAST(:topic AS uuid)"

            ),
            parameters,
        )
    if body.status == "done":
        pref = await preferences(connection, uid)
        await connection.execute(
            text(

                    "INSERT INTO asgard_private.completion_activity (user_id, roadmap_id, "
                    "topic_id, local_date, timezone) VALUES (CAST(:uid AS uuid), "
                    "CAST(:roadmap AS uuid), CAST(:topic AS uuid), (statement_timestamp() "
                    "AT TIME ZONE :timezone)::date, :timezone) ON CONFLICT DO NOTHING"

            ),
            parameters | {"timezone": pref["timezone"]},
        )
    return saved


async def branches(connection, uid, roadmap_id):
    required(
        await one(
            connection,
            "SELECT id FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid)",
            {"id": str(roadmap_id)},
        )
    )
    return await rows(
        connection,
        (
            "SELECT roadmap_id, group_id, branch_id, version FROM "
            "asgard_private.branch_choices WHERE user_id = CAST(:uid AS uuid) AND "
            "roadmap_id = CAST(:id AS uuid) ORDER BY group_id"
        ),
        {"uid": str(uid), "id": str(roadmap_id)},
    )


async def save_branch(connection, uid, roadmap_id, group_id, body):
    await lock_account(connection, uid)
    parameters = {
        "uid": str(uid),
        "roadmap": str(roadmap_id),
        "group": str(group_id),
        "branch": str(body.branch_id),
        "version": body.expected_version,
    }
    required(
        await one(
            connection,
            (
                "SELECT b.id FROM asgard_catalog.branches b JOIN "
                "asgard_catalog.roadmaps r ON r.id = b.roadmap_id WHERE b.roadmap_id = "
                "CAST(:roadmap AS uuid) AND b.group_id = CAST(:group AS uuid) AND b.id "
                "= CAST(:branch AS uuid) AND r.status = 'published'"
            ),
            parameters,
        )
    )
    old = await one(
        connection,
        (
            "SELECT * FROM asgard_private.branch_choices WHERE user_id = CAST(:uid "
            "AS uuid) AND group_id = CAST(:group AS uuid) FOR UPDATE"
        ),
        parameters,
    )
    if (old["version"] if old else 0) != body.expected_version:
        conflict()
    if old and old["branch_id"] == body.branch_id:
        return {key: old[key] for key in ("roadmap_id", "group_id", "branch_id", "version")}
    if old:
        return await one(
            connection,
            (
                "UPDATE asgard_private.branch_choices SET branch_id = CAST(:branch AS "
                "uuid), version = version + 1 WHERE user_id = CAST(:uid AS uuid) AND "
                "group_id = CAST(:group AS uuid) RETURNING roadmap_id, group_id, "
                "branch_id, version"
            ),
            parameters,
        )
    return await one(
        connection,
        (
            "INSERT INTO asgard_private.branch_choices (user_id, roadmap_id, "
            "group_id, branch_id) VALUES (CAST(:uid AS uuid), CAST(:roadmap AS "
            "uuid), CAST(:group AS uuid), CAST(:branch AS uuid)) RETURNING "
            "roadmap_id, group_id, branch_id, version"
        ),
        parameters,
    )


async def summary(connection, uid, roadmap_id):
    contents, saved, selected = await summary_data(connection, uid, [roadmap_id])
    content = contents[roadmap_id]
    states = {row["topic_id"]: row for row in saved}
    choices = {row["branch_id"] for row in selected}
    return calculate_summary(content, states, choices, roadmap_id)


def calculate_summary(content, states, choices, roadmap_id):
    items, applicable, pending = [], [], False
    for milestone in content["milestones"]:
        if milestone["retired_at"] is not None:
            continue
        missing = any(
            not any(branch["id"] in choices for branch in group["branches"])
            for group in milestone["branch_groups"]
        )
        pending = pending or missing
        common = [
            topic
            for topic in milestone["topics"]
            if topic["retired_at"] is None and topic["branch_id"] is None
        ]
        topics = [
            topic
            for topic in milestone["topics"]
            if topic["retired_at"] is None
            and (topic["branch_id"] is None or topic["branch_id"] in choices)
        ]
        done = sum(states.get(topic["id"], {}).get("status") == "done" for topic in topics)
        items.append(
            {
                "milestone_id": milestone["id"],
                "done": done,
                "applicable": len(topics),
                "common_done": sum(
                    states.get(topic["id"], {}).get("status") == "done" for topic in common
                ),
                "common_total": len(common),
                "requires_branch_choice": missing,
                "percentage": None if missing or not topics else round(100 * done / len(topics), 2),
            }
        )
        applicable.extend(topics)
    available = [
        topic
        for topic in applicable
        if states.get(topic["id"], {}).get("status", "not_started") not in ("done", "skipped")
    ]
    active = [
        topic for topic in available if states.get(topic["id"], {}).get("status") == "learning"
    ]
    total = len(applicable)
    done_count = sum(states.get(topic["id"], {}).get("status") == "done" for topic in applicable)
    if pending:
        state = "branch_required"
    elif not total:
        state = "empty"
    elif done_count == total:
        state = "completed"
    elif not available:
        state = "review_skipped"
    else:
        state = "in_progress"
    return {
        "roadmap_id": roadmap_id,
        "milestones": items,
        "done": done_count,
        "applicable": total,
        "requires_branch_choice": pending,
        "percentage": None if pending or not total else round(100 * done_count / total, 2),
        "state": state,
        "fully_done": bool(applicable)
        and not pending
        and all(states.get(topic["id"], {}).get("status") == "done" for topic in applicable),
        "no_remaining_suggestions": bool(applicable) and not pending and not available,
        "next_topic_ids": [topic["id"] for topic in (active or available)[:1]],
        "content_updated": content["revision"] > 1
        or any(
            milestone["retired_at"] is not None
            or any(
                topic["revision"] > 1 or topic["retired_at"] is not None
                for topic in milestone["topics"]
            )
            for milestone in content["milestones"]
        ),
    }


async def activity(connection, uid, month):
    try:
        start = date.fromisoformat(month + "-01")
        end = (start.replace(day=28) + timedelta(days=4)).replace(day=1)
    except (ValueError, OverflowError) as exc:
        raise APIError(422, "invalid_month", "Choose a supported calendar month.") from exc
    parameters = {"uid": str(uid), "start": start, "end": end}
    days = await rows(
        connection,
        (
            "SELECT local_date, count(*) AS done_count FROM "
            "asgard_private.completion_activity WHERE user_id = CAST(:uid AS uuid) "
            "AND local_date >= :start AND local_date < :end GROUP BY local_date "
            "ORDER BY local_date"
        ),
        parameters,
    )
    dates = {
        row["local_date"]
        for row in await rows(
            connection,
            (
                "SELECT DISTINCT local_date FROM asgard_private.completion_activity "
                "WHERE user_id = CAST(:uid AS uuid)"
            ),
            parameters,
        )
    }
    pref = await preferences(connection, uid)
    today = datetime.now(UTC).astimezone(ZoneInfo(pref["timezone"])).date()
    cursor = today if today in dates else today - timedelta(days=1)
    streak = 0
    while cursor in dates:
        streak += 1
        cursor -= timedelta(days=1)
    return {"month": month, "days": days, "streak_days": streak}


async def active_topic(connection, uid):
    return await one(
        connection,
        (
            "SELECT roadmap_id, topic_id, status, version, updated_at FROM "
            "asgard_private.topic_progress WHERE user_id = CAST(:uid AS uuid) AND "
            "status = 'learning'"
        ),
        {"uid": str(uid)},
    )


async def core_milestone(connection, calculated, active):
    next_ids = calculated["next_topic_ids"]
    milestones = calculated["milestones"]
    missing_branch = next((item for item in milestones if item["requires_branch_choice"]), None)
    core = None
    if next_ids:
        topic = await one(
            connection,
            "SELECT milestone_id FROM asgard_catalog.topics WHERE id = CAST(:id AS uuid)",
            {"id": str(next_ids[0])},
        )
        core = topic["milestone_id"] if topic else None
    active_applies = active and active["roadmap_id"] == calculated["roadmap_id"] and (
        active["topic_id"] in next_ids
    )
    if missing_branch and not active_applies:
        ids = [item["milestone_id"] for item in milestones]
        if core not in ids or ids.index(missing_branch["milestone_id"]) < ids.index(core):
            return missing_branch["milestone_id"]
    return core if core is not None or not milestones else milestones[-1]["milestone_id"]


async def dashboard(connection, uid):
    state = await learning(connection, uid)
    parameters = {"uid": str(uid)}
    pref = await preferences(connection, uid)
    active = await active_topic(connection, uid)
    draft = await one(
        connection,
        (
            "SELECT id FROM asgard_private.discovery_sessions WHERE user_id = "
            "CAST(:uid AS uuid) AND status = 'draft'"
        ),
        parameters,
    )
    profile = await one(
        connection,
        "SELECT first_name FROM asgard_private.profiles WHERE user_id = CAST(:uid AS uuid)",
        parameters,
    )
    completed = await one(
        connection,
        (
            "SELECT id FROM asgard_private.discovery_sessions WHERE user_id = "
            "CAST(:uid AS uuid) AND status = 'completed' LIMIT 1"
        ),
        parameters,
    )
    guidance_candidates = [
        ("resume_discovery", bool(draft)),
        ("basic_profile", not profile or not profile["first_name"].strip()),
        ("start_discovery", not completed and not draft),
    ]
    guidance = next(
        (
            key
            for key, eligible in guidance_candidates
            if eligible and key not in pref["dismissed_guidance"]
        ),
        None,
    )
    calculated, core = None, None
    if state["current_roadmap_id"]:
        calculated = await summary(connection, uid, state["current_roadmap_id"])
        core = await core_milestone(connection, calculated, active)
    recent = await rows(
        connection,
        (
            "SELECT roadmap_id, topic_id, status, version, updated_at FROM "
            "asgard_private.topic_progress WHERE user_id = CAST(:uid AS uuid) AND "
            "status = 'done' ORDER BY updated_at DESC, topic_id LIMIT 10"
        ),
        parameters,
    )
    recommendation = await one(
        connection,
        (
            "SELECT r.id FROM asgard_private.recommendation_runs r WHERE r.user_id "
            "= CAST(:uid AS uuid) AND r.status = 'completed' AND NOT EXISTS (SELECT"
            " 1 FROM asgard_private.recommendation_items i JOIN "
            "asgard_catalog.careers c ON c.id = i.career_id WHERE i.run_id = r.id "
            "AND c.status <> 'published') ORDER BY r.created_at DESC, r.id DESC "
            "LIMIT 1"
        ),
        parameters,
    )
    return {
        "learning_state": state,
        "active_topic": active,
        "core_milestone_id": core,
        "progress": calculated,
        "recent_done": recent,
        "recommendation_run_id": recommendation["id"] if recommendation else None,
        "discovery_draft_id": draft["id"] if draft else None,
        "guidance_id": guidance,
    }


async def summary_data(connection, uid, roadmap_ids):
    ids = list(dict.fromkeys(roadmap_ids))
    params = {"ids": ids, "uid": str(uid)}
    contents = await rows(connection,
        "SELECT id, revision FROM asgard_catalog.roadmaps WHERE id = ANY(:ids)", params)
    if len(contents) != len(ids):
        raise APIError(404, "not_found", "This item is unavailable.")
    milestones = await rows(connection,
        "SELECT id, roadmap_id, retired_at FROM asgard_catalog.milestones "
        "WHERE roadmap_id = ANY(:ids) ORDER BY position, id", params)
    topics = await rows(connection,
        "SELECT id, roadmap_id, milestone_id, branch_id, revision, retired_at "
        "FROM asgard_catalog.topics WHERE roadmap_id = ANY(:ids) ORDER BY position, id", params)
    groups = await rows(connection,
        "SELECT g.id, g.milestone_id FROM asgard_catalog.branch_groups g "
        "JOIN asgard_catalog.milestones m ON m.id=g.milestone_id "
        "WHERE m.roadmap_id = ANY(:ids) ORDER BY g.position, g.id", params)
    branch_rows = await rows(connection,
        "SELECT b.id, b.group_id FROM asgard_catalog.branches b "
        "JOIN asgard_catalog.branch_groups g ON g.id=b.group_id "
        "JOIN asgard_catalog.milestones m ON m.id=g.milestone_id "
        "WHERE m.roadmap_id = ANY(:ids) ORDER BY b.position, b.id", params)
    states = await rows(connection,
        "SELECT roadmap_id, topic_id, status, version, updated_at "
        "FROM asgard_private.topic_progress WHERE user_id=CAST(:uid AS uuid) "
        "AND roadmap_id = ANY(:ids) ORDER BY topic_id", params)
    choices = await rows(connection,
        "SELECT roadmap_id, group_id, branch_id, version "
        "FROM asgard_private.branch_choices WHERE user_id=CAST(:uid AS uuid) "
        "AND roadmap_id = ANY(:ids) ORDER BY group_id", params)
    by_id = {item["id"]: item | {"milestones": []} for item in contents}
    by_milestone = {item["id"]: item | {"topics": [], "branch_groups": []}
                    for item in milestones}
    by_group = {item["id"]: item | {"branches": []} for item in groups}
    for item in by_milestone.values():
        by_id[item["roadmap_id"]]["milestones"].append(item)
    for item in topics:
        by_milestone[item["milestone_id"]]["topics"].append(item)
    for item in by_group.values():
        by_milestone[item["milestone_id"]]["branch_groups"].append(item)
    for item in branch_rows:
        by_group[item["group_id"]]["branches"].append(item)
    return by_id, states, choices


async def catalog_progress(connection, uid, roadmap_ids):
    contents, states, choices = await summary_data(connection, uid, roadmap_ids)
    result = []
    for rid in dict.fromkeys(roadmap_ids):
        saved = {item["topic_id"]: item for item in states if item["roadmap_id"] == rid}
        selected = {item["branch_id"] for item in choices if item["roadmap_id"] == rid}
        value = calculate_summary(contents[rid], saved, selected, rid)
        result.append({"roadmap_id": rid, "has_progress": bool(saved),
                       "percentage": value["percentage"],
                       "requires_branch_choice": value["requires_branch_choice"]})
    return result


async def roadmap_view(connection, uid, roadmap_id):
    content = await roadmap(connection, roadmap_id)
    saved = await progress(connection, uid, roadmap_id)
    selected = await branches(connection, uid, roadmap_id)
    value = calculate_summary(content, {item["topic_id"]: item for item in saved},
                              {item["branch_id"] for item in selected}, roadmap_id)
    return {"roadmap": content, "progress": saved, "summary": value,
            "branches": selected, "learning_state": await learning(connection, uid)}
