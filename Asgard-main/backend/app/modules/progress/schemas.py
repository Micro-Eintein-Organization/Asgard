from datetime import date, datetime
from typing import Annotated, Literal
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import Field, field_validator, model_validator

from app.api.contracts import Contract, Identifier, Revision, VersionedChange

TopicStatus = Literal["not_started", "learning", "done", "skipped"]


class Preferences(Contract):
    preferred_category_id: UUID | None
    timezone: str
    dismissed_guidance: list[Identifier]
    version: Revision


class SavePreferences(VersionedChange):
    preferred_category_id: UUID | None
    timezone: Annotated[str, Field(min_length=1, max_length=100)]
    dismissed_guidance: Annotated[list[Identifier], Field(max_length=20)]

    @field_validator("timezone")
    @classmethod
    def valid_timezone(cls, value):
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError) as exc:
            raise ValueError("Use an IANA timezone name.") from exc
        return value


class LearningState(Contract):
    current_roadmap_id: UUID | None
    version: Revision
    context_revision: Revision


class SelectRoadmap(VersionedChange):
    roadmap_id: UUID


class TopicProgress(Contract):
    roadmap_id: UUID
    topic_id: UUID
    status: TopicStatus
    version: Revision
    updated_at: datetime


class SaveTopicProgress(VersionedChange):
    status: TopicStatus


class BranchChoice(Contract):
    roadmap_id: UUID
    group_id: UUID
    branch_id: UUID
    version: Revision


class SaveBranchChoice(VersionedChange):
    branch_id: UUID


class MilestoneSummary(Contract):
    milestone_id: UUID
    done: Annotated[int, Field(ge=0)]
    applicable: Annotated[int, Field(ge=0)]
    common_done: Annotated[int, Field(ge=0)]
    common_total: Annotated[int, Field(ge=0)]
    requires_branch_choice: bool
    percentage: Annotated[float, Field(ge=0, le=100)] | None

    @model_validator(mode="after")
    def withhold_percentage_before_choice(self):
        if self.requires_branch_choice and self.percentage is not None:
            raise ValueError("Withhold full-path percentage until required choices are made.")
        if self.done > self.applicable or self.common_done > self.common_total:
            raise ValueError("Completed counts cannot exceed applicable counts.")
        return self


class ProgressSummary(Contract):
    roadmap_id: UUID
    milestones: list[MilestoneSummary]
    done: Annotated[int, Field(ge=0)]
    applicable: Annotated[int, Field(ge=0)]
    requires_branch_choice: bool
    percentage: Annotated[float, Field(ge=0, le=100)] | None
    state: Literal["empty", "branch_required", "in_progress", "completed", "review_skipped"]
    fully_done: bool
    no_remaining_suggestions: bool
    next_topic_ids: list[UUID]
    content_updated: bool


class ActivityDay(Contract):
    local_date: date
    done_count: Annotated[int, Field(ge=0)]


class ActivityMonth(Contract):
    month: str
    days: list[ActivityDay]
    streak_days: Annotated[int, Field(ge=0)]


class Dashboard(Contract):
    learning_state: LearningState
    active_topic: TopicProgress | None
    core_milestone_id: UUID | None
    progress: ProgressSummary | None
    recent_done: list[TopicProgress]
    recommendation_run_id: UUID | None
    discovery_draft_id: UUID | None
    guidance_id: Identifier | None
