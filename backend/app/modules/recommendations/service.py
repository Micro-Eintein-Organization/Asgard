import json
import re
from datetime import UTC, datetime
from uuid import uuid4

from pydantic import TypeAdapter
from sqlalchemy import text

from app.core.errors import APIError
from app.modules.discovery import service as discovery
from app.modules.discovery.definition import definition
from app.modules.recommendations import occupational_runtime
from app.modules.recommendations.provider import (
    PROMPT_VERSION,
    SCHEMA_VERSION,
    ProviderFailure,
    diagnostic,
    generate,
)
from app.modules.recommendations.schemas import (
    CompletedDiscoveryReference,
    ContextFact,
    DocumentContextReference,
    PublishedCareerReference,
    RecommendationContext,
    RecommendationContextV2,
    RecommendationRun,
    RequestRecommendations,
    SavedRecommendationContext,
    validate_recommendations,
)
from app.modules.recommendations.selection import (
    SelectionFailure,
    resolve_selection,
)
from app.modules.storage import lock_account, one, required, rows, transaction

PROHIBITED = re.compile(
    r"\d\s*%|\b(?:mastered|proficient|expert|best fit|perfect fit|job.ready|guaranteed)\b", re.I
)


async def release_id(connection):
    release = await one(
        connection, "SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1"
    )
    return release["id"] if release else None


async def expire(connection, uid):
    await connection.execute(
        text(
            "UPDATE asgard_private.recommendation_runs SET status = 'failed', "
            "failure_code = 'timeout', finished_at = statement_timestamp() WHERE "
            "user_id = CAST(:uid AS uuid) AND status = 'pending' AND deadline_at <="
            " statement_timestamp()"
        ),
        {"uid": str(uid)},
    )


async def eligible(connection, uid, run_id):
    invalid = await one(
        connection,
        (
            "SELECT i.career_id FROM asgard_private.recommendation_items i JOIN "
            "asgard_catalog.careers c ON c.id = i.career_id LEFT JOIN "
            "asgard_catalog.roadmaps r ON r.id = i.roadmap_id LEFT JOIN "
            "asgard_catalog.topics t ON t.id = i.starting_topic_id WHERE i.user_id "
            "= CAST(:uid AS uuid) AND i.run_id = CAST(:id AS uuid) AND (c.status <>"
            " 'published' OR (i.roadmap_id IS NOT NULL AND r.status <> 'published')"
            " OR (i.starting_topic_id IS NOT NULL AND t.retired_at IS NOT NULL)) "
            "LIMIT 1"
        ),
        {"uid": str(uid), "id": str(run_id)},
    )
    return invalid is None


async def run(connection, uid, run_id, context_revision, catalog_release_id):
    saved = required(
        await one(
            connection,
            (
                "SELECT * FROM asgard_private.recommendation_runs WHERE user_id = "
                "CAST(:uid AS uuid) AND id = CAST(:id AS uuid)"
            ),
            {"uid": str(uid), "id": str(run_id)},
        )
    )
    if saved["status"] == "completed" and not await eligible(connection, uid, run_id):
        raise APIError(
            404,
            "recommendation_unavailable",
            "These suggestions refer to content that is no longer published.",
        )
    items = (
        await rows(
            connection,
            (
                "SELECT career_id, reason, evidence_fact_ids, uncertainty_note, "
                + ("source_reference_ids, " if "payload_erased_at" in saved else "")
                + "roadmap_id, starting_topic_id FROM asgard_private.recommendation_items"
                " WHERE user_id = CAST(:uid AS uuid) AND run_id = CAST(:id AS uuid) "
                "ORDER BY position"
            ),
            {"uid": str(uid), "id": str(run_id)},
        )
        if saved["status"] == "completed"
        else []
    )
    reference = (
        CompletedDiscoveryReference(
            session_id=saved["discovery_session_id"],
            revision=saved["discovery_revision"],
            questionnaire_id=saved["context_snapshot"]["context"]["discovery"]["questionnaire_id"],
        )
        if saved["discovery_session_id"]
        and saved["context_snapshot"].get("context", {}).get("discovery")
        else None
    )
    return RecommendationRun(
        **{
            key: saved[key]
            for key in (
                "id",
                "status",
                "context_revision",
                "catalog_release_id",
                "prompt_version",
                "schema_version",
                "model_id",
                "created_at",
                "finished_at",
                "failure_code",
            )
        },
        discovery=reference,
        items=items,
        source_references=saved["context_snapshot"].get("context", {}).get("source_references", []),
        coverage_limitations=saved["context_snapshot"]
        .get("context", {})
        .get("coverage_limitations", []),
        payload_erased_at=saved.get("payload_erased_at"),
        skill_profile_version=saved["context_snapshot"]
        .get("context", {})
        .get("skill_profile_version"),
        occupational_release_id=saved["context_snapshot"]
        .get("context", {})
        .get("occupational_release_id"),
        evidence=[
            fact
            for fact in saved["context_snapshot"].get("context", {}).get("facts", [])
            if fact["id"] in {key for item in items for key in item["evidence_fact_ids"]}
        ],
        outdated=(
            bool(saved.get("payload_erased_at"))
            or (
                saved["context_snapshot"].get("context", {}).get("schema_version") != "2"
                and await occupational_runtime.skills.privacy_ready(connection)
            )
            or (
                saved["context_snapshot"].get("context", {}).get("schema_version") == "2"
                and saved["context_snapshot"]["context"].get("occupational_release_id")
                != await occupational_runtime.reference_release(connection)
            )
            or saved["context_revision"] != context_revision
            or saved["catalog_release_id"] != catalog_release_id
            or saved["prompt_version"] != PROMPT_VERSION
            or saved["schema_version"] != SCHEMA_VERSION
        ),
    )


