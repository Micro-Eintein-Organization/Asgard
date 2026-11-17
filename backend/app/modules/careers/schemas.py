from datetime import datetime
from typing import Literal
from uuid import UUID

from app.api.contracts import Contract, Page, Revision
from app.modules.careers.exploration import Exploration


class Category(Contract):
    id: UUID
    slug: str
    title: str
    description: str
    position: int




class Career(Contract):
    exploration: Exploration | None = None
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


class CatalogSummary(Contract):
    categories: list[Category]
    by_category: dict[str, int]
    total: int
    catalog_release_id: UUID
