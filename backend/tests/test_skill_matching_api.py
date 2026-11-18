from datetime import datetime, timezone
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from app.modules.skill_matching.matcher import UserSkillReport
from app.modules.skill_matching.service import assemble_response
from app.modules.skill_matching.sources import (
    SAMPLE_LABEL,
    SOURCE_LABEL,
    SOURCE_NOTE,
    CareerCatalog,
    CareerSample,
    SkillProvenance,
    SnapshotAnnotation,
    catalog_from_rows,
)


def source_row(
    career_id,
    career_title,
    competency_id,
    label,
    *,
    snapshot_id=None,
    posting_count=None,
    total_postings=None,
    snapshot_source=None,
    snapshot_version=None,
    snapshot_published=None,
):
    row = {
        "career_id": career_id,
        "career_title": career_title,
        "competency_id": competency_id,
        "label": label,
        "aliases": [],
        "source": "catalog",
        "source_version": "catalog-v1",
    }
    if snapshot_published is not None:
        row.update(
            {
                "snapshot_id": snapshot_id,
                "snapshot_published": snapshot_published,
                "snapshot_posting_count": posting_count,
                "snapshot_total_postings": total_postings,
                "snapshot_source": snapshot_source,
                "snapshot_source_version": snapshot_version,
            }
        )
    return row


def test_source_rows_preserve_all_published_careers_and_skill_provenance():
    career_id, empty_id, competency_id = uuid4(), uuid4(), uuid4()
    catalog = catalog_from_rows(
        [
            {
                "career_id": career_id,
                "career_title": "Analyst",
                "competency_id": competency_id,
                "label": "Python",
                "aliases": ["Py"],
                "source": "reviewed",
                "source_version": "v1",
            },
            {"career_id": empty_id, "career_title": "Zero Skill Career", "competency_id": None},
        ]
    )

    assert {career.career_id for career in catalog.careers} == {career_id, empty_id}
    assert catalog.source_version == "v1"
    assert catalog.provenance[competency_id] == SkillProvenance("reviewed", "v1")


def test_snapshot_annotations_attach_to_the_correct_career_and_skill():
    first_career, second_career, shared_skill, first_only = (uuid4() for _ in range(4))
    catalog = catalog_from_rows(
        [
            source_row(
                first_career,
                "Alpha",
                shared_skill,
                "Python",
                snapshot_id=uuid4(),
                posting_count=1,
                total_postings=3,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=True,
            ),
            source_row(
                first_career,
                "Alpha",
                first_only,
                "SQL",
                snapshot_id=uuid4(),
                posting_count=2,
                total_postings=3,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=True,
            ),
            source_row(
                second_career,
                "Beta",
                shared_skill,
                "Python",
                snapshot_id=uuid4(),
                posting_count=4,
                total_postings=7,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=True,
            ),
        ]
    )

    assert catalog.snapshot_annotations == {
        (first_career, shared_skill): SnapshotAnnotation(1, 3),
        (first_career, first_only): SnapshotAnnotation(2, 3),
        (second_career, shared_skill): SnapshotAnnotation(4, 7),
    }
    assert catalog.samples == {
        first_career: CareerSample("posting sample", "v1", 3),
        second_career: CareerSample("posting sample", "v1", 7),
    }
    response = assemble_response(catalog, [], None).model_dump(mode="json")
    careers = {item["career_title"]: item for item in response["items"]}
    alpha_skills = {item["label"]: item for item in careers["Alpha"]["skills"]}
    beta_skill = careers["Beta"]["skills"][0]
    assert alpha_skills["Python"]["posting_count"] == 1
    assert alpha_skills["Python"]["total_postings"] == 3
    assert alpha_skills["SQL"]["posting_count"] == 2
    assert beta_skill["posting_count"] == 4
    assert beta_skill["total_postings"] == 7


