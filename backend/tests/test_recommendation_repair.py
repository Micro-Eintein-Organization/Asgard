import asyncio
import copy
import hashlib
import json
import logging
from contextlib import asynccontextmanager
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import pytest
from pydantic import ValidationError

from app.core.config import Settings
from app.core.errors import APIError
from app.modules.recommendations import service, token_budget
from app.modules.recommendations.provider import (
    ProviderFailure,
    generate,
    prepare_request,
    strict_schema,
)
from app.modules.recommendations.schemas import (
    ContextFact,
    PublishedCareerReference,
    RecommendationContext,
    RequestRecommendations,
    validate_recommendations,
)
from app.modules.recommendations.selection import (
    SelectionFailure,
    SelectionOutput,
    provider_payload,
    resolve_selection,
)


def fixture_content():
    career, roadmap = uuid4(), uuid4()
    context = RecommendationContext(
        context_revision=1,
        discovery=None,
        facts=[
            ContextFact(
                id="focus:private-reference",
                source="current_roadmap",
                source_id=str(roadmap),
                source_revision=1,
                description="An explicitly chosen learning path.",
            )
        ],
    )
    return {
        "context": context.model_dump(mode="json"),
        "catalog": [
            {
                "career_id": str(career),
                "title": "Published career",
                "description": "An introductory path.",
                "skills": ["HTML"],
                "category": "Software",
                "relevance": {"scope": "starter"},
                "roadmap_ids": [str(roadmap)],
                "roadmaps": [
                    {
                        "id": str(roadmap),
                        "title": "Published roadmap",
                        "description": "Introductory topics.",
                    }
                ],
            }
        ],
        "references": [
            PublishedCareerReference(career_id=career, roadmaps={roadmap: []}).model_dump(
                mode="json"
            )
        ],
        "catalog_release_id": str(uuid4()),
    }


def selection(**changes):
    item = {
        "candidate_key": "c1",
        "reason": "This path relates to the stated learning focus.",
        "evidence_keys": ["f1"],
        "caveat": "The catalog is small and the connection is broad.",
        "weak_connection": True,
    }
    return {"items": [item | changes]}


def test_candidate_keys_resolve_to_snapshot_ids_and_exact_evidence():
    content = fixture_content()
    payload, candidates, facts = provider_payload(content)
    assert payload["candidates"][0]["roadmap_title"] == "Published roadmap"
    encoded = json.dumps(payload)
    assert content["catalog"][0]["career_id"] not in encoded
    assert content["context"]["facts"][0]["id"] not in encoded
    resolved = resolve_selection(SelectionOutput.model_validate(selection()), candidates, facts)
    trusted = validate_recommendations(
        resolved,
        RecommendationContext.model_validate(content["context"]),
        [PublishedCareerReference.model_validate(item) for item in content["references"]],
    )
    assert str(trusted[0].career_id) == content["catalog"][0]["career_id"]
    assert str(trusted[0].roadmap_id) == content["catalog"][0]["roadmap_ids"][0]
    assert trusted[0].evidence_fact_ids == [content["context"]["facts"][0]["id"]]
    assert "loosely related" in trusted[0].uncertainty_note
    assert trusted[0].starting_topic_id is None


@pytest.mark.parametrize(
    "changes,stage",
    [
        ({"candidate_key": "c999"}, "unknown_candidate"),
        ({"evidence_keys": ["f999"]}, "unknown_evidence"),
        ({"evidence_keys": ["f1", "f1"]}, "duplicate_evidence"),
    ],
)
def test_unknown_references_are_rejected_without_unsafe_values(changes, stage):
    _, candidates, facts = provider_payload(fixture_content())
    with pytest.raises(SelectionFailure, match=stage):
        resolve_selection(SelectionOutput.model_validate(selection(**changes)), candidates, facts)


