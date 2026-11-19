import sys
from pathlib import Path

import pytest

import scripts.render_career_skill_snapshot as renderer
from scripts.render_career_skill_snapshot import (
    EXPECTED_ALIAS_HEADER,
    EXPECTED_HEADER,
    OfflineCareer,
    OfflineCompetency,
    aggregate_rows,
    load_aliases,
    map_competency,
    normalize_skill,
    output_paths,
    render_publish_sql,
    render_snapshot_sql,
    snapshot_uuid,
    sql_literal,
    validate_posting_reviewers,
)


def career():
    return OfflineCareer("data-analyst", "Data Analyst", (
        OfflineCompetency("data-analyst/core-01", "Python"),
        OfflineCompetency("data-analyst/core-02", "SQL querying"),
    ))


def write_alias_csv(path, rows, header=EXPECTED_ALIAS_HEADER):
    path.write_text(
        ",".join(header) + "\n" + "".join(",".join(row) + "\n" for row in rows),
        encoding="utf-8-sig",
    )


def write_postings_csv(path, reviewer="Reviewer", status="verified"):
    values = (
        "posting-1", "Data Analyst", "Example Co", "https://example.com/job/1",
        "2026-11-18", "Python|SQL", "Data Analyst", "Collector", reviewer, status,
    )
    path.write_text(
        ",".join(EXPECTED_HEADER) + "\n" + ",".join(values) + "\n",
        encoding="utf-8",
    )


def test_placeholder_reviewers_are_rejected_by_default(tmp_path):
    aliases_path = tmp_path / "aliases.csv"
    write_alias_csv(
        aliases_path,
        [("data-analyst", "data-analyst/core-01", "Py", " TBD ")],
    )
    with pytest.raises(ValueError, match="Alias CSV row 2:.*placeholder"):
        load_aliases(aliases_path, (career(),))

    postings_path = tmp_path / "postings.csv"
    write_postings_csv(postings_path, reviewer=" N/A ")
    with pytest.raises(ValueError, match="Postings CSV row 2:.*placeholder"):
        validate_posting_reviewers(postings_path, allow_placeholder_reviewers=False)


def test_placeholder_reviewers_are_allowed_with_flag(tmp_path):
    aliases_path = tmp_path / "aliases.csv"
    write_alias_csv(
        aliases_path,
        [("data-analyst", "data-analyst/core-01", "Py", " TBD ")],
    )
    careers, _ = load_aliases(
        aliases_path, (career(),), allow_placeholder_reviewers=True
    )
    assert careers[0].competencies[0].aliases == ("Py",)

    postings_path = tmp_path / "postings.csv"
    write_postings_csv(postings_path, reviewer=" N/A ")
    validate_posting_reviewers(postings_path, allow_placeholder_reviewers=True)


def test_placeholder_reviewer_flag_prefixes_output_names(tmp_path, monkeypatch):
    monkeypatch.setattr(renderer, "OUTPUT_DIR", tmp_path)

    paths = output_paths(Path("sample.v2.csv"), allow_placeholder_reviewers=True)

    assert [path.name for path in paths] == [
        "SCRATCH-sample.v2.snapshot.sql",
        "SCRATCH-sample.v2.unmapped.csv",
        "SCRATCH-sample.v2.publish.sql",
    ]


def test_placeholder_reviewer_flag_cannot_be_used_for_publish(monkeypatch):
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "render_career_skill_snapshot.py",
            "postings.csv",
            "--source",
            "test",
            "--source-version",
            "v1",
            "--allow-placeholder-reviewers",
            "--publish-reviewed",
            "--reviewer",
            "Reviewer",
        ],
    )

    with pytest.raises(SystemExit, match="2"):
        renderer.main()


def test_aliases_argument_path_is_passed_to_alias_loader(tmp_path, monkeypatch):
    postings_path = tmp_path / "postings.csv"
    write_postings_csv(postings_path)
    aliases_path = tmp_path / "custom-aliases.csv"
    output_dir = tmp_path / "output"
    observed = {}
    original_load_aliases = renderer.load_aliases

    def recording_load_aliases(path, careers, allow_placeholder_reviewers=False):
        observed["path"] = path
        observed["allow_placeholder_reviewers"] = allow_placeholder_reviewers
        return original_load_aliases(path, careers, allow_placeholder_reviewers)

    monkeypatch.setattr(renderer, "OUTPUT_DIR", output_dir)
    monkeypatch.setattr(renderer, "_load_validator", lambda: lambda _path: 0)
    monkeypatch.setattr(renderer, "load_offline_careers", lambda: (career(),))
    monkeypatch.setattr(renderer, "load_aliases", recording_load_aliases)
    monkeypatch.setattr(
        sys,
        "argv",
        [
            "render_career_skill_snapshot.py",
            str(postings_path),
            "--source",
            "test",
            "--source-version",
            "v1",
            "--aliases",
            str(aliases_path),
        ],
    )

    assert renderer.main() == 0
    assert observed == {
        "path": aliases_path,
        "allow_placeholder_reviewers": False,
    }


