import asyncio
import json
from datetime import UTC, datetime
from uuid import uuid4

from sqlalchemy import text

from app.core.errors import APIError
from app.modules.documents import provider
from app.modules.documents.schemas import DocumentState
from app.modules.storage import lock_account, one, required, rows, transaction


def configured(settings):
    return settings.documents_enabled and bool(settings.storage_service_key.get_secret_value())


async def head(connection, uid):
    await lock_account(connection, uid)
    await connection.execute(
        text(
            "INSERT INTO asgard_private.document_state(user_id) VALUES (CAST(:uid "
            "AS uuid)) ON CONFLICT DO NOTHING"
        ),
        {"uid": str(uid)},
    )
    return await one(
        connection,
        (
            "SELECT revision FROM asgard_private.document_state WHERE "
            "user_id=CAST(:uid AS uuid) FOR UPDATE"
        ),
        {"uid": str(uid)},
    )


async def bump(connection, uid):
    await connection.execute(
        text(
            "UPDATE asgard_private.document_state SET revision=revision+1 WHERE "
            "user_id=CAST(:uid AS uuid)"
        ),
        {"uid": str(uid)},
    )


async def expire(connection, uid):
    changed = await rows(
        connection,
        (
            "UPDATE asgard_private.documents SET status='failed', "
            "failure_code='timeout', evidence='[]', "
            "purge_due_at=statement_timestamp() WHERE user_id=CAST(:uid AS uuid) "
            "AND status IN ('uploading','analyzing') AND deadline_at <= "
            "statement_timestamp() RETURNING id"
        ),
        {"uid": str(uid)},
    )
    if changed:
        await bump(connection, uid)


async def state(connection, uid, settings):
    current = await head(connection, uid)
    await expire(connection, uid)
    documents = await rows(
        connection,
        (
            "SELECT "
            "id,status,revision,failure_code,created_at,evidence,purge_due_at,purged_at"
            " FROM asgard_private.documents WHERE user_id=CAST(:uid AS uuid) ORDER "
            "BY created_at DESC,id DESC"
        ),
        {"uid": str(uid)},
    )
    current = await one(
        connection,
        "SELECT revision FROM asgard_private.document_state WHERE user_id=CAST(:uid AS uuid)",
        {"uid": str(uid)},
    )

    def find(statuses):
        item = next((item for item in documents if item["status"] in statuses), None)
        return (
            {key: value for key, value in item.items() if key not in ("purge_due_at", "purged_at")}
            if item
            else None
        )

    return DocumentState(
        revision=current["revision"],
        active=find({"active"}),
        candidate=find({"uploaded", "uploading", "analyzing"}),
        latest_failure=find({"failed"}),
        available=configured(settings),
        synthetic_only=not settings.documents_real_data_approved,
        cleanup_pending=sum(
            item["purge_due_at"] is not None and item["purged_at"] is None for item in documents
        ),
    )


def check(current, expected):
    if current["revision"] != expected:
        raise APIError(409, "document_changed", "Document state changed. Reload before retrying.")


async def object_request(request, method, key, data=None):
    settings = request.app.state.settings
    if not configured(settings):
        raise APIError(503, "documents_unavailable", "Private document storage is not configured.")
    response = await request.app.state.http.request(
        method,
        settings.supabase_url.rstrip("/") + "/storage/v1/object/asgard-documents/" + key,
        headers={
            "Authorization": "Bearer " + settings.storage_service_key.get_secret_value(),
            "Content-Type": "application/pdf",
        },
        content=data,
        timeout=20,
    )
    if response.status_code == 404 and method == "DELETE":
        return response
    if not response.is_success:
        raise APIError(
            503,
            "storage_unavailable",
            "Private document storage is unavailable. Retry the operation.",
        )
    return response