def test_schema_constrains_published_candidates_and_permitted_evidence():
    payload, _, _ = provider_payload(fixture_content())
    schema = strict_schema(payload)
    item = schema["$defs"]["SelectionItem"]
    assert item["properties"]["candidate_key"]["enum"] == ["c1"]
    assert item["properties"]["evidence_keys"]["items"]["enum"] == ["f1"]
    assert item["additionalProperties"] is False
    assert set(item["required"]) == set(item["properties"])
    with pytest.raises(ValidationError):
        SelectionOutput.model_validate({"items": []})
    with pytest.raises(ValidationError):
        SelectionOutput.model_validate(selection(caveat=""))
    with pytest.raises(ValidationError):
        SelectionOutput.model_validate(selection(career_id=str(uuid4())))
    with pytest.raises(ValidationError):
        Settings(groq_max_completion_tokens=8193)


def test_valid_provider_output_is_bounded_and_diagnostics_exclude_payloads(caplog):
    async def scenario():
        def respond(request):
            body = json.loads(request.content)
            assert body["max_completion_tokens"] == 1536
            assert body["response_format"]["json_schema"]["strict"] is True
            return httpx.Response(
                200,
                json={
                    "choices": [
                        {"finish_reason": "stop", "message": {"content": json.dumps(selection())}}
                    ],
                    "usage": {
                        "prompt_tokens": 123,
                        "completion_tokens": 234,
                        "completion_tokens_details": {"reasoning_tokens": 100},
                    },
                },
            )

        payload, _, _ = provider_payload(fixture_content())
        payload["facts"][0]["description"] = "PRIVATE_SENTINEL_DO_NOT_LOG"
        logger = logging.getLogger("asgard.recommendations")
        logger.addHandler(caplog.handler)
        logger.setLevel(logging.INFO)
        try:
            async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as client:
                output = await generate(
                    client,
                    Settings(groq_api_key="synthetic-test-key"),
                    payload,
                    AsyncMock(),
                    30,
                    diagnostics={"run_id": "safe-run", "request_id": "safe-request"},
                )
            assert output.items[0].candidate_key == "c1"
        finally:
            logger.removeHandler(caplog.handler)
        records = [
            record.fields
            for record in caplog.records
            if record.getMessage() == "recommendation_diagnostic"
        ]
        assert any(
            record.get("completion_tokens") == 234 and record["stage"] == "provider_completed"
            for record in records
        )
        assert "PRIVATE_SENTINEL" not in json.dumps(records)
        assert "synthetic-test-key" not in json.dumps(records)

    asyncio.run(scenario())


@pytest.mark.parametrize(
    "message,finish,stage",
    [
        ({"content": json.dumps(selection(caveat=""))}, "stop", "missing_uncertainty"),
        ({"content": "{}"}, "length", "truncated_completion"),
        ({"content": "not JSON"}, "stop", "invalid_content_json"),
        ({"content": '{"items":[]}'}, "stop", "output_schema"),
        ({"content": None}, "stop", "missing_content"),
        ({"content": "{}", "refusal": "untrusted refusal text"}, "stop", "provider_refusal"),
    ],
)
def test_provider_validation_failures_have_precise_stages_and_no_retry(message, finish, stage):
    async def scenario():
        reserve = AsyncMock()
        payload, _, _ = provider_payload(fixture_content())
        async with httpx.AsyncClient(
            transport=httpx.MockTransport(
                lambda request: httpx.Response(
                    200, json={"choices": [{"finish_reason": finish, "message": message}]}
                )
            )
        ) as client:
            with pytest.raises(ProviderFailure) as error:
                await generate(
                    client, Settings(groq_api_key="synthetic-test-key"), payload, reserve, 30
                )
        assert error.value.code == "invalid_output"
        assert error.value.stage == stage
        reserve.assert_not_awaited()

    asyncio.run(scenario())


def test_provider_retry_requires_a_persisted_reservation():
    async def scenario():
        calls = []

        def respond(request):
            calls.append(request)
            return httpx.Response(429, headers={"Retry-After": "0"})

        reserve = AsyncMock(side_effect=ProviderFailure("quota_exceeded", "retry_quota"))
        payload, _, _ = provider_payload(fixture_content())
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as client:
            with pytest.raises(ProviderFailure):
                await generate(
                    client, Settings(groq_api_key="synthetic-test-key"), payload, reserve, 30
                )
        assert len(calls) == 1
        reserve.assert_awaited_once()

    asyncio.run(scenario())


