import asyncio
from unittest.mock import AsyncMock
from uuid import uuid4

import pytest

from app.core.errors import APIError
from app.modules.competencies import evidence


def test_missing_migration_preserves_curriculum_use(monkeypatch):
    query = AsyncMock(side_effect=[{"id": uuid4()}, {"ready": False}])
    monkeypatch.setattr(evidence, "one", query)
    result = asyncio.run(evidence.read(None, uuid4()))
    assert evidence.CareerEvidence.model_validate(result).release_id is None
    assert result["review_status"] == "unavailable"
    assert query.await_count == 2


def test_changed_release_requires_reload(monkeypatch):
    monkeypatch.setattr(
        evidence,
        "one",
        AsyncMock(
            side_effect=[
                {"id": uuid4()},
                {"ready": True},
                None,
            ]
        ),
    )
    with pytest.raises(APIError) as failure:
        asyncio.run(evidence.read(None, uuid4(), expected_release_id=uuid4()))
    assert failure.value.status == 409


def test_native_zero_and_disputed_record_remain_reference_only(monkeypatch):
    career, release, role, record, concept = [uuid4() for _ in range(5)]
    result = {
        "release_id": release,
        "roles": [
            {
                "occupation_id": role,
                "source_id": "source",
                "native_code": "native",
                "title": "Source role",
                "career_level": "unknown",
                "locator": "page 70",
            }
        ],
        "limitations": ["Independent review pending"],
        "eligible_records": [],
        "definitions": [
            {"competency_id": str(concept), "label": "Concept", "definition": "Native"}
        ],
        "total": 1,
        "records": [
            {
                "native": {
                    "occupation_id": role,
                    "source_id": "source",
                    "locator": "page 70",
                    "competency_id": str(concept),
                    "native_level": "0",
                    "native_scale": "source scale",
                },
                "review": {
                    "record_id": record,
                    "record_type": "expectation",
                    "decision": "disputed",
                    "classification": "source_context",
                    "rationale": "Conflicting levels",
                },
            }
        ],
    }
    query = AsyncMock(side_effect=[{"id": career}, {"ready": True}, result])
    monkeypatch.setattr(evidence, "one", query)
    page = evidence.CareerEvidence.model_validate(asyncio.run(evidence.read(None, career)))
    assert page.items[0].native_level == "0"
    assert not page.items[0].local_test_eligible
    assert page.items[0].decision == "disputed"
    assert query.await_args.args[2]["limit"] == 20
