from sqlalchemy import text

from app.core.errors import APIError
from app.modules.discovery.definition import (
    QUESTIONNAIRE_V2_ID,
    active_route,
    definition,
    validate_answer,
)
from app.modules.discovery.schemas import DiscoverySession
from app.modules.storage import lock_account, one, required, rows


async def questionnaire(connection, questionnaire_id=None):
    if questionnaire_id is None:
        published_v2 = await one(
            connection,
            "SELECT id FROM asgard_catalog.questionnaires "
            "WHERE id = CAST(:id AS uuid) AND published_at IS NOT NULL",
            {"id": str(QUESTIONNAIRE_V2_ID)},
        )
        if published_v2:
            questionnaire_id = QUESTIONNAIRE_V2_ID
    authored = definition(questionnaire_id)
    published = await one(
        connection,
        (
            "SELECT id, version FROM asgard_catalog.questionnaires WHERE id = "
            "CAST(:id AS uuid) AND published_at IS NOT NULL"
        ),
        {"id": str(authored.id)},
    )
    registry = await rows(
        connection,
        (
            "SELECT id, position FROM asgard_catalog.questions WHERE "
            "questionnaire_id = CAST(:id AS uuid) ORDER BY position"
        ),
        {"id": str(authored.id)},
    )
    expected = [{"id": item.question_id, "position": item.position} for item in authored.questions]
    if not published or published["version"] != authored.version or registry != expected:
        raise APIError(
            503, "questionnaire_unpublished", "Discovery questions are awaiting local publication."
        )
    return authored


async def session(connection, uid, session_id, *, locked=False):
    saved = required(
        await one(
            connection,
            (
                "SELECT id, questionnaire_id, source_session_id, status, revision, "
                "created_at, completed_at FROM asgard_private.discovery_sessions WHERE "
                "user_id = CAST(:uid AS uuid) AND id = CAST(:id AS uuid)"
            )
            + (" FOR UPDATE" if locked else " FOR SHARE"),
            {"uid": str(uid), "id": str(session_id)},
        )
    )
    authored = await questionnaire(connection, saved["questionnaire_id"])
    answers = await rows(
        connection,
        (
            "SELECT a.question_id, a.option_ids FROM "
            "asgard_private.discovery_answers a JOIN asgard_catalog.questions q ON "
            "q.questionnaire_id = a.questionnaire_id AND q.id = a.question_id WHERE"
            " a.user_id = CAST(:uid AS uuid) AND a.session_id = CAST(:id AS uuid) "
            "ORDER BY q.position"
        ),
        {"uid": str(uid), "id": str(session_id)},
    )
    by_id = {item["question_id"]: item["option_ids"] for item in answers}
    route = active_route(by_id, authored.version)
    questions = {item.question_id: item for item in authored.questions}
    for key, selected in by_id.items():
        validate_answer(questions[key], selected)
    return DiscoverySession(
        **saved,
        answers=answers,
        active_question_ids=route,
        next_question_id=next((key for key in route if key not in by_id), None),
    )


async def state(connection, uid):
    result = {}
    for name, status in (("draft", "draft"), ("latest_completed", "completed")):
        row = await one(
            connection,
            (
                "SELECT id FROM asgard_private.discovery_sessions WHERE user_id = "
                "CAST(:uid AS uuid) AND status = :status ORDER BY completed_at DESC "
                "NULLS LAST, created_at DESC, id DESC LIMIT 1"
            ),
            {"uid": str(uid), "status": status},
        )
        result[name] = await session(connection, uid, row["id"]) if row else None
    return result


async def latest_completed_identity(connection, uid):
    return await one(
        connection,
        "SELECT id, revision, questionnaire_id FROM asgard_private.discovery_sessions "
        "WHERE user_id = CAST(:uid AS uuid) AND status = 'completed' "
        "ORDER BY completed_at DESC NULLS LAST, created_at DESC, id DESC LIMIT 1",
        {"uid": str(uid)},
    )


async def start(connection, uid, questionnaire_id):
    await lock_account(connection, uid)
    draft = await one(
        connection,
        (
            "SELECT id, questionnaire_id FROM asgard_private.discovery_sessions "
            "WHERE user_id = CAST(:uid AS uuid) AND status = 'draft'"
        ),
        {"uid": str(uid)},
    )
    if draft:
        if draft["questionnaire_id"] != questionnaire_id:
            raise APIError(
                409,
                "discovery_conflict",
                "Resume your existing Discovery draft before starting another version.",
            )
        return await session(connection, uid, draft["id"])
    authored = await questionnaire(connection)
    if authored.id != questionnaire_id:
        raise APIError(
            409,
            "discovery_conflict",
            "A newer questionnaire is available. Reload Discovery to start.",
        )
    saved = await one(
        connection,
        (
            "INSERT INTO asgard_private.discovery_sessions (user_id, "
            "questionnaire_id) VALUES (CAST(:uid AS uuid), CAST(:qid AS uuid)) "
            "RETURNING id"
        ),
        {"uid": str(uid), "qid": str(questionnaire_id)},
    )
    return await session(connection, uid, saved["id"])


