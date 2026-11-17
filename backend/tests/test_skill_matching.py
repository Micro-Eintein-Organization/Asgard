from uuid import UUID

import pytest

from app.modules.skill_matching.matcher import (
    BenchmarkSkill,
    Career,
    ResumeEvidence,
    SkillStatus,
    UserSkillReport,
    rank_careers,
)


def uid(value: int) -> UUID:
    return UUID(int=value)


def skill(key: str = "python", label: str = "Python", aliases: tuple[str, ...] = ()) -> BenchmarkSkill:
    return BenchmarkSkill(key, label, aliases, uid(100))


def career(
    name: str = "Data Analyst",
    skills: tuple[BenchmarkSkill, ...] | None = None,
    career_id: int = 1,
) -> Career:
    return Career(uid(career_id), name, (skill(),) if skills is None else skills)


@pytest.mark.parametrize("level", [1, 2, 3, 4])
def test_positive_report_levels_are_matched(level: int):
    result = rank_careers([career()], [UserSkillReport(uid(100), level)])[0]
    assert result.skill_matches[0].status is SkillStatus.MATCHED
    assert result.skill_matches[0].reported_level == level
    assert result.n_of_N == (1, 1)


def test_level_zero_is_missing():
    result = rank_careers([career()], [UserSkillReport(uid(100), 0)])[0]
    assert result.skill_matches[0].status is SkillStatus.MISSING
    assert result.skill_matches[0].reported_level == 0


def test_saved_null_level_is_unknown():
    result = rank_careers([career()], [UserSkillReport(uid(100), None)])[0]
    assert result.skill_matches[0].status is SkillStatus.UNKNOWN
    assert result.skill_matches[0].report is not None
    assert result.skill_matches[0].reported_level is None


def test_absent_report_is_missing_and_distinct_from_unknown():
    result = rank_careers([career()])[0]
    assert result.skill_matches[0].status is SkillStatus.MISSING
    assert result.skill_matches[0].report is None


def test_resume_mention_matches_without_inventing_a_level():
    evidence = ResumeEvidence("skill", "Python", 1, "Skills: Python", uid(200))
    result = rank_careers([career()], resume_evidence=[evidence])[0]
    matched = result.skill_matches[0]
    assert matched.status is SkillStatus.MATCHED
    assert matched.report is None
    assert matched.reported_level is None
    assert matched.resume_signals[0].evidence is evidence
    assert matched.resume_signals[0].matched_phrases == ("Python",)


def test_alias_matching_ignores_case_and_whitespace():
    required = skill("typescript", "TypeScript", ("Type Script",))
    evidence = ResumeEvidence("skill", "  type   script  ", 2, "Tools: type   script")
    result = rank_careers([career(skills=(required,))], resume_evidence=[evidence])[0]
    assert result.skill_matches[0].status is SkillStatus.MATCHED
    assert result.skill_matches[0].resume_signals[0].matched_phrases == ("Type Script",)


def test_near_miss_java_does_not_match_javascript():
    required = skill("java", "Java")
    evidence = ResumeEvidence("skill", "JavaScript engineer", 1, "JavaScript engineer")
    result = rank_careers([career(skills=(required,))], resume_evidence=[evidence])[0]
    assert result.skill_matches[0].status is SkillStatus.MISSING


def test_career_ranking_uses_match_count_then_name_and_id():
    alpha_high_id = career("Alpha", (skill("a1", "Python"),), career_id=8)
    alpha_low_id = career("alpha", (skill("a2", "Python"),), career_id=3)
    beta = career("Beta", (skill("b1", "Python"),), career_id=2)
    zulu = career("Zulu", (skill("z1", "Python"), skill("z2", "SQL")), career_id=1)
    reports = [UserSkillReport(uid(100), 1)]
    first = rank_careers([beta, zulu, alpha_high_id, alpha_low_id], reports)
    second = rank_careers([alpha_low_id, alpha_high_id, zulu, beta], reports)
    expected = [uid(1), uid(3), uid(8), uid(2)]
    assert [item.career_id for item in first] == expected
    assert [item.career_id for item in second] == expected
    assert first[0].matched_skill_count == 2


def test_empty_user_data_marks_all_skills_missing():
    result = rank_careers(
        [career(skills=(skill("a", "Python"), skill("b", "SQL", ("Structured Query Language",))))]
    )[0]
    assert [item.status for item in result.skill_matches] == [
        SkillStatus.MISSING,
        SkillStatus.MISSING,
    ]
    assert result.n_of_N == (0, 2)


def test_zero_required_skills_returns_zero_of_zero():
    result = rank_careers([career(skills=())])[0]
    assert result.skill_matches == ()
    assert result.matched_skill_count == 0
    assert result.benchmark_skill_count == 0
    assert result.n_of_N == (0, 0)


def test_level_zero_plus_resume_mention_is_matched_and_keeps_both_signals():
    evidence = ResumeEvidence("skill", "Python", 1, "Skills: Python")
    result = rank_careers(
        [career()], [UserSkillReport(uid(100), 0)], [evidence]
    )[0]
    matched = result.skill_matches[0]
    assert matched.status is SkillStatus.MATCHED
    assert matched.reported_level == 0
    assert matched.resume_signals[0].evidence is evidence


def test_ambiguous_alias_is_not_assigned_to_either_skill():
    first = BenchmarkSkill("one", "First skill", ("Common",), uid(101))
    second = BenchmarkSkill("two", "Second skill", ("Common",), uid(102))
    evidence = ResumeEvidence("skill", "Common", 1, "Common")
    result = rank_careers([career(skills=(first, second))], resume_evidence=[evidence])[0]
    assert [item.status for item in result.skill_matches] == [
        SkillStatus.MISSING,
        SkillStatus.MISSING,
    ]


def test_unmapped_benchmark_rows_are_not_in_denominator():
    mapped = skill("mapped", "Python")
    unmapped = BenchmarkSkill("unmapped", "Unmapped source phrase")
    result = rank_careers([career(skills=(mapped, unmapped))])[0]
    assert [item.skill_key for item in result.skill_matches] == ["mapped"]
    assert result.n_of_N == (0, 1)