async def cleanup(request, identity):
    async with transaction(request, identity) as connection:
        await head(connection, identity.user_id)
        await expire(connection, identity.user_id)
        due = await rows(
            connection,
            (
                "SELECT id,object_key FROM asgard_private.documents WHERE "
                "user_id=CAST(:uid AS uuid) AND purge_due_at <= statement_timestamp() "
                "AND purged_at IS NULL LIMIT 20"
            ),
            {"uid": str(identity.user_id)},
        )
    for item in due:
        try:
            await object_request(request, "DELETE", item["object_key"])
        except Exception:
            # Persisted due-work remains available to the next cleanup pass.
            continue
        async with transaction(request, identity) as connection:
            await head(connection, identity.user_id)
            await connection.execute(
                text(
                    "UPDATE asgard_private.documents SET purged_at=statement_timestamp() "
                    "WHERE user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid) AND "
                    "purge_due_at IS NOT NULL"
                ),
                {"uid": str(identity.user_id), "id": str(item["id"])},
            )


async def upload(request, identity, expected, data):
    settings = request.app.state.settings
    if not configured(settings):
        raise APIError(503, "documents_unavailable", "Document processing is not enabled locally.")
    if not data.startswith(b"%PDF-") or len(data) > 10_000_000:
        raise APIError(422, "invalid_pdf", "Choose a PDF no larger than 10 MB.")
    uid = str(identity.user_id)
    doc = uuid4()
    key = uid + "/" + str(doc) + ".pdf"
    async with transaction(request, identity) as connection:
        check(await head(connection, uid), expected)
        await expire(connection, uid)
        pending = await one(
            connection,
            (
                "SELECT id FROM asgard_private.documents WHERE user_id=CAST(:uid AS "
                "uuid) AND status IN ('uploading','uploaded','analyzing')"
            ),
            {"uid": uid},
        )
        if pending:
            raise APIError(409, "candidate_exists", "Analyze or remove the pending document first.")
        await connection.execute(
            text(
                "INSERT INTO "
                "asgard_private.documents(id,user_id,object_key,status,deadline_at) "
                "VALUES(CAST(:id AS uuid),CAST(:uid AS "
                "uuid),:key,'uploading',statement_timestamp()+interval '120 seconds')"
            ),
            {"id": str(doc), "uid": uid, "key": key},
        )
        await bump(connection, uid)
    failure = False
    try:
        await object_request(request, "POST", key, data)
    except Exception:
        failure = True
    async with transaction(request, identity) as connection:
        await head(connection, uid)
        # Remove may have won while storage was receiving the object. Keep due work.
        await connection.execute(
            text(
                "UPDATE asgard_private.documents SET status=:status, "
                "failure_code=:failure, purge_due_at=CASE WHEN :failed THEN "
                "statement_timestamp() ELSE NULL END, deadline_at=NULL WHERE "
                "user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid) AND "
                "status='uploading'"
            ),
            {
                "uid": uid,
                "id": str(doc),
                "status": "failed" if failure else "uploaded",
                "failure": "storage_unavailable" if failure else None,
                "failed": failure,
            },
        )
        await connection.execute(
            text(
                "UPDATE asgard_private.documents SET purged_at=NULL WHERE "
                "user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid) AND status IN "
                "('removed','failed')"
            ),
            {"uid": uid, "id": str(doc)},
        )
        await bump(connection, uid)
    await cleanup(request, identity)
    async with transaction(request, identity) as connection:
        return await state(connection, uid, settings)


