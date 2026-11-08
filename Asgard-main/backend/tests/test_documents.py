import asyncio
import io

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