def test_normalize_skill_matches_matcher_normalization_samples():
    samples = (" Python  Developer ", "C++\tBasics", "  DATA   ANALYST  ")
    def matcher_expression(value):
        return " ".join(value.split()).casefold()
    assert [normalize_skill(value) for value in samples] == [
        matcher_expression(value) for value in samples
    ]


def test_uuid_is_stable_and_uses_all_identity_fields():
    first = snapshot_uuid("data-analyst", "data-analyst/core-01", "sample-v1")
    assert first == snapshot_uuid("data-analyst", "data-analyst/core-01", "sample-v1")
    assert first != snapshot_uuid("data-analyst", "data-analyst/core-01", "sample-v2")


def test_sql_literal_escapes_apostrophes():
    assert sql_literal("O'Reilly") == "'O''Reilly'"


def test_skill_mapping_is_exact_and_reports_unmapped_or_ambiguous():
    item = career()
    assert map_competency(" python ", item) == (item.competencies[0], None)
    assert map_competency("Pythonista", item) == (None, "unmapped skill")
    ambiguous = OfflineCareer(item.key, item.title, item.competencies + (
        OfflineCompetency("data-analyst/core-03", "Python"),))
    assert map_competency("Python", ambiguous) == (None, "ambiguous skill")


def test_reviewed_alias_loads_and_exact_duplicate_row_is_reported_and_ignored(tmp_path):
    path = tmp_path / "competency_aliases.csv"
    row = ("data-analyst", "data-analyst/core-02", " SQL   reports ", "Reviewer A")
    write_alias_csv(path, [row, row])

    careers, duplicate_rows = load_aliases(path, (career(),))

    assert duplicate_rows == (3,)
    assert careers[0].competencies[1].aliases == ("SQL   reports",)
    assert map_competency(" sql reports ", careers[0]) == (careers[0].competencies[1], None)


@pytest.mark.parametrize(
    ("row", "message"),
    [
        (
            ("data-analyst", "data-analyst/core-99", "Excel", "Reviewer"),
            "not an offline competency",
        ),
        (("other-career", "data-analyst/core-01", "Python", "Reviewer"), "prefix"),
        (("data-analyst", "data-analyst/core-01", "   ", "Reviewer"), "alias must not be blank"),
        (
            ("data-analyst", "data-analyst/core-01", "Python", "   "),
            "reviewed_by must not be blank",
        ),
    ],
)
def test_alias_validation_errors_include_csv_row_number(tmp_path, row, message):
    path = tmp_path / "competency_aliases.csv"
    write_alias_csv(path, [row])

    with pytest.raises(ValueError, match=rf"row 2: .*{message}"):
        load_aliases(path, (career(),))


def test_alias_file_requires_exact_header(tmp_path):
    path = tmp_path / "competency_aliases.csv"
    write_alias_csv(path, [], header=("competency_key", "career_slug", "alias", "reviewed_by"))

    with pytest.raises(ValueError, match="row 1: header must exactly match"):
        load_aliases(path, (career(),))


def test_alias_with_same_normalized_phrase_for_two_competencies_is_rejected(tmp_path):
    path = tmp_path / "competency_aliases.csv"
    write_alias_csv(path, [
        ("data-analyst", "data-analyst/core-01", "Query", "Reviewer A"),
        ("data-analyst", "data-analyst/core-02", " query ", "Reviewer B"),
    ])

    with pytest.raises(ValueError, match="row 3: normalized alias maps to two competencies"):
        load_aliases(path, (career(),))


def test_alias_matching_a_different_competency_label_remains_ambiguous(tmp_path):
    path = tmp_path / "competency_aliases.csv"
    write_alias_csv(path, [
        ("data-analyst", "data-analyst/core-01", "SQL querying", "Reviewer A"),
    ])

    careers, _ = load_aliases(path, (career(),))

    assert map_competency("SQL querying", careers[0]) == (None, "ambiguous skill")