async def state(connection, uid, settings):
    learning = await lock_account(connection, uid)
    await expire(connection, uid)
    release = await release_id(connection)
    latest = await one(
        connection,
        (
            "SELECT id, status FROM asgard_private.recommendation_runs WHERE "
            "user_id = CAST(:uid AS uuid) ORDER BY created_at DESC, id DESC LIMIT 1"
        ),
        {"uid": str(uid)},
    )
    current, previous = None, None
    if latest and (
        latest["status"] != "completed" or await eligible(connection, uid, latest["id"])
    ):
        current = await run(connection, uid, latest["id"], learning["context_revision"], release)
    prior = await one(
        connection,
        (
            "SELECT r.id FROM asgard_private.recommendation_runs r WHERE r.user_id "
            "= CAST(:uid AS uuid) AND r.status = 'completed' AND (CAST(:current AS "
            "uuid) IS NULL OR r.id <> CAST(:current AS uuid)) AND NOT EXISTS "
            "(SELECT 1 FROM asgard_private.recommendation_items i JOIN "
            "asgard_catalog.careers c ON c.id = i.career_id LEFT JOIN "
            "asgard_catalog.roadmaps p ON p.id = i.roadmap_id LEFT JOIN "
            "asgard_catalog.topics t ON t.id = i.starting_topic_id WHERE i.user_id "
            "= CAST(:uid AS uuid) AND i.run_id = r.id AND (c.status <> 'published' "
            "OR (i.roadmap_id IS NOT NULL AND p.status <> 'published') OR "
            "(i.starting_topic_id IS NOT NULL AND t.retired_at IS NOT NULL))) ORDER"
            " BY r.created_at DESC, r.id DESC LIMIT 1"
        ),
        {"uid": str(uid), "current": str(current.id) if current else None},
    )
    if prior:
        previous = await run(connection, uid, prior["id"], learning["context_revision"], release)
    available = (
        settings.groq_enabled
        and bool(settings.groq_api_key.get_secret_value())
        and release is not None
    )
    return {
        "occupational_release_id": await occupational_runtime.reference_release(connection),
        "has_reported_skills": bool(
            await one(
                connection,
                "SELECT competency_id FROM asgard_private.user_competencies "
                "WHERE user_id=CAST(:uid AS uuid) LIMIT 1",
                {"uid": str(uid)},
            )
        )
        if await occupational_runtime.skills.privacy_ready(connection)
        else False,
        "current": current,
        "previous_eligible_success": previous,
        "context_revision": learning["context_revision"],
        "catalog_release_id": release,
        "available": available,
        "unavailable_reason": None
        if available
        else (
            "Career suggestions are currently unavailable. "
            "Your answers and learning saves remain available."
        ),
    }


async def get_run(request, identity, run_id):
    async with transaction(request, identity) as connection:
        learning = await lock_account(connection, identity.user_id)
        await expire(connection, identity.user_id)
        return await run(
            connection,
            identity.user_id,
            run_id,
            learning["context_revision"],
            await release_id(connection),
        )


