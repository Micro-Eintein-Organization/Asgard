from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import Field

from app.api.contracts import Contract, Revision


class DocumentEvidence(Contract):
    kind: Literal["skill", "education", "experience", "project"]
    text: Annotated[str, Field(min_length=1, max_length=250)]
    page: Annotated[int, Field(ge=1, le=50)]
    span: Annotated[str, Field(min_length=1, max_length=500)]


class Extraction(Contract):
    items: Annotated[list[DocumentEvidence], Field(max_length=30)]


class Document(Contract):
    id: UUID
    status: Literal["uploading", "uploaded", "analyzing", "active", "failed", "removed"]
    revision: Revision
    failure_code: str | None
    created_at: datetime
    evidence: list[DocumentEvidence]


class DocumentState(Contract):
    revision: Revision
    active: Document | None
    candidate: Document | None
    latest_failure: Document | None
    available: bool
    synthetic_only: bool
    cleanup_pending: int


class DocumentCommand(Contract):
    expected_revision: Revision


class AnalyzeDocument(DocumentCommand):
    idempotency_key: UUID
    synthetic_document: bool = False
