from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID

from pydantic import Field, field_validator

from app.api.contracts import Contract, Identifier, Revision, VersionedChange


class QuestionReference(Contract):
    question_id: Identifier
    position: Annotated[int, Field(ge=0)]
    stage: Literal["interests", "activities", "approach", "background", "goals"]
    prompt: str
    helper: str
    multiple: bool
    interest_option_id: Identifier | None
    max_selections: Annotated[int, Field(ge=1, le=5)] | None = None
    kind: Literal["experience_preference", "activity_follow_up"] | None = None
    options: list["DiscoveryOption"]


class DiscoveryOption(Contract):
    id: Identifier
    label: str
    description: str
    exclusive: bool
    excludes: list[Identifier]


class Questionnaire(Contract):
    id: UUID
    version: Revision
    questions: list[QuestionReference]


class DiscoveryAnswer(Contract):
    question_id: Identifier
    option_ids: Annotated[list[Identifier], Field(min_length=1, max_length=5)]

    @field_validator("option_ids")
    @classmethod
    def distinct_options(cls, value):
        if len(set(value)) != len(value):
            raise ValueError("Choose each option once.")
        return value


class DiscoverySession(Contract):
    id: UUID
    questionnaire_id: UUID
    source_session_id: UUID | None
    status: Literal["draft", "completed"]
    revision: Revision
    answers: list[DiscoveryAnswer]
    created_at: datetime
    completed_at: datetime | None
    active_question_ids: list[Identifier]
    next_question_id: Identifier | None


class DiscoveryState(Contract):
    draft: DiscoverySession | None
    latest_completed: DiscoverySession | None


class StartDiscovery(Contract):
    questionnaire_id: UUID


class SaveDiscovery(VersionedChange):
    answers: Annotated[list[DiscoveryAnswer], Field(min_length=1, max_length=6)]

    @field_validator("answers")
    @classmethod
    def distinct_questions(cls, value):
        if len({answer.question_id for answer in value}) != len(value):
            raise ValueError("Submit each question once.")
        return value


class CompleteDiscovery(Contract):
    expected_revision: Revision


class RetakeDiscovery(Contract):
    source_session_id: UUID
    expected_revision: Revision
