"""HTTP contracts for career skill matching."""

from datetime import date, datetime
from typing import Literal
from uuid import UUID

from pydantic import Field, StrictInt

from app.api.contracts import Contract

SkillStatusValue = Literal["MATCHED", "UNKNOWN", "MISSING"]


class ResumeSignal(Contract):
    document_id: UUID | None
    analysis_id: UUID | None
    revision: StrictInt | None
    kind: Literal["skill"]
    page: StrictInt
    text: str
    span: str
    matched_phrases: list[str]


class UserReportSignal(Contract):
    source: Literal["user_report"] = "user_report"
    level: StrictInt | None
    updated_at: datetime | None


class PostingResumeMatch(Contract):
    matched_phrase: str
    pages: list[StrictInt]


class PostingSkill(Contract):
    label: str
    resume_match: PostingResumeMatch | None


class CareerPosting(Contract):
    source: str
    source_version: str
    posting_id: str
    company: str
    job_title: str
    source_url: str
    retrieved_on: date
    skills: list[PostingSkill]


class SkillMatchItem(Contract):
    competency_id: UUID
    label: str
    source: str
    source_version: str
    status: SkillStatusValue
    reported_level: StrictInt | None
    user_report: UserReportSignal | None
    resume_signals: list[ResumeSignal] = Field(default_factory=list)
    posting_count: StrictInt | None
    total_postings: StrictInt | None


class CareerSkillMatch(Contract):
    career_id: UUID
    career_title: str
    rank: StrictInt
    matched_skill_count: StrictInt
    benchmark_skill_count: StrictInt
    display_count: str
    skills: list[SkillMatchItem]
    sample_note: str
    sample_label: str
    postings: list[CareerPosting] = Field(default_factory=list)


class CareerSkillMatchResponse(Contract):
    source: str
    source_version: str | None
    sample_label: str
    postings_sample_label: str
    items: list[CareerSkillMatch]
