from scripts.render_career_skill_snapshot import (
    OfflineCareer, OfflineCompetency, aggregate_rows, map_competency,
    normalize_skill, render_publish_sql, render_snapshot_sql, snapshot_uuid, sql_literal,
)


def career():
    return OfflineCareer("data-analyst", "Data Analyst", (
        OfflineCompetency("data-analyst/core-01", "Python"),
        OfflineCompetency("data-analyst/core-02", "SQL querying"),
    ))


def test_normalize_skill_matches_matcher_normalization_samples():
    samples = (" Python  Developer ", "C++\tBasics", "  DATA   ANALYST  ")
    def matcher_expression(value):
        return " ".join(value.split()).casefold()
    assert [normalize_skill(value) for value in samples] == [matcher_expression(value) for value in samples]


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
    assert "JOIN asgard_catalog.competencies AS competency ON competency.canonical_key = input.competency_key" in sql
    assert "WHERE asgard_catalog.career_skill_snapshot.published = false" in sql
    assert "false, NULL, NULL" in sql


def test_publish_sql_quotes_fields_and_filters_source_version():
    sql = render_publish_sql("O'Reilly sample", "v1", "Pat O'Neil")
    assert "reviewed_by = 'Pat O''Neil'" in sql
    assert "WHERE source = 'O''Reilly sample'" in sql
    assert "source_version = 'v1'" in sql
    assert "AND NOT published" in sql