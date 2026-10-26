from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.security import Identity, current_identity
from app.main import create_app
from app.modules.discovery.schemas import SaveDiscovery
from app.modules.progress.schemas import SavePreferences
from app.modules.recommendations.schemas import (
    ContextFact,
    PublishedCareerReference,
    RecommendationContext,
    UntrustedRecommendationItem,
    UntrustedRecommendationOutput,
    validate_recommendations,
)


def test_foundation_routes_require_authentication_and_never_report_success():
    app = create_app(Settings(auth_enabled=True))
    schema = app.openapi()
    operations = [
        (path, method, operation)
        for path, methods in schema["paths"].items()
        for method, operation in methods.items()
        if "foundation-contracts" in operation.get("tags", [])
    ]
    assert len(operations) == 29
    with TestClient(app) as client:
        for path, method, operation in operations:
            assert operation["security"] == [{"HTTPBearer": []}]
            assert "501" in operation["responses"]
            if method == "get":
                url = path
                for parameter in operation.get("parameters", []):
                    if parameter["in"] == "path":
                        url = url.replace("{" + parameter["name"] + "}", str(uuid4()))
                assert client.get(url, params={"month": "2026-10"}).status_code == 401
                app.dependency_overrides[current_identity] = lambda: Identity(
                    uuid4(), uuid4(), "aal1"
                )
                response = client.get(url, params={"month": "2026-10"})
                assert response.status_code == 501
                assert response.json()["code"] == "not_implemented"
                if path.startswith("/api/v1/me/"):
                    assert response.headers["Cache-Control"] == "no-store"
                app.dependency_overrides.clear()


def test_structured_output_requires_catalog_relationships_and_exact_context_evidence():
    career, roadmap, topic = uuid4(), uuid4(), uuid4()
    context = RecommendationContext(
        context_revision=1, discovery=None,
        facts=[ContextFact(
            id="focus:1", source="current_roadmap", source_id=str(roadmap),
            source_revision=1, description="An explicitly chosen learning path.",
        )],
    )
    item = UntrustedRecommendationItem(
        career_id=career, reason="A direction to explore based on your selected path.",
        evidence_fact_ids=["focus:1"], roadmap_id=roadmap, starting_topic_id=topic,
    )
    catalog = [PublishedCareerReference(career_id=career, roadmaps={roadmap: [topic]})]
    output = UntrustedRecommendationOutput(items=[item])
    assert validate_recommendations(output, context, catalog)[0].career_id == career
    for changed in (
        {"career_id": uuid4()}, {"roadmap_id": uuid4()}, {"starting_topic_id": uuid4()},
        {"roadmap_id": None}, {"evidence_fact_ids": ["another-revision:1"]},
    ):
        invalid = UntrustedRecommendationOutput(
            items=[UntrustedRecommendationItem.model_validate(item.model_dump() | changed)]
        )
        with pytest.raises(ValueError):
            validate_recommendations(invalid, context, catalog)
    with pytest.raises(ValidationError):
        UntrustedRecommendationOutput(items=[item, item])
    with pytest.raises(ValidationError):
        UntrustedRecommendationOutput(items=[])
    with pytest.raises(ValidationError):
        UntrustedRecommendationItem.model_validate(item.model_dump() | {"match_score": 99})


def test_mutations_reject_owner_fields_duplicate_answers_and_invalid_timezones():
    with pytest.raises(ValidationError):
        SaveDiscovery(expected_version=1, answers=[
            {"question_id": "interests", "option_ids": ["unsure", "unsure"]}
        ])
    with pytest.raises(ValidationError):
        SaveDiscovery(expected_version=True, answers=[
            {"question_id": "interests", "option_ids": ["unsure"]}
        ])
    with pytest.raises(ValidationError):
        SavePreferences(
            expected_version=0, preferred_category_id=None, timezone="invalid/timezone",
            dismissed_guidance=[],
        )
    with pytest.raises(ValidationError):
        SavePreferences.model_validate({
            "expected_version": 0, "preferred_category_id": None, "timezone": "Asia/Manila",
            "dismissed_guidance": [], "user_id": str(uuid4()),
        })
