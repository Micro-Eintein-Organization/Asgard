import asyncio
import io
from types import SimpleNamespace
from unittest.mock import AsyncMock

import pytest
from pypdf import PdfWriter
from pypdf.generic import DecodedStreamObject, DictionaryObject, NameObject

from app.core.errors import APIError
from app.modules.documents.provider import parse, redact, validate_extraction


def synthetic_pdf(text="Skills: SQL"):
    writer = PdfWriter()
    page = writer.add_blank_page(width=300, height=300)
    font = DictionaryObject(
        {
            NameObject("/Type"): NameObject("/Font"),
            NameObject("/Subtype"): NameObject("/Type1"),
            NameObject("/BaseFont"): NameObject("/Helvetica"),
        }
    )
    page[NameObject("/Resources")] = DictionaryObject(
        {NameObject("/Font"): DictionaryObject({NameObject("/F1"): writer._add_object(font)})}
    )
    stream = DecodedStreamObject()
    stream.set_data(("BT /F1 12 Tf 20 260 Td (" + text + ") Tj ET").encode())
    page[NameObject("/Contents")] = writer._add_object(stream)
    output = io.BytesIO()
    writer.write(output)
    return output.getvalue()


def test_isolated_parser_reads_selectable_text():
    pages = asyncio.run(parse(synthetic_pdf()))
    assert "SQL" in pages[0]


@pytest.mark.parametrize("data", [b"not a PDF", synthetic_pdf("")])
def test_parser_rejects_invalid_or_image_only(data):
    with pytest.raises(APIError):
        asyncio.run(parse(data))


def test_encrypted_pdf_rejected():
    writer = PdfWriter()
    writer.add_blank_page(width=300, height=300)
    writer.encrypt("secret")
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(APIError) as error:
        asyncio.run(parse(output.getvalue()))
    assert error.value.code == "encrypted_pdf"


def test_page_limit_rejected():
    writer = PdfWriter()
    for _ in range(51):
        writer.add_blank_page(width=300, height=300)
    output = io.BytesIO()
    writer.write(output)
    with pytest.raises(APIError) as error:
        asyncio.run(parse(output.getvalue()))
    assert error.value.code == "too_many_pages"


def test_redaction_drops_header_and_contact_lines():
    result = redact(
        [
            "Synthetic Person\nperson@example.test\nSkills\nSQL\nPhone +1234567890\nhttps://example.test"
        ]
    )
    assert result == ["Skills\nSQL"]


def test_redaction_drops_known_names_repeated_in_sections():
    result = redact(["Skills\nSQL\nSynthetic Person\nProjects\nPython"], ("Synthetic", "Person"))
    assert result == ["Skills\nSQL\nProjects\nPython"]


def test_inline_headings_and_page_continuation_preserve_evidence():
    assert redact(["Private header\nTECHNICAL SKILLS: SQL", "Python\nmail@example.test"]) == [
        "TECHNICAL SKILLS: SQL", "Python",
    ]


def test_heading_prefix_in_prose_does_not_enable_extraction():
    with pytest.raises(APIError):
        redact(["Skills unrelated to this document\nSQL"])


@pytest.mark.parametrize(
    "item",
    [
        {"kind": "skill", "text": "SQL", "page": 2, "span": "SQL"},
        {"kind": "skill", "text": "Python", "page": 1, "span": "SQL"},
        {"kind": "skill", "text": "SQL", "page": 1, "span": "Invented SQL"},
    ],
)
def test_unsupported_evidence_rejected(item):
    with pytest.raises(ValueError):
        validate_extraction({"items": [item]}, ["Skills\nSQL"])


def test_empty_output_does_not_replace_context():
    with pytest.raises(ValueError):
        validate_extraction({"items": []}, ["Skills\nSQL"])


def test_supported_statement_has_source_not_proficiency():
    result = validate_extraction(
        {"items": [{"kind": "skill", "text": "SQL", "page": 1, "span": "SQL"}]}, ["Skills\nSQL"]
    )
    assert result.items[0].text == "SQL"


def test_pdf_reservation_has_no_per_account_attempt_limit(monkeypatch):
    from app.modules.documents import service

    async def budget(connection, sql, *args):
        assert "analysis_daily_budget" in sql
        assert "count(*)" not in sql
        return {"reserved_attempts": 42}

    monkeypatch.setattr(service, "one", budget)
    connection = SimpleNamespace(execute=AsyncMock())
    asyncio.run(service.reserve(connection, "user", "document", "key", 1))
    connection.execute.assert_awaited_once()


def test_shared_budget_still_blocks_pdf_requests(monkeypatch):
    from app.modules.documents import service

    monkeypatch.setattr(service, "one", AsyncMock(return_value=None))
    with pytest.raises(APIError) as error:
        asyncio.run(service.reserve(None, "user", "document", "key", 1))
    assert error.value.message == "Application analysis allowance reached."
    assert 1 <= error.value.retry_after <= 86400