async def checkpoint(connection, uid, session_id, body):
    await lock_account(connection, uid)
    saved = await session(connection, uid, session_id, locked=True)
    if saved.status != "draft" or saved.revision != body.expected_version:
        raise APIError(
            409,
            "discovery_conflict",
            "Your answers changed elsewhere. Reload the saved answers before continuing.",
        )
    authored = await questionnaire(connection, saved.questionnaire_id)
    questions = {item.question_id: item for item in authored.questions}
    merged = {item.question_id: item.option_ids for item in saved.answers}
    for answer in body.answers:
        question = questions.get(answer.question_id)
        if question is None:
            raise APIError(
                422, "invalid_answer", "This question is not part of the saved questionnaire."
            )
        validate_answer(question, answer.option_ids)
        merged[answer.question_id] = answer.option_ids
    route = active_route(merged, authored.version)
    if any(answer.question_id not in route for answer in body.answers):
        raise APIError(
            409,
            "discovery_route_changed",
            "This question is no longer on your active route. Reload saved answers.",
        )
    changed = any(
        merged[item.question_id]
        != next(
            (old.option_ids for old in saved.answers if old.question_id == item.question_id), None
        )
        for item in body.answers
    )
    if not changed:
        return saved
    for answer in body.answers:
        await connection.execute(
            text(

                    "INSERT INTO asgard_private.discovery_answers (user_id, session_id, "
                    "questionnaire_id, question_id, option_ids) VALUES (CAST(:uid AS uuid),"
                    " CAST(:sid AS uuid), CAST(:qid AS uuid), :question, :options) ON "
                    "CONFLICT (session_id, question_id) DO UPDATE SET option_ids = "
                    "EXCLUDED.option_ids"

            ),
            {
                "uid": str(uid),
                "sid": str(session_id),
                "qid": str(saved.questionnaire_id),
                "question": answer.question_id,
                "options": answer.option_ids,
            },
        )
    await connection.execute(
        text(

                "UPDATE asgard_private.discovery_sessions SET revision = revision + 1 "
                "WHERE user_id = CAST(:uid AS uuid) AND id = CAST(:sid AS uuid)"

        ),
        {"uid": str(uid), "sid": str(session_id)},
    )
    return await session(connection, uid, session_id)


async def complete(connection, uid, session_id, body):
    await lock_account(connection, uid)
    saved = await session(connection, uid, session_id, locked=True)
    if saved.revision != body.expected_revision:
        raise APIError(
            409,
            "discovery_conflict",
            "Reload the latest saved answers before completing Discovery.",
        )
    if saved.status == "completed":
        return saved
    if saved.next_question_id:
        raise APIError(
            422,
            "discovery_incomplete",
            "Answer every question on your current route before completing Discovery.",
        )
    await connection.execute(
        text(

                "UPDATE asgard_private.discovery_sessions SET status = 'completed', "
                "completed_at = statement_timestamp() WHERE user_id = CAST(:uid AS "
                "uuid) AND id = CAST(:id AS uuid)"

        ),
        {"uid": str(uid), "id": str(session_id)},
    )
    return await session(connection, uid, session_id)


async def retake(connection, uid, body):
    await lock_account(connection, uid)
    source = await session(connection, uid, body.source_session_id, locked=True)
    if source.status != "completed" or source.revision != body.expected_revision:
        raise APIError(
            409,
            "discovery_conflict",
            "Choose the saved completed Discovery before starting a retake.",
        )
    draft = await one(
        connection,
        (
            "SELECT id, source_session_id FROM asgard_private.discovery_sessions "
            "WHERE user_id = CAST(:uid AS uuid) AND status = 'draft'"
        ),
        {"uid": str(uid)},
    )
    if draft:
        if draft["source_session_id"] != source.id:
            raise APIError(
                409,
                "discovery_conflict",
                "You already have an unfinished Discovery. Resume that draft first.",
            )
        return await session(connection, uid, draft["id"])
    authored = await questionnaire(connection)
    new = await one(
        connection,
        (
            "INSERT INTO asgard_private.discovery_sessions (user_id, "
            "questionnaire_id, source_session_id) VALUES (CAST(:uid AS uuid), "
            "CAST(:qid AS uuid), CAST(:source AS uuid)) RETURNING id"
        ),
        {"uid": str(uid), "qid": str(authored.id), "source": str(source.id)},
    )
    return await session(connection, uid, new["id"])