async def snapshot(connection, uid, learning, release):
    saved = await discovery.state(connection, uid)
    completed = saved["latest_completed"]
    facts = []
    occupational, skill_facts = await occupational_runtime.context_additions(connection, uid)
    facts.extend(ContextFact.model_validate(fact) for fact in skill_facts)
    if completed:
        questions = {
            item.question_id: item for item in definition(completed.questionnaire_id).questions
        }
        for answer in completed.answers:
            if answer.question_id not in completed.active_question_ids:
                continue
            question = questions[answer.question_id]
            choices = {item.id: item for item in question.options}
            for selected in answer.option_ids:
                item = choices[selected]
                facts.append(
                    ContextFact(
                        id="discovery:" + question.question_id + ":" + selected,
                        source="discovery",
                        source_id=question.question_id,
                        source_revision=completed.revision,
                        description=question.stage + ": " + item.label + ". " + item.description,
                    )
                )
    if learning["current_roadmap_id"]:
        current = await one(
            connection,
            "SELECT title FROM asgard_catalog.roadmaps WHERE id = CAST(:id AS uuid)",
            {"id": str(learning["current_roadmap_id"])},
        )
        if current:
            facts.append(
                ContextFact(
                    id="current_roadmap",
                    source="current_roadmap",
                    source_id=str(learning["current_roadmap_id"]),
                    source_revision=learning["context_revision"],
                    description="Explicit learning focus: " + current["title"],
                )
            )
    progress = await rows(
        connection,
        (
            "SELECT p.topic_id, p.status, p.version, t.title FROM "
            "asgard_private.topic_progress p JOIN asgard_catalog.topics t ON t.id ="
            " p.topic_id WHERE p.user_id = CAST(:uid AS uuid) AND p.roadmap_id = "
            "CAST(:roadmap AS uuid) ORDER BY p.updated_at DESC LIMIT 12"
        ),
        {
            "uid": str(uid),
            "roadmap": str(learning["current_roadmap_id"])
            if learning["current_roadmap_id"]
            else None,
        },
    )
    for item in progress:
        facts.append(
            ContextFact(
                id="progress:" + str(item["topic_id"]),
                source="topic_progress",
                source_id=str(item["topic_id"]),
                source_revision=item["version"],
                description="Self-reported "
                + item["status"]
                + ": "
                + item["title"]
                + "; not an assessment of skill or interest.",
            )
        )
    choices = await rows(
        connection,
        (
            "SELECT c.group_id, c.version, b.title FROM "
            "asgard_private.branch_choices c JOIN asgard_catalog.branches b ON b.id"
            " = c.branch_id WHERE c.user_id = CAST(:uid AS uuid) AND c.roadmap_id ="
            " CAST(:roadmap AS uuid) ORDER BY c.group_id LIMIT 12"
        ),
        {
            "uid": str(uid),
            "roadmap": str(learning["current_roadmap_id"])
            if learning["current_roadmap_id"]
            else None,
        },
    )
    for item in choices:
        facts.append(
            ContextFact(
                id="branch:" + str(item["group_id"]),
                source="branch_choice",
                source_id=str(item["group_id"]),
                source_revision=item["version"],
                description="Explicit learning path choice: " + item["title"],
            )
        )
    document = await one(
        connection,
        (
            "SELECT id,analysis_id,revision,evidence FROM asgard_private.documents "
            "WHERE user_id=CAST(:uid AS uuid) AND status='active'"
        ),
        {"uid": str(uid)},
    )
    if document:
        for position, item in enumerate(document["evidence"]):
            facts.append(
                ContextFact(
                    id="pdf:" + str(position),
                    source="pdf_analysis",
                    source_id=str(document["analysis_id"]),
                    source_revision=document["revision"],
                    description="Document states (" + item["kind"] + "): " + item["text"],
                )
            )
    if not facts:
        raise APIError(
            422,
            "no_eligible_context",
            "Record skills, complete Discovery or choose a learning roadmap "
            "before requesting suggestions.",
        )
    context_class = RecommendationContextV2 if occupational is not None else RecommendationContext
    context = context_class(
        **(occupational or {}),
        document=DocumentContextReference(
            document_id=document["id"],
            analysis_id=document["analysis_id"],
            revision=document["revision"],
        )
        if document
        else None,
        context_revision=learning["context_revision"],
        facts=facts,
        discovery=CompletedDiscoveryReference(
            session_id=completed.id,
            revision=completed.revision,
            questionnaire_id=completed.questionnaire_id,
        )
        if completed
        else None,
    )
    catalog = await rows(
        connection,
        (
            "SELECT c.id, c.title, c.description, c.skills, c.relevance_attributes,"
            " k.title AS category FROM asgard_catalog.careers c JOIN "
            "asgard_catalog.categories k ON k.id = c.category_id WHERE c.status = "
            "'published' ORDER BY c.id"
        ),
    )
    references, entries = [], []
    for item in catalog:
        paths = await rows(
            connection,
            (
                "SELECT id, title, description FROM asgard_catalog.roadmaps WHERE "
                "career_id = CAST(:id AS uuid) AND status = 'published' ORDER BY id"
            ),
            {"id": str(item["id"])},
        )
        mapping = {}
        for path in paths:
            topics = await rows(
                connection,
                (
                    "SELECT t.id FROM asgard_catalog.topics t JOIN "
                    "asgard_catalog.milestones m ON m.id = t.milestone_id WHERE "
                    "t.roadmap_id = CAST(:id AS uuid) AND t.retired_at IS NULL AND "
                    "m.retired_at IS NULL ORDER BY m.position, t.position, t.id"
                ),
                {"id": str(path["id"])},
            )
            mapping[path["id"]] = [topic["id"] for topic in topics]
        if not mapping:
            continue
        references.append(PublishedCareerReference(career_id=item["id"], roadmaps=mapping))
        entries.append(
            {
                "career_id": str(item["id"]),
                "title": item["title"],
                "description": item["description"],
                "skills": item["skills"],
                "category": item["category"],
                "relevance": item["relevance_attributes"],
                "roadmap_ids": [str(key) for key in mapping],
                "roadmaps": [
                    {
                        "id": str(path["id"]),
                        "title": path["title"],
                        "description": path["description"],
                    }
                    for path in paths
                ],
            }
        )
    if not entries:
        raise APIError(
            503, "catalog_unpublished", "No published career roadmap is available for suggestions."
        )
    return {
        "context": context.model_dump(mode="json"),
        "catalog": entries,
        "references": [item.model_dump(mode="json") for item in references],
        "catalog_release_id": str(release),
    }


