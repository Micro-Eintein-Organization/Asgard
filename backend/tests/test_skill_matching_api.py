from datetime import datetime, timezone
from uuid import uuid4

from fastapi.testclient import TestClient

from app.core.config import Settings
from app.main import create_app
from app.modules.skill_matching.matcher import UserSkillReport
from app.modules.skill_matching.service import assemble_response
from app.modules.skill_matching.sources import (
    SOURCE_LABEL,
    SOURCE_NOTE,
    CareerCatalog,
    SkillProvenance,
    catalog_from_rows,
)


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
