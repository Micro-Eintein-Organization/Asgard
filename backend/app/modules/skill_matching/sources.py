"""Career-side skill source; swap this adapter for a reviewed snapshot later.

The current source is career-linked competencies: learning-path coverage,
not validated employer requirements. It intentionally reads only published
careers and published competencies.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass, field, replace
from datetime import date
from typing import Protocol
from uuid import UUID

from app.core.errors import APIError
from app.modules.skill_matching.matcher import BenchmarkSkill, Career
from app.modules.skill_matching.technology_evidence import technology_terms
from app.modules.storage import rows

SOURCE_LABEL = "career-linked competencies"
SAMPLE_LABEL = "career-linked learning-path coverage"
SOURCE_NOTE = (
    "Learning-path coverage, not validated employer requirements. "
    "Mapped technology mentions count as supporting background, not task completion."
)
POSTINGS_SAMPLE_LABEL = "Curated benchmark sample"


@dataclass(frozen=True, slots=True)
class SkillProvenance:
    source: str
    source_version: str


@dataclass(frozen=True, slots=True)
class SnapshotAnnotation:
    posting_count: int
    total_postings: int


@dataclass(frozen=True, slots=True)
class CareerSample:
    source: str
    source_version: str
    total_postings: int


@dataclass(frozen=True, slots=True)
class CuratedPosting:
    source: str
    source_version: str
    posting_id: str
    company: str
    job_title: str
    source_url: str
    retrieved_on: date
    skill_labels: tuple[str, ...]


@dataclass(frozen=True, slots=True)
class CareerCatalog:
    careers: tuple[Career, ...]
    provenance: dict[UUID, SkillProvenance]
    source_version: str | None
    snapshot_annotations: dict[tuple[UUID, UUID], SnapshotAnnotation] = field(
        default_factory=dict
    )
    samples: dict[UUID, CareerSample] = field(default_factory=dict)
    postings_by_career: dict[UUID, tuple[CuratedPosting, ...]] = field(
        default_factory=dict
    )
    source_label: str = SOURCE_LABEL
    sample_label: str = SAMPLE_LABEL
    source_note: str = SOURCE_NOTE


class CareerSkillSource(Protocol):
    async def list_all(self, connection) -> CareerCatalog: ...


def catalog_from_rows(source_rows: Sequence[dict]) -> CareerCatalog:
    """Convert query rows to distinct career skills, retaining source versions."""

    career_names: dict[UUID, str] = {}
    skills_by_career: dict[UUID, dict[str, BenchmarkSkill]] = {}
    provenance: dict[UUID, SkillProvenance] = {}
    versions: set[str] = set()
    snapshot_rows: dict[
        UUID, dict[tuple[UUID, UUID], dict[str, tuple[tuple, SnapshotAnnotation]]]
    ] = {}
    invalid_snapshot_careers: set[UUID] = set()

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

        if row.get("snapshot_published") is False:
            continue
        snapshot_id_value = row.get("snapshot_id")
        snapshot_fields = (
            row.get("snapshot_posting_count"),
            row.get("snapshot_total_postings"),
            row.get("snapshot_source"),
            row.get("snapshot_source_version"),
        )
        if snapshot_id_value is None:
            if any(value is not None for value in snapshot_fields):
                invalid_snapshot_careers.add(career_id)
            continue

        posting_count, total_postings, source, source_version = snapshot_fields
        if (
            not isinstance(posting_count, int)
            or not isinstance(total_postings, int)
            or not isinstance(source, str)
            or not source
            or not isinstance(source_version, str)
            or not source_version
        ):
            invalid_snapshot_careers.add(career_id)
            continue

        pair = (career_id, competency_id)
        snapshot_key = str(snapshot_id_value)
        metadata = (source, source_version, total_postings)
        annotation = SnapshotAnnotation(posting_count, total_postings)
        rows_by_id = snapshot_rows.setdefault(career_id, {}).setdefault(pair, {})
        previous = rows_by_id.get(snapshot_key)
        if previous is not None and previous != (metadata, annotation):
            invalid_snapshot_careers.add(career_id)
        else:
            rows_by_id[snapshot_key] = (metadata, annotation)

    careers = tuple(
        Career(career_id, career_names[career_id], tuple(skills.values()))
        for career_id, skills in sorted(
            skills_by_career.items(),
            key=lambda item: (career_names[item[0]].casefold(), str(item[0])),
        )
    )
    snapshot_annotations: dict[tuple[UUID, UUID], SnapshotAnnotation] = {}
    samples: dict[UUID, CareerSample] = {}
    for career_id, rows_by_pair in snapshot_rows.items():
        metadata: set[tuple[str, str, int]] = set()
        career_annotations: dict[tuple[UUID, UUID], SnapshotAnnotation] = {}
        valid = career_id not in invalid_snapshot_careers
        for pair, rows_by_id in rows_by_pair.items():
            if len(rows_by_id) != 1:
                valid = False
                continue
            row_metadata, annotation = next(iter(rows_by_id.values()))
            metadata.add(row_metadata)
            career_annotations[pair] = annotation
        if not valid or len(metadata) != 1:
            continue
        source, source_version, total_postings = next(iter(metadata))
        samples[career_id] = CareerSample(source, source_version, total_postings)
        snapshot_annotations.update(career_annotations)

    return CareerCatalog(
        careers=careers,
        provenance=provenance,
        source_version=next(iter(versions)) if len(versions) == 1 else None,
        snapshot_annotations=snapshot_annotations,
        samples=samples,
    )


class CompetencyLinksSource:
    """Read published career-linked competencies as learning-path coverage."""

    async def list_all(self, connection) -> CareerCatalog:
        source_rows = await rows(
            connection,
            "SELECT career.id AS career_id, career.title AS career_title, "
            "competency.id AS competency_id, competency.label, competency.aliases, "
            "competency.source, competency.source_version, "
            "snap.id AS snapshot_id, "
            "snap.published AS snapshot_published, "
            "snap.posting_count AS snapshot_posting_count, "
            "snap.total_postings AS snapshot_total_postings, "
            "snap.source AS snapshot_source, "
            "snap.source_version AS snapshot_source_version "
            "FROM asgard_catalog.careers AS career "
            "LEFT JOIN asgard_catalog.competency_links AS link "
            "ON link.career_id = career.id "
            "LEFT JOIN asgard_catalog.competencies AS competency "
            "ON competency.id = link.competency_id AND competency.published "
            "LEFT JOIN asgard_catalog.career_skill_snapshot AS snap "
            "ON snap.career_id = career.id "
            "AND snap.competency_id = competency.id AND snap.published "
            "WHERE career.status = 'published' "
            "ORDER BY lower(career.title), career.id, competency.id",
        )
        catalog = catalog_from_rows(source_rows)
        catalog = replace(catalog, careers=tuple(
            replace(career, skills=tuple(
                replace(skill, supporting_technologies=technology_terms(skill.label))
                for skill in career.skills
            )) for career in catalog.careers
        ))
        posting_rows = await rows(
            connection,
            "SELECT posting.career_id, posting.source, posting.source_version, "
            "posting.posting_id, posting.company, posting.job_title, "
            "posting.source_url, posting.retrieved_on, posting.skill_labels "
            "FROM asgard_catalog.career_skill_postings AS posting "
            "JOIN asgard_catalog.career_skill_posting_versions AS version "
            "ON version.source = posting.source "
            "AND version.source_version = posting.source_version "
            "AND version.status = 'published' "
            "JOIN asgard_catalog.careers AS career "
            "ON career.id = posting.career_id AND career.status = 'published' "
            "WHERE version.status = 'published' "
            "ORDER BY career.id, posting.source, posting.source_version, "
            "posting.retrieved_on DESC, posting.posting_id",
        )
        postings_by_career: dict[UUID, list[CuratedPosting]] = {}
        for row in posting_rows:
            retrieved_on = row["retrieved_on"]
            if isinstance(retrieved_on, str):
                retrieved_on = date.fromisoformat(retrieved_on)
            posting = CuratedPosting(
                source=row["source"],
                source_version=row["source_version"],
                posting_id=row["posting_id"],
                company=row["company"],
                job_title=row["job_title"],
                source_url=row["source_url"],
                retrieved_on=retrieved_on,
                skill_labels=tuple(row["skill_labels"]),
            )
            career_id = UUID(str(row["career_id"]))
            postings_by_career.setdefault(career_id, []).append(posting)
        return CareerCatalog(
            careers=catalog.careers,
            provenance=catalog.provenance,
            source_version=catalog.source_version,
            snapshot_annotations=catalog.snapshot_annotations,
            samples=catalog.samples,
            postings_by_career={
                career_id: tuple(postings)
                for career_id, postings in postings_by_career.items()
            },
        )


class SnapshotSource:
    """Rank only skills from one explicitly configured, reviewed snapshot."""

    def __init__(self, source: str, version: str):
        self.source, self.version = source.strip(), version.strip()

    async def list_all(self, connection) -> CareerCatalog:
        if not self.source or not self.version:
            raise APIError(
                503, "benchmark_unavailable", "The benchmark sample is not configured yet. "
                "You can use Learning-path skills.",
            )
        parameters = {"source": self.source, "version": self.version}
        source_rows = await rows(
            connection,
            "SELECT career.id AS career_id, career.title AS career_title, "
            "sample.* FROM asgard_catalog.careers career LEFT JOIN ("
            "SELECT snap.career_id AS sample_career_id, competency.id AS competency_id, "
            "competency.label, competency.aliases, competency.source, competency.source_version, "
            "snap.id AS snapshot_id, snap.published AS snapshot_published, "
            "snap.posting_count AS snapshot_posting_count, "
            "snap.total_postings AS snapshot_total_postings, "
            "snap.source AS snapshot_source, snap.source_version AS snapshot_source_version "
            "FROM asgard_catalog.career_skill_snapshot snap "
            "JOIN asgard_catalog.competencies competency ON competency.id=snap.competency_id "
            "AND competency.published WHERE snap.published AND snap.source=:source "
            "AND snap.source_version=:version) sample ON sample.sample_career_id=career.id "
            "WHERE career.status='published' "
            "ORDER BY lower(career.title),career.id,sample.competency_id",
            parameters,
        )
        if not any(item.get("competency_id") is not None for item in source_rows):
            raise APIError(503, "benchmark_unavailable", "The selected benchmark sample has no "
                           "published skill mappings yet. You can use Learning-path skills.")
        catalog = catalog_from_rows(source_rows)
        posting_rows = await rows(
            connection,
            "SELECT posting.* FROM asgard_catalog.career_skill_postings posting "
            "JOIN asgard_catalog.career_skill_posting_versions version "
            "ON version.source=posting.source AND version.source_version=posting.source_version "
            "JOIN asgard_catalog.careers career ON career.id=posting.career_id "
            "WHERE posting.source=:source AND posting.source_version=:version "
            "AND version.status='published' AND career.status='published' "
            "ORDER BY career.id,posting.retrieved_on DESC,posting.posting_id",
            parameters,
        )
        postings: dict[UUID, list[CuratedPosting]] = {}
        for row in posting_rows:
            postings.setdefault(UUID(str(row["career_id"])), []).append(CuratedPosting(
                source=row["source"], source_version=row["source_version"],
                posting_id=row["posting_id"], company=row["company"], job_title=row["job_title"],
                source_url=row["source_url"],
                retrieved_on=(date.fromisoformat(row["retrieved_on"])
                              if isinstance(row["retrieved_on"], str) else row["retrieved_on"]),
                skill_labels=tuple(row["skill_labels"]),
            ))
        return replace(
            catalog, source_label=self.source, source_version=self.version,
            sample_label="Benchmark sample",
            source_note="Skills mapped from reviewed sample postings, "
                        "not a comprehensive employer requirement list.",
            postings_by_career={key: tuple(value) for key, value in postings.items()},
        )