def test_transient_provider_failure_retries_once_and_reserves_attempt():
    import httpx
    from pydantic import SecretStr

    from app.modules.documents import provider

    calls = []

    def respond(request):
        calls.append(request)
        if len(calls) == 1:
            return httpx.Response(503, headers={"retry-after": "0"})
        return httpx.Response(200, json={"choices": [{
            "finish_reason": "stop", "message": {"content":
                '{"items":[{"kind":"skill","text":"SQL","source_id":1}]}'},
        }]})

    retry = AsyncMock()

    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as client:
            return await provider.extract(client, SimpleNamespace(
                groq_model="test", groq_api_key=SecretStr("synthetic"),
            ), ["Skills: SQL"], retry)

    assert asyncio.run(run()).items[0].text == "SQL"
    assert len(calls) == 2
    retry.assert_awaited_once()


def test_chunks_keep_original_pages_and_exact_source_text():
    from app.modules.documents.provider import source_chunks

    pages = ["Skills: SQL\n" + "Python " * 1000, "Projects: ETL"]
    chunks = source_chunks(pages)
    assert 1 < len(chunks) <= 4
    for chunk in chunks:
        for source in chunk:
            assert source["text"] in pages[source["page"] - 1]
    assert chunks[-1][-1]["page"] == 2


@pytest.mark.parametrize("invalid_second_chunk", [False, True])
def test_chunk_merge_preserves_source_and_rejects_partial_failure(invalid_second_chunk):
    import json

    import httpx
    from pydantic import SecretStr

    from app.modules.documents import provider

    def respond(request):
        payload = json.loads(request.content)
        sources = json.loads(payload["messages"][1]["content"])
        source = sources[0]
        item = {"kind": "skill", "text": source["text"][:30],
                "source_id": source["source_id"]}
        if invalid_second_chunk and source["source_id"] > 1:
            item["source_id"] = 999999
        return httpx.Response(200, json={"choices": [{"finish_reason": "stop",
            "message": {"content": json.dumps({"items": [item]})}}]})

    reserve = AsyncMock()

    async def run():
        async with httpx.AsyncClient(transport=httpx.MockTransport(respond)) as client:
            return await provider.extract(client, SimpleNamespace(
                groq_model="test", groq_api_key=SecretStr("synthetic"),
            ), ["Skills: SQL\n" + "Python " * 1000, "Projects: ETL"], reserve)

    if invalid_second_chunk:
        with pytest.raises(ValueError, match="unsupported_evidence"):
            asyncio.run(run())
    else:
        result = asyncio.run(run())
        assert len(result.items) == 2
        reserve.assert_awaited_once_with(False)


@pytest.mark.parametrize("blocked", [False, True])
def test_preflight_failures_and_quota_candidate_recovery(monkeypatch, blocked):
    from contextlib import asynccontextmanager
    from datetime import UTC, datetime, timedelta
    from uuid import uuid4

    from app.modules.documents import service

    connection = SimpleNamespace(execute=AsyncMock())

    @asynccontextmanager
    async def transaction(*args):
        yield connection

    doc = uuid4()

    async def one(connection, sql, *args):
        if "SELECT *" in sql:
            return {"analysis_key": None, "status": "uploaded", "object_key": "private"}
        if "first_name" in sql:
            return None
        return {
            "id": doc, "status": "analyzing",
            "deadline_at": datetime.now(UTC) + timedelta(seconds=60),
        }

    for name in ("expire", "bump", "cleanup"):
        monkeypatch.setattr(service, name, AsyncMock())
    monkeypatch.setattr(service, "transaction", transaction)
    monkeypatch.setattr(service, "one", one)
    monkeypatch.setattr(service, "head", AsyncMock(return_value={"revision": 1}))
    monkeypatch.setattr(service, "state", AsyncMock(return_value="preserved"))
    monkeypatch.setattr(service, "object_request", AsyncMock(
        return_value=SimpleNamespace(content=b"pdf"),
    ))
    monkeypatch.setattr(service.provider, "parse", AsyncMock(
        return_value=["Skills: SQL"],
        side_effect=None if blocked else APIError(422, "invalid_pdf", "Invalid PDF"),
    ))
    reserve = AsyncMock(side_effect=APIError(429, "quota_exceeded", "Wait", retry_after=12))
    monkeypatch.setattr(service, "reserve", reserve)
    monkeypatch.setattr(service.provider, "extract", AsyncMock())
    settings = SimpleNamespace(documents_enabled=True, storage_service_key=SimpleNamespace(
            get_secret_value=lambda: "synthetic"), groq_enabled=True, groq_api_key=SimpleNamespace(
                get_secret_value=lambda: "synthetic"), documents_real_data_approved=True)
    request = SimpleNamespace(
        state=SimpleNamespace(request_id="test"),
        app=SimpleNamespace(state=SimpleNamespace(settings=settings)),
    )
    action = service.analyze(request, SimpleNamespace(user_id=uuid4()), doc, SimpleNamespace(
        idempotency_key=uuid4(), expected_revision=1, synthetic_document=True,
    ))
    if blocked:
        with pytest.raises(APIError) as error:
            asyncio.run(action)
        assert error.value.retry_after == 12
        update = connection.execute.await_args_list[-1].args[1]
        assert update["status"] == "uploaded"
        assert update["failed"] is False
    else:
        assert asyncio.run(action) == "preserved"
        reserve.assert_not_awaited()
    service.provider.extract.assert_not_awaited()
