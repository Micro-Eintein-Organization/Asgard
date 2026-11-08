from datetime import datetime
from typing import Literal
from uuid import UUID

from app.api.contracts import Contract, Page, Revision


class Category(Contract):
    id: UUID
    slug: str
    title: str
    description: str
    position: int


class Career(Contract):
    id: UUID
    category_id: UUID
    slug: str
    title: str
    description: str
    responsibilities: list[str]
    skills: list[str]
    roadmap_ids: list[UUID]
    revision: Revision
    status: Literal["published", "retired"]
    revision_note: str
    reviewed_at: datetime


class CareerPage(Page[Career]):
    catalog_release_id: UUID
