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


def test_quota_uses_daily_wait_when_both_limits_are_reached(monkeypatch):
    from app.modules.documents import service

    async def counts(*args, **kwargs):
        return {"hourly": 3, "daily": 5, "hourly_wait": 25.1, "daily_wait": 7200.2}

    monkeypatch.setattr(service, "one", counts)
    with pytest.raises(APIError) as error:
        asyncio.run(service.reserve(None, "user", "document", "key", 1))
    assert error.value.retry_after == 7201


def test_quota_uses_hourly_wait_without_daily_exhaustion(monkeypatch):
    from app.modules.documents import service

    async def counts(*args, **kwargs):
        return {"hourly": 3, "daily": 3, "hourly_wait": 25.1, "daily_wait": 7200.2}

    monkeypatch.setattr(service, "one", counts)
    with pytest.raises(APIError) as error:
        asyncio.run(service.reserve(None, "user", "document", "key", 1))
    assert error.value.retry_after == 26


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
                '{"items":[{"kind":"skill","text":"SQL","page":1,"span":"SQL"}]}'},
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