async def reserve(connection, uid, doc, key, attempt):
    counts = await one(
        connection,
        (
            "SELECT count(*) FILTER(WHERE "
            "reserved_at>statement_timestamp()-interval '1 hour') AS hourly, "
            "count(*) AS daily FROM asgard_private.analysis_attempts WHERE "
            "user_id=CAST(:uid AS uuid) AND operation='pdf_analysis' AND "
            "reserved_at>statement_timestamp()-interval '24 hours'"
        ),
        {"uid": str(uid)},
    )
    if counts["hourly"] >= 3 or counts["daily"] >= 5:
        raise APIError(
            429, "quota_exceeded", "PDF analysis allowance reached. Try later.", retry_after=3600
        )
    budget = await one(
        connection,
        (
            "INSERT INTO "
            "asgard_private.analysis_daily_budget(utc_date,reserved_attempts) "
            "VALUES((statement_timestamp() AT TIME ZONE 'UTC')::date,1) ON "
            "CONFLICT(utc_date) DO UPDATE SET "
            "reserved_attempts=asgard_private.analysis_daily_budget.reserved_attempts+1"
            " WHERE asgard_private.analysis_daily_budget.reserved_attempts<100 "
            "RETURNING reserved_attempts"
        ),
    )
    if not budget:
        raise APIError(
            429, "quota_exceeded", "Application analysis allowance reached.", retry_after=86400
        )
    await connection.execute(
        text(
            "INSERT INTO "
            "asgard_private.analysis_attempts(user_id,document_id,operation,attempt,reservation_key)"
            " VALUES(CAST(:uid AS uuid),CAST(:doc AS "
            "uuid),'pdf_analysis',:attempt,CAST(:key AS uuid))"
        ),
        {"uid": str(uid), "doc": str(doc), "attempt": attempt, "key": str(key)},
    )


async def analyze(request, identity, doc, body):
    settings = request.app.state.settings
    if (
        not configured(settings)
        or not settings.groq_enabled
        or not settings.groq_api_key.get_secret_value()
    ):
        raise APIError(
            503,
            "provider_unavailable",
            "PDF analysis needs private storage and Groq configuration.",
        )
    if not settings.documents_real_data_approved and not body.synthetic_document:
        raise APIError(
            422,
            "synthetic_only",
            "Only synthetic test documents are enabled until privacy activation is verified.",
        )
    uid = str(identity.user_id)
    async with transaction(request, identity) as connection:
        current = await head(connection, uid)
        await expire(connection, uid)
        saved = required(
            await one(
                connection,
                (
                    "SELECT * FROM asgard_private.documents WHERE user_id=CAST(:uid AS "
                    "uuid) AND id=CAST(:id AS uuid)"
                ),
                {"uid": uid, "id": str(doc)},
            )
        )
        if saved["analysis_key"] == body.idempotency_key:
            return await state(connection, uid, settings)
        check(current, body.expected_revision)
        if saved["status"] != "uploaded":
            raise APIError(409, "document_changed", "Upload a new candidate before analysis.")
        profile = await one(
            connection,
            "SELECT first_name, surname FROM asgard_private.profiles "
            "WHERE user_id=CAST(:uid AS uuid)",
            {"uid": uid},
        )
        known_names = (profile["first_name"], profile["surname"]) if profile else ()
        await reserve(connection, uid, doc, body.idempotency_key, 1)
        await connection.execute(
            text(
                "UPDATE asgard_private.documents SET "
                "status='analyzing',analysis_id=CAST(:analysis AS "
                "uuid),analysis_key=CAST(:key AS uuid), "
                "deadline_at=statement_timestamp()+interval '120 seconds' WHERE "
                "id=CAST(:id AS uuid) AND user_id=CAST(:uid AS uuid)"
            ),
            {
                "analysis": str(uuid4()),
                "key": str(body.idempotency_key),
                "id": str(doc),
                "uid": uid,
            },
        )
        await bump(connection, uid)

    async def retry():
        async with transaction(request, identity) as connection:
            await head(connection, uid)
            pending = await one(
                connection,
                (
                    "SELECT id FROM asgard_private.documents WHERE user_id=CAST(:uid AS "
                    "uuid) AND id=CAST(:id AS uuid) AND status='analyzing' AND "
                    "deadline_at>statement_timestamp()"
                ),
                {"uid": uid, "id": str(doc)},
            )
            if not pending:
                raise APIError(409, "document_changed", "Document was removed or expired.")
            await reserve(connection, uid, doc, uuid4(), 2)

    failure = None
    evidence = []
    try:
        async with asyncio.timeout(120):
            response = await object_request(request, "GET", saved["object_key"])
            pages = provider.redact(await provider.parse(response.content), known_names)
            result = await provider.extract(request.app.state.http, settings, pages, retry)
            evidence = result.model_dump(mode="json")["items"]
    except TimeoutError:
        failure = "timeout"
    except APIError as error:
        failure = error.code
    except (ValueError, KeyError, IndexError, TypeError):
        failure = "invalid_evidence"
    except Exception:
        failure = "analysis_unavailable"
    async with transaction(request, identity) as connection:
        await head(connection, uid)
        pending = required(
            await one(
                connection,
                (
                    "SELECT status,deadline_at FROM asgard_private.documents WHERE "
                    "user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid)"
                ),
                {"uid": uid, "id": str(doc)},
            )
        )
        if pending["status"] == "analyzing":
            if pending["deadline_at"] <= datetime.now(UTC):
                failure = "timeout"
            if not failure:
                await invalidate(connection, uid, removal=False)
            await connection.execute(
                text(
                    "UPDATE asgard_private.documents SET "
                    "status=:status,evidence=CAST(:evidence AS "
                    "jsonb),failure_code=:failure,purge_due_at=CASE WHEN :failed THEN "
                    "statement_timestamp() ELSE NULL END WHERE user_id=CAST(:uid AS uuid) "
                    "AND id=CAST(:id AS uuid)"
                ),
                {
                    "status": "failed" if failure else "active",
                    "evidence": json.dumps(evidence if not failure else []),
                    "failure": failure,
                    "failed": bool(failure),
                    "uid": uid,
                    "id": str(doc),
                },
            )
            await bump(connection, uid)
    await cleanup(request, identity)
    async with transaction(request, identity) as connection:
        return await state(connection, uid, settings)