async def reserve_attempt(connection, uid, run_id, attempt):
    count = await one(
        connection,
        (
            "SELECT count(*) AS total FROM asgard_private.analysis_attempts WHERE "
            "user_id = CAST(:uid AS uuid) AND operation = 'recommendation' AND "
            "reserved_at >= date_trunc('day', statement_timestamp() AT TIME ZONE "
            "'UTC') AT TIME ZONE 'UTC'"
        ),
        {"uid": str(uid)},
    )
    if count["total"] >= 10:
        raise APIError(
            429,
            "quota_exceeded",
            "Your daily AI allowance has been reached. Saved learning remains available.",
            retry_after=86400,
        )
    if attempt == 1:
        recent = await one(
            connection,
            (
                "SELECT id FROM asgard_private.analysis_attempts WHERE user_id = "
                "CAST(:uid AS uuid) AND operation = 'recommendation' AND reserved_at > "
                "statement_timestamp() - interval '1 minute' LIMIT 1"
            ),
            {"uid": str(uid)},
        )
        if recent:
            raise APIError(
                429,
                "quota_exceeded",
                "Wait a minute before requesting more suggestions.",
                retry_after=60,
            )
    budget = await one(
        connection,
        (
            "INSERT INTO asgard_private.analysis_daily_budget (utc_date, "
            "reserved_attempts) VALUES ((statement_timestamp() AT TIME ZONE "
            "'UTC')::date, 1) ON CONFLICT (utc_date) DO UPDATE SET "
            "reserved_attempts = "
            "asgard_private.analysis_daily_budget.reserved_attempts + 1 WHERE "
            "asgard_private.analysis_daily_budget.reserved_attempts < 100 RETURNING"
            " reserved_attempts"
        ),
    )
    if budget is None:
        raise APIError(
            429,
            "quota_exceeded",
            "The local application's daily AI allowance has been reached.",
            retry_after=86400,
        )
    await connection.execute(
        text(
            "INSERT INTO asgard_private.analysis_attempts (user_id, "
            "recommendation_run_id, operation, attempt, reservation_key) VALUES "
            "(CAST(:uid AS uuid), CAST(:run AS uuid), 'recommendation', :attempt, "
            "CAST(:key AS uuid))"
        ),
        {"uid": str(uid), "run": str(run_id), "attempt": attempt, "key": str(uuid4())},
    )


