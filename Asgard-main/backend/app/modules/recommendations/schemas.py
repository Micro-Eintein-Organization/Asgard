from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import Field, model_validator

from app.api.contracts import Contract, Identifier, Revision

FailureCode = Literal[
    "timeout",
    "quota_exceeded",
    "provider_unavailable",
    "invalid_output",
    "context_outdated",
    "no_eligible_context",
    "no_supported_careers",
]


class CompletedDiscoveryReference(Contract):
    session_id: UUID
    revision: Revision
    questionnaire_id: UUID


class DocumentContextReference(Contract):
    document_id: UUID
    analysis_id: UUID
    revision: Revision


class ContextFact(Contract):
    id: Identifier
    source: Literal[
        "discovery",
        "current_roadmap",
        "topic_progress",
        "branch_choice",
        "pdf_analysis",
    ]
    source_id: Identifier
    source_revision: Revision
    description: Annotated[str, Field(min_length=1, max_length=1200)]


class RecommendationContext(Contract):
    schema_version: Literal["1"] = "1"
    context_revision: Revision
    discovery: CompletedDiscoveryReference | None
    document: DocumentContextReference | None = None
    facts: Annotated[list[ContextFact], Field(min_length=1, max_length=500)]

    @model_validator(mode="after")
    def unique_facts(self):
        if len({fact.id for fact in self.facts}) != len(self.facts):
            raise ValueError("Context fact identifiers must be unique.")
        if any(fact.source == "discovery" for fact in self.facts) and self.discovery is None:
            raise ValueError("Discovery facts require completed Discovery provenance.")
        for fact in self.facts:
            if fact.source == "discovery" and fact.source_revision != self.discovery.revision:
                raise ValueError("Discovery evidence must use the completed answer revision.")
            if fact.source == "pdf_analysis" and (
                self.document is None
                or fact.source_id != str(self.document.analysis_id)
                or fact.source_revision != self.document.revision
            ):
                raise ValueError("Document facts must resolve to the active analysis revision.")
        return self


class UntrustedRecommendationItem(Contract):
    career_id: UUID
    reason: Annotated[str, Field(min_length=1, max_length=1200)]
    evidence_fact_ids: Annotated[list[Identifier], Field(min_length=1, max_length=20)]
    uncertainty_note: Annotated[str, Field(min_length=1, max_length=600)] | None = None
    roadmap_id: UUID | None = None
    # Reserved destination only; authored next-topic guidance remains Progress-owned.
    starting_topic_id: UUID | None = None


class UntrustedRecommendationOutput(Contract):
    items: Annotated[list[UntrustedRecommendationItem], Field(max_length=3)]

    @model_validator(mode="after")
    def distinct_careers(self):
        if len({item.career_id for item in self.items}) != len(self.items):
            raise ValueError("Recommendations must reference distinct careers.")
        return self


class PublishedCareerReference(Contract):
    career_id: UUID
    # Constructed by the backend from one published catalog release, never the model.
    roadmaps: dict[UUID, list[UUID]]


class ValidatedRecommendationItem(UntrustedRecommendationItem):
    """Construct through validate_recommendations after provenance/catalog checks."""


def validate_recommendations(
    output: UntrustedRecommendationOutput,
    context: RecommendationContext,
    catalog: list[PublishedCareerReference],
) -> list[ValidatedRecommendationItem]:
    allowed = {entry.career_id: entry.roadmaps for entry in catalog}
    facts = {fact.id for fact in context.facts}
    validated = []
    for item in output.items:
        if item.career_id not in allowed:
            raise ValueError("Career is absent from the published catalog snapshot.")
        if not set(item.evidence_fact_ids) <= facts:
            raise ValueError("Evidence does not resolve to the input context revision.")
        if item.roadmap_id is not None and item.roadmap_id not in allowed[item.career_id]:
            raise ValueError("Roadmap does not belong to the selected career.")
        if item.starting_topic_id is not None and (
            item.roadmap_id is None
            or item.starting_topic_id not in allowed[item.career_id][item.roadmap_id]
        ):
            raise ValueError("Starting topic is absent from the suggested roadmap.")
        validated.append(ValidatedRecommendationItem.model_validate(item.model_dump()))
    return validated


class RequestRecommendations(Contract):
    idempotency_key: UUID
    expected_context_revision: Revision
    catalog_release_id: UUID


class RetryRecommendations(Contract):
    idempotency_key: UUID
    expected_context_revision: Revision


class RecommendationRun(Contract):
    id: UUID
    status: Literal["pending", "completed", "failed"]
    context_revision: Revision
    catalog_release_id: UUID
    discovery: CompletedDiscoveryReference | None
    prompt_version: Identifier
    schema_version: Identifier
    model_id: str | None
    created_at: datetime
    finished_at: datetime | None
    outdated: bool
    failure_code: FailureCode | None
    items: Annotated[list[ValidatedRecommendationItem], Field(max_length=3)]
    evidence: list[ContextFact] = Field(default_factory=list)

    @model_validator(mode="after")
    def truthful_status(self):
        if (self.status == "pending") != (self.finished_at is None):
            raise ValueError("Finished time must agree with run status.")
        if (self.status == "failed") != (self.failure_code is not None):
            raise ValueError("Safe failure code must agree with run status.")
        if (self.status == "completed") != bool(self.items):
            raise ValueError("Only completed runs expose validated results.")
        if len({item.career_id for item in self.items}) != len(self.items):
            raise ValueError("Recommendations must be distinct.")
        return self


class RecommendationState(Contract):
    current: RecommendationRun | None
    previous_eligible_success: RecommendationRun | None
    context_revision: Revision
    catalog_release_id: UUID | None
    available: bool
    unavailable_reason: str | None