def service_boundary(monkeypatch, content, records):
    connection = SimpleNamespace(execute=AsyncMock())
    monkeypatch.setattr(service.discovery, "latest_completed_identity", AsyncMock(return_value=None))

    @asynccontextmanager
    async def transaction(*args):
        yield connection

    monkeypatch.setattr(service, "transaction", transaction)
    monkeypatch.setattr(service.occupational_runtime.skills, "lock", AsyncMock())
    monkeypatch.setattr(
        service.occupational_runtime, "reference_release", AsyncMock(return_value=None)
    )
    monkeypatch.setattr(service, "lock_account", AsyncMock(return_value={"context_revision": 1}))
    monkeypatch.setattr(service, "expire", AsyncMock())
    monkeypatch.setattr(
        service, "release_id", AsyncMock(return_value=content["catalog_release_id"])
    )
    monkeypatch.setattr(service, "one", AsyncMock(side_effect=records))
    monkeypatch.setattr(service, "reserve_attempt", AsyncMock())
    monkeypatch.setattr(service, "snapshot", AsyncMock(return_value=content))
    request = SimpleNamespace(
        app=SimpleNamespace(
            state=SimpleNamespace(
                settings=Settings(groq_enabled=True, groq_api_key="synthetic-test-key"), http=None
            )
        ),
        state=SimpleNamespace(request_id="safe-request"),
    )
    body = RequestRecommendations(
        idempotency_key=uuid4(),
        expected_context_revision=1,
        catalog_release_id=content["catalog_release_id"],
    )
    # Database UUIDs normally come from psycopg; preserve that type in this boundary.
    from uuid import UUID

    service.release_id.return_value = UUID(content["catalog_release_id"])
    return request, SimpleNamespace(user_id=uuid4()), body, connection


def test_v2_request_uses_rules_with_groq_disabled_and_no_quota_reservation(monkeypatch):
    from app.modules.discovery.definition import QUESTIONNAIRE_V2_ID

    request, identity, body, connection = service_boundary(monkeypatch, fixture_content(), [])
    request.app.state.settings = SimpleNamespace(groq_enabled=False)
    completed = {"id": uuid4(), "revision": 1, "questionnaire_id": QUESTIONNAIRE_V2_ID}
    monkeypatch.setattr(service.discovery, "latest_completed_identity", AsyncMock(return_value=completed))
    local = SimpleNamespace(status="completed", model_id=None)
    rules = AsyncMock(return_value=local)
    provider = AsyncMock()
    reserve = AsyncMock()
    monkeypatch.setattr(service, "request_rules", rules)
    monkeypatch.setattr(service, "generate", provider)
    monkeypatch.setattr(service, "reserve_attempt", reserve)

    assert asyncio.run(service.request_run(request, identity, body)) is local
    assert rules.await_args.args[0] is connection
    assert rules.await_args.args[-1] == completed
    provider.assert_not_awaited()
    reserve.assert_not_awaited()


def test_duplicate_request_reuses_saved_run_without_provider(monkeypatch):
    content = fixture_content()
    from uuid import UUID

    existing = {
        "id": uuid4(),
        "context_snapshot": content,
        "context_revision": 1,
        "catalog_release_id": UUID(content["catalog_release_id"]),
    }
    request, identity, body, _ = service_boundary(monkeypatch, content, [existing])
    returned = SimpleNamespace(id=existing["id"], status="completed")
    monkeypatch.setattr(service, "run", AsyncMock(return_value=returned))
    provider = AsyncMock()
    monkeypatch.setattr(service, "generate", provider)
    assert asyncio.run(service.request_run(request, identity, body)) is returned
    provider.assert_not_awaited()