def test_absent_or_unpublished_snapshot_rows_keep_null_counts_and_fallback_label():
    career_id, absent_skill, unpublished_skill = uuid4(), uuid4(), uuid4()
    catalog = catalog_from_rows(
        [
            source_row(career_id, "Analyst", absent_skill, "Python"),
            source_row(
                career_id,
                "Analyst",
                unpublished_skill,
                "SQL",
                snapshot_id=uuid4(),
                posting_count=1,
                total_postings=5,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=False,
            ),
        ]
    )

    response = assemble_response(catalog, [], None).model_dump(mode="json")
    item = response["items"][0]
    assert item["sample_label"] == SAMPLE_LABEL
    assert all(skill["posting_count"] is None for skill in item["skills"])
    assert all(skill["total_postings"] is None for skill in item["skills"])


@pytest.mark.parametrize("problem", ["inconsistent_total", "duplicate_source_version"])
def test_inconsistent_or_duplicate_snapshot_rows_disable_career_annotations(problem):
    career_id, first_skill, second_skill = uuid4(), uuid4(), uuid4()
    rows = [
        source_row(
            career_id,
            "Analyst",
            first_skill,
            "Python",
            snapshot_id=uuid4(),
            posting_count=1,
            total_postings=3,
            snapshot_source="posting sample",
            snapshot_version="v1",
            snapshot_published=True,
        )
    ]
    if problem == "inconsistent_total":
        rows.append(
            source_row(
                career_id,
                "Analyst",
                second_skill,
                "SQL",
                snapshot_id=uuid4(),
                posting_count=1,
                total_postings=4,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=True,
            )
        )
    else:
        rows.extend(
            [
                source_row(
                    career_id,
                    "Analyst",
                    first_skill,
                    "Python",
                    snapshot_id=uuid4(),
                    posting_count=2,
                    total_postings=3,
                    snapshot_source="posting sample",
                    snapshot_version="v1",
                    snapshot_published=True,
                ),
                source_row(career_id, "Analyst", second_skill, "SQL"),
            ]
        )

    catalog = catalog_from_rows(rows)

    assert career_id not in catalog.samples
    assert catalog.snapshot_annotations == {}
    response = assemble_response(catalog, [], None).model_dump(mode="json")
    item = response["items"][0]
    assert item["sample_label"] == SAMPLE_LABEL
    assert all(skill["posting_count"] is None for skill in item["skills"])


@pytest.mark.parametrize("total_postings", [1, 2])
def test_small_sample_labels_have_no_percentages(total_postings):
    career_id, competency_id = uuid4(), uuid4()
    catalog = catalog_from_rows(
        [
            source_row(
                career_id,
                "Analyst",
                competency_id,
                "Python",
                snapshot_id=uuid4(),
                posting_count=1,
                total_postings=total_postings,
                snapshot_source="posting sample",
                snapshot_version="v1",
                snapshot_published=True,
            )
        ]
    )

    response = assemble_response(catalog, [], None).model_dump(mode="json")

    posting_unit = "posting" if total_postings == 1 else "postings"
    assert response["items"][0]["sample_label"] == (
        f"posting sample (v1): {total_postings} {posting_unit} - very small sample"
    )
    assert "%" not in str(response)


def test_career_with_no_published_competencies_is_returned_with_zero_of_zero():
    career_id = uuid4()
    catalog = catalog_from_rows(
        [
            {
                "career_id": career_id,
                "career_title": "Empty Career",
                "competency_id": None,
            }
        ]
    )

    response = assemble_response(catalog, [], None).model_dump(mode="json")

    assert len(response["items"]) == 1
    assert response["items"][0]["career_title"] == "Empty Career"
    assert response["items"][0]["benchmark_skill_count"] == 0
    assert response["items"][0]["matched_skill_count"] == 0
    assert response["items"][0]["display_count"] == "0 of 0"


