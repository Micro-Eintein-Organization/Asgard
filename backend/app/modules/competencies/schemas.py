from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import Field, StrictInt

from app.api.contracts import Contract, Page, VersionedChange
from app.modules.careers.exploration import SkillExplanation

Level = Annotated[StrictInt, Field(ge=0, le=4)]


class CareerContext(Contract):
    career_id: UUID
    title: str


class Competency(Contract):
    explanation: SkillExplanation | None = None
    id: UUID
    label: str
    source: str
    source_version: str
    career_context: list[CareerContext] = Field(default_factory=list)


class CompetencyPage(Page[Competency]):
    pass


class UserCompetency(Contract):
    explanation: SkillExplanation | None = None
    competency_id: UUID
    label: str
    level: Level | None
    updated_at: datetime
    career_context: list[CareerContext] = Field(default_factory=list)


class CompetencyState(Contract):
    version: int
    items: list[UserCompetency]
    recommendations_enabled: bool = False


class SaveCompetency(VersionedChange):
    level: Level | None


class TopicLink(Contract):
    topic_id: UUID
    roadmap_id: UUID
    title: str


class ComparisonItem(Competency):
    recorded: bool
    level: Level | None
    topics: list[TopicLink]


class CompetencyComparison(Contract):
    career_id: UUID
    account_version: int
    career_revision: int
    items: list[ComparisonItem]
    occupational_release_id: UUID | None = None
