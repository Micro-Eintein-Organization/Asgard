"""Pure, deterministic matching of user skill signals to career benchmark skills.

Reports match by canonical competency ID. Resume evidence matches exact
canonical labels or unambiguous aliases as case-insensitive phrases with
normalized whitespace and phrase boundaries. A resume mention never supplies
or changes a reported level. Missing and unknown reports remain distinct.

Careers rank by matched-skill count descending, then career name
case-insensitively ascending, then career ID ascending. The latter two keys
make ties deterministic without introducing a score or percentage.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Literal, Sequence
from uuid import UUID


class SkillStatus(str, Enum):
    MATCHED = "MATCHED"
    UNKNOWN = "UNKNOWN"
    MISSING = "MISSING"


EvidenceKind = Literal["skill", "education", "experience", "project"]


@dataclass(frozen=True, slots=True)
class BenchmarkSkill:
    """One distinct benchmark skill; unmapped snapshot rows are ineligible."""

    skill_key: str
    label: str
    aliases: tuple[str, ...] = ()
    competency_id: UUID | None = None


@dataclass(frozen=True, slots=True)
class Career:
    career_id: UUID
    name: str
    skills: tuple[BenchmarkSkill, ...]


@dataclass(frozen=True, slots=True)
class UserSkillReport:
    competency_id: UUID
    level: int | None
    updated_at: datetime | None = None


@dataclass(frozen=True, slots=True)
class ResumeEvidence:
    kind: EvidenceKind
    text: str
    page: int
    span: str
    document_id: UUID | None = None
    analysis_id: UUID | None = None
    revision: int | None = None


@dataclass(frozen=True, slots=True)
class ResumeSignal:
    evidence: ResumeEvidence
    matched_phrases: tuple[str, ...]


@dataclass(frozen=True, slots=True)
class SkillMatch:
    skill_key: str
    competency_id: UUID
    label: str
    status: SkillStatus
    report: UserSkillReport | None
    resume_signals: tuple[ResumeSignal, ...]

    @property
    def reported_level(self) -> int | None:
        """Return the saved level only; resume mentions never infer a level."""

        return self.report.level if self.report is not None else None


@dataclass(frozen=True, slots=True)
class CareerMatch:
    career_id: UUID
    career_name: str
    skill_matches: tuple[SkillMatch, ...]
    matched_skill_count: int
    benchmark_skill_count: int

    @property
    def n_of_N(self) -> tuple[int, int]:
        """Return the display count as its two integer components."""

        return self.matched_skill_count, self.benchmark_skill_count


def _normalize_phrase(value: str) -> str:
    return " ".join(value.split()).casefold()


def _phrase_pattern(phrase: str) -> re.Pattern[str]:
    parts = _normalize_phrase(phrase).split()
    expression = r"\s+".join(re.escape(part) for part in parts)
    return re.compile(r"(?<![\w.+#])" + expression + r"(?![\w+#])", re.IGNORECASE)


def matching_resume_evidence(
    phrase: str, evidence: Sequence[ResumeEvidence]
) -> tuple[ResumeEvidence, ...]:
    """Return skill evidence containing the same exact phrase used by career matching."""
    pattern = _phrase_pattern(phrase)
    return tuple(
        item for item in evidence
        if item.kind == "skill" and pattern.search(item.text)
    )


def _eligible_skills(skills: Sequence[BenchmarkSkill]) -> tuple[BenchmarkSkill, ...]:
    by_key: dict[str, BenchmarkSkill] = {}
    for skill in skills:
        if skill.competency_id is None:
            continue
        previous = by_key.get(skill.skill_key)
        if previous is not None and previous != skill:
            raise ValueError(f"Conflicting benchmark skill rows for {skill.skill_key!r}")
        by_key[skill.skill_key] = skill
    return tuple(by_key[key] for key in sorted(by_key))


def _unambiguous_phrases(
    skills: Sequence[BenchmarkSkill],
) -> dict[str, tuple[str, ...]]:
    owners: dict[str, set[UUID]] = {}
    for skill in skills:
        if skill.competency_id is None:
            continue
        for phrase in (skill.label, *skill.aliases):
            normalized = _normalize_phrase(phrase)
            if normalized:
                owners.setdefault(normalized, set()).add(skill.competency_id)

    phrases: dict[str, list[str]] = {skill.skill_key: [] for skill in skills}
    for skill in skills:
        candidates = sorted(
            {skill.label, *skill.aliases},
            key=lambda phrase: (phrase != skill.label, _normalize_phrase(phrase), phrase),
        )
        for phrase in candidates:
            normalized = _normalize_phrase(phrase)
            if normalized and owners[normalized] == {skill.competency_id}:
                phrases[skill.skill_key].append(phrase)
    return {skill_key: tuple(values) for skill_key, values in phrases.items()}


def _resume_signals(
    phrases: Sequence[str],
    evidence: Sequence[ResumeEvidence],
) -> tuple[ResumeSignal, ...]:
    patterns = tuple((phrase, _phrase_pattern(phrase)) for phrase in phrases)
    signals: list[ResumeSignal] = []
    for item in evidence:
        if item.kind != "skill":
            continue
        matched = tuple(phrase for phrase, pattern in patterns if pattern.search(item.text))
        if matched:
            signals.append(ResumeSignal(evidence=item, matched_phrases=matched))
    return tuple(signals)


def _reports_by_competency(
    reports: Sequence[UserSkillReport],
) -> dict[UUID, UserSkillReport]:
    by_competency: dict[UUID, UserSkillReport] = {}
    for report in reports:
        if report.level is not None and not 0 <= report.level <= 4:
            raise ValueError("Reported skill level must be null or between 0 and 4")
        if report.competency_id in by_competency:
            raise ValueError(f"Duplicate report for competency {report.competency_id}")
        by_competency[report.competency_id] = report
    return by_competency


def rank_careers(
    careers: Sequence[Career],
    reports: Sequence[UserSkillReport] = (),
    resume_evidence: Sequence[ResumeEvidence] = (),
) -> tuple[CareerMatch, ...]:
    """Classify each mapped benchmark skill and rank careers deterministically.

    A level 1-4 report or any exact skill-evidence mention yields MATCHED.
    Otherwise a saved null-level report yields UNKNOWN; an absent or level-0
    report yields MISSING. Resume evidence is retained but never assigns a
    proficiency level. Unmapped benchmark rows are excluded from N. Repeated
    identical skill_key rows count once; conflicting rows raise ValueError.

    Ranking is matched count descending, career name case-insensitively
    ascending, then career UUID ascending. Empty careers return 0 of 0.
    """

    report_index = _reports_by_competency(reports)
    seen_careers: set[UUID] = set()
    results: list[CareerMatch] = []

    for career in careers:
        if career.career_id in seen_careers:
            raise ValueError(f"Duplicate career ID {career.career_id}")
        seen_careers.add(career.career_id)

        skills = _eligible_skills(career.skills)
        phrases = _unambiguous_phrases(skills)
        skill_matches: list[SkillMatch] = []
        for benchmark_skill in skills:
            competency_id = benchmark_skill.competency_id
            if competency_id is None:
                continue
            report = report_index.get(competency_id)
            signals = _resume_signals(phrases[benchmark_skill.skill_key], resume_evidence)
            if (report is not None and report.level is not None and report.level >= 1) or signals:
                status = SkillStatus.MATCHED
            elif report is not None and report.level is None:
                status = SkillStatus.UNKNOWN
            else:
                status = SkillStatus.MISSING
            skill_matches.append(
                SkillMatch(
                    skill_key=benchmark_skill.skill_key,
                    competency_id=competency_id,
                    label=benchmark_skill.label,
                    status=status,
                    report=report,
                    resume_signals=signals,
                )
            )

        matches = tuple(skill_matches)
        matched_count = sum(item.status is SkillStatus.MATCHED for item in matches)
        results.append(
            CareerMatch(
                career_id=career.career_id,
                career_name=career.name,
                skill_matches=matches,
                matched_skill_count=matched_count,
                benchmark_skill_count=len(matches),
            )
        )

    return tuple(
        sorted(
            results,
            key=lambda result: (
                -result.matched_skill_count,
                result.career_name.casefold(),
                str(result.career_id),
            ),
        )
    )