async def request_run(request, identity, body):
    settings = request.app.state.settings
    uid = identity.user_id
    async with transaction(request, identity) as connection:
        learning = await lock_account(connection, uid)
        await occupational_runtime.skills.lock(connection, uid)
        await expire(connection, uid)
        release = await release_id(connection)
        occupational_id = await occupational_runtime.reference_release(connection)
        if (
            "occupational_release_id" in body.model_fields_set
            and (str(body.occupational_release_id) if body.occupational_release_id else None)
            != occupational_id
        ):
            raise APIError(
                409, "context_outdated", "Career references changed. Reload suggestions."
            )
        if (
            learning["context_revision"] != body.expected_context_revision
            or release != body.catalog_release_id
        ):
            raise APIError(
                409,
                "context_outdated",
                "Saved context or catalog changed. Reload before requesting suggestions.",
            )
        existing = await one(
            connection,
            (
                "SELECT id, context_revision, catalog_release_id, context_snapshot FROM "
                "asgard_private.recommendation_runs WHERE user_id = CAST(:uid AS uuid) "
                "AND idempotency_key = CAST(:key AS uuid)"
            ),
            {"uid": str(uid), "key": str(body.idempotency_key)},
        )
        if existing:
            if (
                existing["context_snapshot"].get("context", {}).get("occupational_release_id")
                != occupational_id
                or not existing["context_snapshot"].get("context")
                or existing["context_revision"] != body.expected_context_revision
                or existing["catalog_release_id"] != release
            ):
                raise APIError(
                    409,
                    "idempotency_conflict",
                    "This request key belongs to different saved inputs.",
                )
            return await run(connection, uid, existing["id"], learning["context_revision"], release)
        reusable = await one(
            connection,
            (
                "SELECT id, status FROM asgard_private.recommendation_runs WHERE "
                "user_id = CAST(:uid AS uuid) AND (status = 'pending' OR (status = "
                "'completed' AND context_revision = :revision AND catalog_release_id = "
                "CAST(:release AS uuid) AND prompt_version = :prompt AND schema_version"
                " = :schema)) AND (context_snapshot->'context'->>'occupational_release_id') "
                "IS NOT DISTINCT FROM :occupational ORDER BY created_at DESC LIMIT 1"
            ),
            {
                "uid": str(uid),
                "revision": learning["context_revision"],
                "release": str(release),
                "prompt": PROMPT_VERSION,
                "schema": SCHEMA_VERSION,
                "occupational": occupational_id,
            },
        )
        if reusable and (
            reusable["status"] == "pending" or await eligible(connection, uid, reusable["id"])
        ):
            return await run(connection, uid, reusable["id"], learning["context_revision"], release)
        if not settings.groq_enabled or not settings.groq_api_key.get_secret_value():
            raise APIError(
                503,
                "provider_unavailable",
                "Career suggestions are temporarily unavailable. Your Discovery answers are saved.",
            )
        content = await snapshot(connection, uid, learning, release)
        occupational_enabled = content["context"]["schema_version"] == "2"
        try:
            payload, candidate_map, fact_map, prepared = occupational_runtime.prepare_selection(
                settings,
                content,
                diagnostics={
                    "request_id": getattr(request.state, "request_id", ""),
                    "model_id": settings.groq_model,
                },
            )
        except ProviderFailure as exc:
            diagnostic({"request_id": getattr(request.state, "request_id", "")}, exc.stage)
            if exc.stage == "input_budget":
                raise APIError(
                    422,
                    "recommendation_input_too_large",
                    "Career suggestions are temporarily unavailable. Your answers are saved.",
                ) from None
            raise APIError(
                503,
                "provider_unavailable",
                "Career suggestions are temporarily unavailable. Your answers are saved.",
            ) from None
        if occupational_enabled:
            await connection.execute(
                text(
                    "UPDATE asgard_private.recommendation_runs SET status='failed',"
                    "failure_code='context_outdated',finished_at=statement_timestamp() "
                    "WHERE user_id=CAST(:uid AS uuid) AND status='pending' AND "
                    "(context_revision<>:revision OR prompt_version<>:prompt "
                    "OR schema_version<>:schema "
                    "OR catalog_release_id<>CAST(:catalog AS uuid) OR "
                    "(context_snapshot->'context'->>'occupational_release_id') "
                    "IS DISTINCT FROM :occupational)"
                ),
                {
                    "uid": str(uid),
                    "revision": learning["context_revision"],
                    "prompt": PROMPT_VERSION,
                    "schema": SCHEMA_VERSION,
                    "catalog": str(release),
                    "occupational": occupational_id,
                },
            )
        saved = await one(
            connection,
            (
                "INSERT INTO asgard_private.recommendation_runs (user_id, "
                "discovery_session_id, discovery_revision, context_revision, "
                "catalog_release_id, prompt_version, schema_version, idempotency_key, "
                "context_snapshot, deadline_at, model_id) VALUES (CAST(:uid AS uuid), "
                "CAST(:session AS uuid), :discovery_revision, :revision, CAST(:release "
                "AS uuid), :prompt, :schema, CAST(:key AS uuid), CAST(:snapshot AS "
                "jsonb), statement_timestamp() + interval '30 seconds', :model) "
                "RETURNING id, deadline_at"
            ),
            {
                "uid": str(uid),
                "session": content["context"]["discovery"]["session_id"]
                if content["context"]["discovery"]
                else None,
                "discovery_revision": content["context"]["discovery"]["revision"]
                if content["context"]["discovery"]
                else None,
                "revision": learning["context_revision"],
                "release": str(release),
                "prompt": PROMPT_VERSION,
                "schema": SCHEMA_VERSION,
                "key": str(body.idempotency_key),
                "snapshot": json.dumps(content),
                "model": settings.groq_model,
            },
        )
        await reserve_attempt(connection, uid, saved["id"], 1)

    async def reserve_retry():
        async with transaction(request, identity) as connection:
            current = await lock_account(connection, uid)
            pending = await one(
                connection,
                (
                    "SELECT id FROM asgard_private.recommendation_runs WHERE user_id = "
                    "CAST(:uid AS uuid) AND id = CAST(:id AS uuid) AND status = 'pending' "
                    "AND deadline_at > statement_timestamp()"
                ),
                {"uid": str(uid), "id": str(saved["id"])},
            )
            if (
                not pending
                or current["context_revision"] != body.expected_context_revision
                or (
                    occupational_enabled
                    and await occupational_runtime.reference_release(connection)
                    != content["context"].get("occupational_release_id")
                )
            ):
                raise ProviderFailure("context_outdated", "retry_context_outdated")
            try:
                await reserve_attempt(connection, uid, saved["id"], 2)
            except APIError as exc:
                if exc.status != 429:
                    raise
                raise ProviderFailure("quota_exceeded", "retry_quota") from exc

    failure, validated = None, []
    diagnostics = {
        "run_id": str(saved["id"]),
        "request_id": getattr(request.state, "request_id", ""),
        "model_id": settings.groq_model,
    }
    try:
        result = await generate(
            request.app.state.http,
            settings,
            payload,
            reserve_retry,
            (saved["deadline_at"] - datetime.now(UTC)).total_seconds(),
            diagnostics=diagnostics,
            prepared=prepared,
        )
        resolved = resolve_selection(result, candidate_map, fact_map)
        context = TypeAdapter(SavedRecommendationContext).validate_python(content["context"])
        validated = validate_recommendations(
            resolved,
            context,
            [PublishedCareerReference.model_validate(item) for item in content["references"]],
        )
        uncertain = (
            any(fact.id.endswith(":unsure") for fact in context.facts)
            or (sum(fact.id.startswith("discovery:interests:") for fact in context.facts) > 1)
            or context.discovery is None
        )
        if context.discovery is None:
            for item in validated:
                item.uncertainty_note = (
                    "Your interests are unknown; these are exploration options "
                    "based on supplied context. " + (item.uncertainty_note or "")
                )[:600]
        if any(
            PROHIBITED.search(item.reason + " " + (item.uncertainty_note or ""))
            for item in validated
        ):
            raise SelectionFailure("unsupported_claim")
        if any(item.starting_topic_id is not None for item in validated):
            raise SelectionFailure("unexpected_starting_topic")
        if uncertain and any(not item.uncertainty_note for item in validated):
            raise SelectionFailure("missing_uncertainty")
        if not validated:
            raise SelectionFailure("empty_selection")
        diagnostic(diagnostics, "selection_validated")
    except ProviderFailure as exc:
        failure = exc.code
        diagnostic(diagnostics, exc.stage)
    except SelectionFailure as exc:
        failure = "invalid_output"
        diagnostic(diagnostics, str(exc))
    except ValueError:
        failure = "invalid_output"
        diagnostic(diagnostics, "catalog_or_evidence_relationship")
    async with transaction(request, identity) as connection:
        current = await lock_account(connection, uid)
        latest_release = await release_id(connection)
        pending = required(
            await one(
                connection,
                (
                    "SELECT status, deadline_at FROM asgard_private.recommendation_runs "
                    "WHERE user_id = CAST(:uid AS uuid) AND id = CAST(:id AS uuid) FOR "
                    "UPDATE"
                ),
                {"uid": str(uid), "id": str(saved["id"])},
            )
        )
        if pending["status"] == "pending":
            if (
                current["context_revision"] != body.expected_context_revision
                or latest_release != release
                or (
                    occupational_enabled
                    and await occupational_runtime.reference_release(connection)
                    != content["context"].get("occupational_release_id")
                )
            ):
                failure = "context_outdated"
            elif datetime.now(UTC) >= pending["deadline_at"]:
                failure = "timeout"
            if not failure:
                published = {
                    (row["career_id"], row["id"])
                    for row in await rows(
                        connection,
                        (
                            "SELECT r.id, r.career_id FROM asgard_catalog.roadmaps r JOIN "
                            "asgard_catalog.careers c ON c.id = r.career_id WHERE r.status = "
                            "'published' AND c.status = 'published'"
                        ),
                    )
                }
                if any((item.career_id, item.roadmap_id) not in published for item in validated):
                    failure = "context_outdated"
            if not failure:
                for position, item in enumerate(validated):
                    await connection.execute(
                        text(
                            "INSERT INTO asgard_private.recommendation_items (user_id, run_id, "
                            "position, career_id, roadmap_id, starting_topic_id, reason, "
                            "uncertainty_note, evidence_fact_ids"
                            + (",source_reference_ids" if occupational_enabled else "")
                            + ") VALUES (CAST(:uid AS uuid), "
                            "CAST(:run AS uuid), :position, CAST(:career AS uuid), CAST(:roadmap AS"
                            " uuid), NULL, :reason, :uncertainty, :facts"
                            + (",:source_refs" if occupational_enabled else "")
                            + ")"
                        ),
                        {
                            "uid": str(uid),
                            "run": str(saved["id"]),
                            "position": position,
                            "career": str(item.career_id),
                            "roadmap": str(item.roadmap_id) if item.roadmap_id else None,
                            "reason": item.reason,
                            "uncertainty": item.uncertainty_note,
                            "facts": item.evidence_fact_ids,
                            "source_refs": item.source_reference_ids,
                        },
                    )
            await connection.execute(
                text(
                    "UPDATE asgard_private.recommendation_runs SET status = :status, "
                    "failure_code = :failure, finished_at = statement_timestamp() WHERE "
                    "user_id = CAST(:uid AS uuid) AND id = CAST(:id AS uuid)"
                ),
                {
                    "status": "failed" if failure else "completed",
                    "failure": failure,
                    "uid": str(uid),
                    "id": str(saved["id"]),
                },
            )
        return await run(connection, uid, saved["id"], current["context_revision"], latest_release)


async def retry(request, identity, run_id, body):
    async with transaction(request, identity) as connection:
        learning = await lock_account(connection, identity.user_id)
        await expire(connection, identity.user_id)
        release = await release_id(connection)
        source = await run(
            connection, identity.user_id, run_id, learning["context_revision"], release
        )
        if source.outdated or source.context_revision != body.expected_context_revision:
            raise APIError(
                409,
                "context_outdated",
                "These inputs changed. Use Update suggestions with the latest saved context.",
            )
        if source.status != "failed":
            return source
        if source.failure_code == "no_supported_careers":
            return source
        new = RequestRecommendations(
            idempotency_key=body.idempotency_key,
            expected_context_revision=body.expected_context_revision,
            catalog_release_id=source.catalog_release_id,
            occupational_release_id=source.occupational_release_id,
        )
    return await request_run(request, identity, new)
