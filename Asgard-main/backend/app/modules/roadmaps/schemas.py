from datetime import datetime
from typing import Literal
from uuid import UUID

from app.api.contracts import Contract, Revision


class Resource(Contract):
    id: UUID
    title: str
    url: str
    kind: Literal["article", "course", "video", "documentation", "tool"]
    is_free: bool
    license: str
    reviewed_at: datetime
    position: int


class Branch(Contract):
    id: UUID
    title: str
    position: int


class BranchGroup(Contract):
    id: UUID
    title: str
    explanation: str
    position: int
    branches: list[Branch]


class Topic(Contract):
    id: UUID
    roadmap_id: UUID
    milestone_id: UUID
    branch_id: UUID | None
    title: str
    explanation: str
    position: int
    revision: Revision
    retired_at: datetime | None
    revision_note: str
    prerequisite_ids: list[UUID]
    resources: list[Resource]


class Milestone(Contract):
    id: UUID
    title: str
    description: str
    position: int
    retired_at: datetime | None
    branch_groups: list[BranchGroup]
    topics: list[Topic]


class Roadmap(Contract):
    id: UUID
    career_id: UUID
    title: str
    description: str
    revision: Revision
    status: Literal["published", "retired"]
    revision_note: str
    milestones: list[Milestone]
