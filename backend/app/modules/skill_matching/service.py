"""Read-only orchestration for career skill matching."""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from app.modules.skill_matching import interpretation
from app.modules.skill_matching.matcher import (
    ResumeEvidence,
    UserSkillReport,
    matching_resume_evidence,
    rank_careers,
)
from app.modules.skill_matching.schemas import (
    CareerPosting,
    CareerSkillMatch,
    CareerSkillMatchResponse,
    InterpretationSignal,
    LearningSignal,
    PostingResumeMatch,
    PostingSkill,
    ResumeSignal,
    SkillMatchItem,
    UserReportSignal,
)
from app.modules.skill_matching.sources import (
    POSTINGS_SAMPLE_LABEL,
    CareerCatalog,
    CareerSkillSource,
    CompetencyLinksSource,
)
from app.modules.storage import rows

SMALL_SAMPLE_MAX = 2  # placeholder, team decision pending


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
            annotation = catalog.snapshot_annotations.get(
                (career.career_id, match.competency_id)
            )
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
                    posting_count=(annotation.posting_count if annotation else None),
                    total_postings=(annotation.total_postings if annotation else None),
                )
            )
        sample = catalog.samples.get(career.career_id)
        sample_label = catalog.sample_label
        if sample is not None:
            posting_unit = "posting" if sample.total_postings == 1 else "postings"
            sample_label = (
                f"{sample.source} ({sample.source_version}): "
                f"{sample.total_postings} {posting_unit}"
            )
            if sample.total_postings <= SMALL_SAMPLE_MAX:
                sample_label += " - very small sample"
        postings = []
        for posting in catalog.postings_by_career.get(career.career_id, ()):
            posting_skills = []
            for label in posting.skill_labels:
                matches = matching_resume_evidence(label, evidence)
                resume_match = (
                    PostingResumeMatch(
                        matched_phrase=label,
                        pages=sorted({item.page for item in matches}),
                    )
                    if matches
                    else None
                )
                posting_skills.append(PostingSkill(label=label, resume_match=resume_match))
            postings.append(
                CareerPosting(
                    source=posting.source,
                    source_version=posting.source_version,
                    posting_id=posting.posting_id,
                    company=posting.company,
                    job_title=posting.job_title,
                    source_url=posting.source_url,
                    retrieved_on=posting.retrieved_on,
                    skills=posting_skills,
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
                sample_note=catalog.source_note,
                sample_label=sample_label,
                postings=postings,
            )
        )
    return CareerSkillMatchResponse(
        source=catalog.source_label,
        source_version=catalog.source_version,
        sample_label=catalog.sample_label,
        postings_sample_label=POSTINGS_SAMPLE_LABEL,
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
    response = assemble_response(catalog, reports, document)
    state, mappings = await interpretation.saved_state(connection, user_id, document)
    response.interpretation = state
    learning = []
    if isinstance(career_source, CompetencyLinksSource):
        learning = await rows(connection,
            "SELECT DISTINCT l.career_id,l.competency_id,p.roadmap_id,p.topic_id,t.title "
            "FROM asgard_private.topic_progress p "
            "JOIN asgard_catalog.competency_links l ON l.roadmap_id=p.roadmap_id "
            "AND l.topic_id=p.topic_id "
            "JOIN asgard_catalog.topics t ON t.roadmap_id=p.roadmap_id AND t.id=p.topic_id "
            "JOIN asgard_catalog.milestones m ON m.roadmap_id=t.roadmap_id AND m.id=t.milestone_id "
            "JOIN asgard_catalog.roadmaps r ON r.id=p.roadmap_id AND r.career_id=l.career_id "
            "WHERE p.user_id=CAST(:uid AS uuid) AND p.status='done' "
            "AND r.status='published' AND t.retired_at IS NULL AND m.retired_at IS NULL "
            "AND (t.branch_id IS NULL OR EXISTS(SELECT 1 FROM asgard_private.branch_choices b "
            "WHERE b.user_id=p.user_id AND b.roadmap_id=p.roadmap_id AND b.branch_id=t.branch_id))",
            {"uid": str(user_id)})
    for career in response.items:
        for skill in career.skills:
            skill.learning_signals = [LearningSignal(
                roadmap_id=item["roadmap_id"], topic_id=item["topic_id"], title=item["title"],
            ) for item in learning if item["career_id"] == career.career_id
                and item["competency_id"] == skill.competency_id]
            for mapping in mappings:
                if mapping["competency_id"] != str(skill.competency_id):
                    continue
                index = mapping["evidence_index"]
                evidence = document["evidence"] if document else []
                if (not 0 <= index < len(evidence)
                        or mapping["quote"] not in evidence[index]["text"]):
                    continue
                item = evidence[index]
                skill.interpretation_signals.append(InterpretationSignal(
                    page=item["page"], text=mapping["quote"], span=item["span"],
                ))
            skill.evidence_found = skill.status == "MATCHED" or bool(
                skill.learning_signals or skill.interpretation_signals,
            )
        career.evidence_count = sum(skill.evidence_found for skill in career.skills)
    return response