def test_snapshot_annotations_do_not_change_ranking_or_matched_counts():
    first_career, second_career = uuid4(), uuid4()
    first_matched, first_missing, second_matched, second_missing = (
        uuid4(), uuid4(), uuid4(), uuid4()
    )
    rows = [
        source_row(first_career, "Alpha", first_matched, "Python"),
        source_row(first_career, "Alpha", first_missing, "SQL"),
        source_row(second_career, "Beta", second_matched, "Python"),
        source_row(second_career, "Beta", second_missing, "SQL"),
    ]
    annotated_rows = [dict(row) for row in rows]
    snapshot_data = [
        (first_matched, 1),
        (first_missing, 2),
        (second_matched, 2),
        (second_missing, 3),
    ]
    for row, (competency_id, count) in zip(annotated_rows, snapshot_data, strict=True):
        row.update(
            {
                "snapshot_id": uuid4(),
                "snapshot_published": True,
                "snapshot_posting_count": count,
                "snapshot_total_postings": 5,
                "snapshot_source": "posting sample",
                "snapshot_source_version": "v1",
            }
        )
        assert row["competency_id"] == competency_id

    reports = [
        UserSkillReport(first_matched, 1),
        UserSkillReport(second_matched, 1),
        UserSkillReport(second_missing, 2),
    ]
    baseline = assemble_response(
        catalog_from_rows(rows), reports, None
    ).model_dump(mode="json")["items"]
    annotated = assemble_response(
        catalog_from_rows(annotated_rows), reports, None
    ).model_dump(mode="json")["items"]
    def summary(items):
        return [
            (item["career_title"], item["rank"], item["matched_skill_count"])
            for item in items
        ]

    assert summary(baseline) == summary(annotated)
    assert summary(annotated) == [("Beta", 1, 2), ("Alpha", 2, 1)]


def test_service_response_has_statuses_n_of_n_and_no_numeric_score():
    career_id, competency_id, unknown_id = uuid4(), uuid4(), uuid4()
    catalog = CareerCatalog(
        careers=catalog_from_rows(
            [
                {
                    "career_id": career_id,
                    "career_title": "Analyst",
                    "competency_id": competency_id,
                    "label": "Python",
                    "aliases": ["Py"],
                    "source": "reviewed",
                    "source_version": "v1",
                },
                {
                    "career_id": career_id,
                    "career_title": "Analyst",
                    "competency_id": unknown_id,
                    "label": "SQL",
                    "aliases": [],
                    "source": "reviewed",
                    "source_version": "v1",
                },
            ]
        ).careers,
        provenance={
            competency_id: SkillProvenance("reviewed", "v1"),
            unknown_id: SkillProvenance("reviewed", "v1"),
        },
        source_version="v1",
    )
    report = UserSkillReport(competency_id, 1, datetime.now(timezone.utc))
    document = {
        "id": uuid4(),
        "analysis_id": uuid4(),
        "revision": 2,
        "evidence": [{"kind": "skill", "text": "SQL", "page": 1, "span": "SQL"}],
    }

    response = assemble_response(catalog, [report], document).model_dump(mode="json")
    career = response["items"][0]
    assert career["display_count"] == "2 of 2"
    skills = {skill["competency_id"]: skill for skill in career["skills"]}
    assert all(skill["status"] == "MATCHED" for skill in skills.values())
    assert skills[str(competency_id)]["reported_level"] == 1
    assert skills[str(unknown_id)]["reported_level"] is None
    assert skills[str(unknown_id)]["resume_signals"][0]["matched_phrases"] == ["SQL"]
    assert response["source"] == SOURCE_LABEL
    assert career["sample_note"] == SOURCE_NOTE
    assert not any("score" in key or "percentage" in key for key in response)


def test_anonymous_route_rejected_before_database_access():
    app = create_app(Settings(auth_enabled=True, database_url=""))
    with TestClient(app) as client:
        response = client.get("/api/v1/me/career-skill-matches")
    assert response.status_code == 401