def test_failed_generation_writes_only_its_run_and_preserves_input(monkeypatch):
    content = fixture_content()
    before = copy.deepcopy(content)
    saved = {"id": uuid4(), "deadline_at": datetime.now(UTC) + timedelta(seconds=30)}
    request, identity, body, connection = service_boundary(
        monkeypatch,
        content,
        [None, None, saved, {"status": "pending", "deadline_at": saved["deadline_at"]}],
    )
    monkeypatch.setattr(
        service,
        "generate",
        AsyncMock(side_effect=ProviderFailure("invalid_output", "truncated_completion")),
    )
    monkeypatch.setattr(service, "run", AsyncMock(return_value=SimpleNamespace(status="failed")))
    assert asyncio.run(service.request_run(request, identity, body)).status == "failed"
    assert content == before
    statements = [str(call.args[0]) for call in connection.execute.await_args_list]
    assert len(statements) == 1
    assert "UPDATE asgard_private.recommendation_runs" in statements[0]
    assert "WHERE user_id" in statements[0] and "id = CAST(:id AS uuid)" in statements[0]
    assert connection.execute.await_args.args[1]["id"] == str(saved["id"])


def test_twelve_careers_over_twelve_kilobytes_keep_all_context():
    content = fixture_content()
    content["catalog"] *= 12
    payload, _, _ = provider_payload(content)
    for index, item in enumerate(payload["candidates"]):
        item["title"] = f"Published career {index}"
        item["description"] = "Explore tools, workflows and practical projects. " * 20
    payload["facts"][0]["description"] = "兴趣 <|startoftext|> café 🚀"
    body = prepare_request(Settings(), payload)
    encoded = json.dumps(body, ensure_ascii=False)
    assert len(encoded.encode()) > 12000
    assert token_budget.input_tokens(encoded) < 12000
    assert json.loads(body["messages"][1]["content"]) == payload
    assert len(payload["candidates"]) == 12


def test_token_limit_boundary(monkeypatch):
    from app.modules.recommendations import provider

    payload, _, _ = provider_payload(fixture_content())
    for model, limit in (("openai/gpt-oss-120b", 6064), ("other-model", 12000)):
        settings = Settings(groq_model=model)
        monkeypatch.setattr(provider, "input_tokens", lambda _: limit)
        assert prepare_request(settings, payload)
        monkeypatch.setattr(provider, "input_tokens", lambda _: limit + 1)
        with pytest.raises(ProviderFailure, match="invalid_output") as error:
            prepare_request(settings, payload)
        assert error.value.stage == "input_budget"


def test_oversized_preflight_does_not_insert_reserve_or_call_provider(monkeypatch):
    content = fixture_content()
    fact = content["context"]["facts"][0]
    content["context"]["facts"] = [
        fact | {"id": f"focus:{index}", "description": "different token " * 70}
        for index in range(150)
    ]
    request, identity, body, connection = service_boundary(monkeypatch, content, [None, None])
    provider = AsyncMock()
    monkeypatch.setattr(service, "generate", provider)
    with pytest.raises(APIError) as error:
        asyncio.run(service.request_run(request, identity, body))
    assert error.value.status == 422
    assert error.value.code == "recommendation_input_too_large"
    service.reserve_attempt.assert_not_awaited()
    connection.execute.assert_not_awaited()
    assert service.one.await_count == 2
    provider.assert_not_awaited()


def test_missing_tokenizer_data_fails_without_network(monkeypatch, tmp_path):
    token_budget.tokenizer.cache_clear()
    monkeypatch.setenv("TIKTOKEN_CACHE_DIR", str(tmp_path))
    with pytest.raises(ValueError, match="tokenizer_not_bundled"):
        token_budget.input_tokens("test")
    filename = hashlib.sha1(token_budget.VOCAB_URL.encode()).hexdigest()
    (tmp_path / filename).write_text("corrupt")
    with pytest.raises(ValueError, match="tokenizer_not_bundled"):
        token_budget.input_tokens("test")
    token_budget.tokenizer.cache_clear()
