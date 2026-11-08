import asyncio
import copy
from datetime import UTC, datetime
from unittest.mock import AsyncMock
from uuid import UUID, uuid4

import pytest
from pydantic import TypeAdapter, ValidationError

from app.core.config import Settings
from app.modules.recommendations import occupational_runtime, provider, service
from app.modules.recommendations.schemas import SavedRecommendationContext
from app.modules.recommendations.selection import (
    SelectionFailure,
    SelectionOutput,
    provider_payload,
    resolve_selection,
)


def content():
    career, other, roadmap, release = [str(uuid4()) for _ in range(4)]
    references = [
        {
            "id": str(uuid4()),
            "career_id": target,
            "release_id": release,
            "record_id": str(uuid4()),
            "competency_id": str(uuid4()),
            "label": "Native concept",
            "definition": "Source definition",
            "occupation_id": str(uuid4()),
            "source_id": "SRC-10",
            "locator": "CSV row 1",
            "related_skill_ids": [],
            "relationship": "source_reference",
            "limitation": "Local test, no proficiency target",
        }
        for target in (career, other)
    ]
    return {
        "context": {
            "schema_version": "2",
            "context_revision": 1,
            "skill_profile_version": 1,
            "occupational_release_id": release,
            "discovery": None,
            "document": None,
            "facts": [
                {
                    "id": "skill-report",
                    "source": "reported_skill",
                    "source_id": str(uuid4()),
                    "source_revision": 1,
                    "description": "Level 0: no experience; interests unknown",
                }
            ],
            "source_references": references,
            "coverage_limitations": [],
        },
        "catalog": [
            {
                "career_id": target,
                "title": "Career",
                "description": "Description",
                "skills": [],
                "category": "Category",
                "relevance": {},
                "roadmap_ids": [roadmap],
                "roadmaps": [],
            }
            for target in (career, other)
        ],
    }


def output(reference_keys):
    return SelectionOutput.model_validate(
        {
            "items": [
                {
                    "candidate_key": "c1",
                    "reason": "An exploration option",
                    "evidence_keys": ["f1"],
                    "source_reference_keys": reference_keys,
                    "caveat": "Interests unknown",
                    "weak_connection": True,
                }
            ]
        }
    )


def test_context_discriminator_and_reference_identity():
    data = content()
    context = TypeAdapter(SavedRecommendationContext).validate_python(data["context"])
    assert context.schema_version == "2"
    assert isinstance(context.source_references[0].id, UUID)
    data["context"]["facts"][0]["source_revision"] = 2
    with pytest.raises(ValidationError, match="saved skill version"):
        TypeAdapter(SavedRecommendationContext).validate_python(data["context"])


def test_candidate_reference_keys_are_explicit_and_career_specific():
    payload, candidates, facts = provider_payload(content())
    assert payload["candidates"][0]["source_reference_keys"] == ["r1"]
    assert payload["candidates"][1]["source_reference_keys"] == ["r2"]
    assert "career_id" not in payload["references"][0]
    resolved = resolve_selection(output(["r1"]), candidates, facts)
    assert resolved.items[0].source_reference_ids
    for keys in ([], ["r2"], ["unknown"], ["r1", "r1"]):
        with pytest.raises(SelectionFailure, match="source_citation"):
            resolve_selection(output(keys), candidates, facts)


def test_budget_reduction_keeps_every_personal_fact(monkeypatch):
    data = content()
    before = copy.deepcopy(data["context"]["facts"])

    def prepare(settings, payload, **kwargs):
        if payload.get("references"):
            raise provider.ProviderFailure("invalid_output", "input_budget")
        return {"prepared": True}

    monkeypatch.setattr(provider, "prepare_request", prepare)
    payload, _, _, prepared = occupational_runtime.prepare_selection(Settings(), data)
    assert prepared == {"prepared": True}
    assert payload["references"] == []
    assert data["context"]["facts"] == before
    assert data["context"]["coverage_limitations"]


def test_budget_failure_is_not_hidden_when_personal_context_alone_exceeds_limit(monkeypatch):
    data = content()

    def reject(*args, **kwargs):
        raise provider.ProviderFailure("invalid_output", "input_budget")

    monkeypatch.setattr(provider, "prepare_request", reject)
    with pytest.raises(provider.ProviderFailure):
        occupational_runtime.prepare_selection(Settings(), data)
    assert data["context"]["facts"]


def test_legacy_context_is_outdated_after_privacy_activation_even_with_current_prompt(monkeypatch):
    release, run_id, uid = uuid4(), uuid4(), uuid4()
    saved = {
        "id": run_id,
        "status": "failed",
        "context_revision": 1,
        "catalog_release_id": release,
        "prompt_version": service.PROMPT_VERSION,
        "schema_version": service.SCHEMA_VERSION,
        "model_id": None,
        "created_at": datetime.now(UTC),
        "finished_at": datetime.now(UTC),
        "failure_code": "invalid_output",
        "discovery_session_id": None,
        "context_snapshot": {"context": {"schema_version": "1", "facts": []}},
    }
    monkeypatch.setattr(service, "one", AsyncMock(return_value=saved))
    monkeypatch.setattr(occupational_runtime.skills, "privacy_ready", AsyncMock(return_value=True))
    result = asyncio.run(service.run(None, uid, run_id, 1, release))
    assert result.outdated
    assert result.items == []