def test_missing_alias_file_preserves_existing_mapping_behavior(tmp_path):
    original = (career(),)

    careers, duplicate_rows = load_aliases(tmp_path / "does-not-exist.csv", original)

    assert careers is original
    assert duplicate_rows == ()
    assert map_competency("Python alias", careers[0]) == (None, "unmapped skill")


def test_unmapped_report_ranks_skills_by_verified_posting_count():
    records = [
        {"posting_id": "p1", "review_status": "verified", "asgard_career_proposed": "Data Analyst",
         "skills": "Need A|Need B|need b"},
        {"posting_id": "p2", "review_status": "verified", "asgard_career_proposed": "Data Analyst",
         "skills": "Need B|Python"},
    ]

    _, report, _ = aggregate_rows(records, (career(),), "sample-v1")

    ranked = [row for row in report if row["section"] == "ranked_unmapped_skills"]
    assert [(row["rank"], row["skill"], row["verified_postings"]) for row in ranked] == [
        ("1", "Need B", "2"),
        ("2", "Need A", "1"),
    ]


def test_summary_reports_verified_skill_mention_mapping_ratio():
    records = [
        {"posting_id": "p1", "review_status": "verified", "asgard_career_proposed": "Data Analyst",
         "skills": "Python|Unknown"},
        {
            "posting_id": "p2",
            "review_status": "verified",
            "asgard_career_proposed": "Unknown Career",
            "skills": "Other A|Other B",
        },
        {"posting_id": "p3", "review_status": "pending", "asgard_career_proposed": "Data Analyst",
         "skills": "Python|SQL querying"},
    ]

    _, _, summary = aggregate_rows(records, (career(),), "sample-v1")

    assert summary["total_skill_mentions"] == 4
    assert summary["mapped_skill_mentions"] == 1
    assert summary["mapped_ratio"] == 0.25


def test_summary_mapping_ratio_is_zero_when_there_are_no_verified_skill_mentions():
    _, _, summary = aggregate_rows([], (career(),), "sample-v1")

    assert summary["total_skill_mentions"] == 0
    assert summary["mapped_skill_mentions"] == 0
    assert summary["mapped_ratio"] == 0.0


def test_aggregation_counts_each_skill_once_per_verified_posting():
    records = [
        {"posting_id": "p1", "review_status": "verified", "asgard_career_proposed": "Data Analyst",
         "skills": "Python| python |SQL querying|Unknown"},
        {"posting_id": "p2", "review_status": "verified", "asgard_career_proposed": "data-analyst",
         "skills": "Python|SQL querying"},
        {"posting_id": "p3", "review_status": "pending", "asgard_career_proposed": "Data Analyst",
         "skills": "Python|SQL querying"},
    ]
    rows, report, summary = aggregate_rows(records, (career(),), "sample-v1")
    counts = {row.competency_key: (row.posting_count, row.total_postings) for row in rows}
    assert counts == {"data-analyst/core-01": (2, 2), "data-analyst/core-02": (2, 2)}
    assert summary["pending"] == 1
    assert summary["unmapped_or_ambiguous_skills"] == 1
    assert any(entry["posting_id"] == "p3" for entry in report)


def test_rendered_sql_guards_keys_and_never_updates_published_rows():
    rows = aggregate_rows([{"posting_id": "p1", "review_status": "verified",
        "asgard_career_proposed": "Data Analyst", "skills": "Python|SQL querying"}],
        (career(),), "sample-v1")[0]
    sql = render_snapshot_sql(rows, "posting sample", "sample-v1")
    assert "RAISE EXCEPTION" in sql
    assert "JOIN asgard_catalog.careers AS career ON career.slug = input.career_key" in sql
    assert (
        "JOIN asgard_catalog.competencies AS competency "
        "ON competency.canonical_key = input.competency_key"
    ) in sql
    assert "WHERE asgard_catalog.career_skill_snapshot.published = false" in sql
    assert "false, NULL, NULL" in sql


def test_publish_sql_quotes_fields_and_filters_source_version():
    sql = render_publish_sql("O'Reilly sample", "v1", "Pat O'Neil")
    assert "reviewed_by = 'Pat O''Neil'" in sql
    assert "WHERE source = 'O''Reilly sample'" in sql
    assert "source_version = 'v1'" in sql
    assert "AND NOT published" in sql
