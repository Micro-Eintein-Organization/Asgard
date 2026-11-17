"""Career-side skill source; swap this adapter for a reviewed snapshot later.

The current source is career-linked competencies: learning-path coverage,
not validated employer requirements. It intentionally reads only published
careers and published competencies.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Protocol, Sequence
from uuid import UUID

from app.modules.skill_matching.matcher import BenchmarkSkill, Career
from app.modules.storage import rows

SOURCE_LABEL = "career-linked competencies"
SAMPLE_LABEL = "career-linked learning-path coverage"
SOURCE_NOTE = "Learning-path coverage, not validated employer requirements."


@dataclass(frozen=True, slots=True)
class SkillProvenance:
    source: str
    source_version: str


@dataclass(frozen=True, slots=True)
class CareerCatalog:
    careers: tuple[Career, ...]
    provenance: dict[UUID, SkillProvenance]
    source_version: str | None


class CareerSkillSource(Protocol):
    async def list_all(self, connection) -> CareerCatalog: ...


def catalog_from_rows(source_rows: Sequence[dict]) -> CareerCatalog:
    """Convert query rows to distinct career skills, retaining source versions."""

    career_names: dict[UUID, str] = {}
    skills_by_career: dict[UUID, dict[str, BenchmarkSkill]] = {}
    provenance: dict[UUID, SkillProvenance] = {}
    versions: set[str] = set()

    for row in source_rows:
        career_id = UUID(str(row["career_id"]))
        career_names[career_id] = row["career_title"]
        skills_by_career.setdefault(career_id, {})
        competency_id_value = row.get("competency_id")
        if competency_id_value is None:
            continue
        competency_id = UUID(str(competency_id_value))
        skill = BenchmarkSkill(
            skill_key=str(competency_id),
            label=row["label"],
            aliases=tuple(row.get("aliases") or ()),
            competency_id=competency_id,
        )
        skills_by_career[career_id][skill.skill_key] = skill
        provenance[competency_id] = SkillProvenance(
            source=row["source"], source_version=row["source_version"]
        )
        versions.add(row["source_version"])

    careers = tuple(
        Career(career_id, career_names[career_id], tuple(skills.values()))
        for career_id, skills in sorted(
            skills_by_career.items(), key=lambda item: (career_names[item[0]].casefold(), str(item[0]))
        )
    )
    return CareerCatalog(
        careers=careers,
        provenance=provenance,
        source_version=next(iter(versions)) if len(versions) == 1 else None,
    )


class CompetencyLinksSource:
    """Read published career-linked competencies as learning-path coverage."""

    async def list_all(self, connection) -> CareerCatalog:
        source_rows = await rows(
            connection,
            "SELECT career.id AS career_id, career.title AS career_title, "
            "competency.id AS competency_id, competency.label, competency.aliases, "
            "competency.source, competency.source_version "
            "FROM asgard_catalog.careers AS career "
            "LEFT JOIN asgard_catalog.competency_links AS link "
            "ON link.career_id = career.id "
            "LEFT JOIN asgard_catalog.competencies AS competency "
            "ON competency.id = link.competency_id AND competency.published "
            "WHERE career.status = 'published' "
            "ORDER BY lower(career.title), career.id, competency.id",
        )
        return catalog_from_rows(source_rows)