async def invalidate(connection, uid, removal):
    await connection.execute(
        text(
            "UPDATE asgard_private.documents SET "
            "status='removed',evidence='[]',purge_due_at=statement_timestamp() "
            "WHERE user_id=CAST(:uid AS uuid) AND status='active'"
        ),
        {"uid": str(uid)},
    )
    if removal:
        # Suppress all document-derived payloads, including old replacement snapshots.
        await connection.execute(
            text(
                "DELETE FROM asgard_private.recommendation_items WHERE "
                "user_id=CAST(:uid AS uuid) AND run_id IN (SELECT id FROM "
                "asgard_private.recommendation_runs WHERE user_id=CAST(:uid AS uuid) "
                "AND context_snapshot->'context'->>'document' IS NOT NULL)"
            ),
            {"uid": str(uid)},
        )
        await connection.execute(
            text(
                "UPDATE asgard_private.recommendation_runs SET "
                "status='failed',failure_code='context_outdated',context_snapshot=jsonb_set(context_snapshot,'{context}',"
                " '{}'::jsonb),finished_at=statement_timestamp() WHERE "
                "user_id=CAST(:uid AS uuid) AND "
                "context_snapshot->'context'->>'document' IS NOT NULL"
            ),
            {"uid": str(uid)},
        )
    await connection.execute(
        text(
            "UPDATE asgard_private.learning_state SET "
            "context_revision=context_revision+1 WHERE user_id=CAST(:uid AS uuid)"
        ),
        {"uid": str(uid)},
    )


async def remove(request, identity, expected):
    async with transaction(request, identity) as connection:
        check(await head(connection, identity.user_id), expected)
        await invalidate(connection, identity.user_id, removal=True)
        await connection.execute(
            text(
                "UPDATE asgard_private.documents SET "
                "status='removed',evidence='[]',purge_due_at=coalesce(purge_due_at,statement_timestamp())"
                " WHERE user_id=CAST(:uid AS uuid) AND status<>'removed'"
            ),
            {"uid": str(identity.user_id)},
        )
        await bump(connection, identity.user_id)
    await cleanup(request, identity)
    async with transaction(request, identity) as connection:
        return await state(connection, identity.user_id, request.app.state.settings)
