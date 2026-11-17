"""Read-only orchestration for career skill matching."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from app.modules.skill_matching.matcher import ResumeEvidence, SkillStatus, UserSkillReport, rank_careers
from app.modules.skill_matching.schemas import (
    CareerSkillMatch,
    CareerSkillMatchResponse,
    ResumeSignal,
    SkillMatchItem,
    UserReportSignal,
)
from app.modules.skill_matching.sources import (
    SAMPLE_LABEL,
    SOURCE_LABEL,
    SOURCE_NOTE,
    CareerCatalog,
    CareerSkillSource,
    CompetencyLinksSource,
)
from app.modules.storage import rows


def _as_datetime(value) -> datetime | None:
    return value if isinstance(value, datetime) else None


def assemble_response(
    catalog: CareerCatalog,
    reports: list[UserSkillReport],
    document: dict | None,
) -> CareerSkillMatchResponse:
    """Purely combine loaded reports/evidence and source catalog into API data."""

    evidence = []
    if document is not None:
        for item in document.get("evidence") or []:
            evidence.append(
                ResumeEvidence(
                    kind=item["kind"],
                    text=item["text"],
                    page=item["page"],
                    span=item["span"],
                    document_id=document["id"],
                    analysis_id=document.get("analysis_id"),
                    revision=document.get("revision"),
                )
            )

    ranked = rank_careers(catalog.careers, reports, evidence)
    items = []
    for rank, career in enumerate(ranked, start=1):
        skills = []
        for match in career.skill_matches:
            provenance = catalog.provenance[match.competency_id]
            report = (
                UserReportSignal(level=match.report.level, updated_at=match.report.updated_at)
                if match.report is not None
                else None
            )
            signals = [
                ResumeSignal(
                    document_id=signal.evidence.document_id,
                    analysis_id=signal.evidence.analysis_id,
                    revision=signal.evidence.revision,
                    kind="skill",
                    page=signal.evidence.page,
                    text=signal.evidence.text,
                    span=signal.evidence.span,
                    matched_phrases=list(signal.matched_phrases),
                )
                for signal in match.resume_signals
            ]
            skills.append(
                SkillMatchItem(
                    competency_id=match.competency_id,
                    label=match.label,
                    source=provenance.source,
                    source_version=provenance.source_version,
                    status=match.status.value,
                    reported_level=match.reported_level,
                    user_report=report,
                    resume_signals=signals,
                )
            )
        items.append(
            CareerSkillMatch(
                career_id=career.career_id,
                career_title=career.career_name,
                rank=rank,
                matched_skill_count=career.matched_skill_count,
                benchmark_skill_count=career.benchmark_skill_count,
                display_count=f"{career.matched_skill_count} of {career.benchmark_skill_count}",
                skills=skills,
                sample_note=SOURCE_NOTE,
            )
        )
    return CareerSkillMatchResponse(
        source=SOURCE_LABEL,
        source_version=catalog.source_version,
        sample_label=SAMPLE_LABEL,
        items=items,
    )


async def get_career_skill_matches(
    connection,
    user_id: UUID,
    source: CareerSkillSource | None = None,
) -> CareerSkillMatchResponse:
    """Load only authenticated user's reports and active document evidence."""

    career_source = source or CompetencyLinksSource()
    catalog = await career_source.list_all(connection)
    report_rows = await rows(
        connection,
        "SELECT competency_id, level, updated_at "
        "FROM asgard_private.user_competencies "
        "WHERE user_id = CAST(:uid AS uuid)",
        {"uid": str(user_id)},
    )
    reports = [
        UserSkillReport(
            competency_id=UUID(str(row["competency_id"])),
            level=row["level"],
            updated_at=_as_datetime(row["updated_at"]),
        )
        for row in report_rows
    ]
    document_rows = await rows(
        connection,
        "SELECT id, analysis_id, revision, evidence "
        "FROM asgard_private.documents "
        "WHERE user_id = CAST(:uid AS uuid) AND status = 'active' "
        "ORDER BY created_at DESC, id DESC LIMIT 1",
        {"uid": str(user_id)},
    )
    document = document_rows[0] if document_rows else None
    return assemble_response(catalog, reports, document)
