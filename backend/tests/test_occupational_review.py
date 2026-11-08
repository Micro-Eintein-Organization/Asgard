import importlib
import json
import sys
from pathlib import Path
from unittest.mock import patch

import pytest


@pytest.fixture
def review():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        module = importlib.import_module("review_occupational_release")
    data = json.loads((module.DESTINATION / "agent-review.json").read_text(encoding="utf-8"))
    return module, data


def test_complete_review_is_inactive(review):
    module, data = review
    assert module.validate(data)["record_dispositions"] == 9922
    assert not data["activation_eligible"]


def test_missing_disposition_fails(review):
    module, data = review
    data["record_dispositions"].pop()
    with pytest.raises(ValueError, match="dispositions"):
        module.validate(data)


def test_unsupported_competency_fails(review):
    module, data = review
    data["topics"][0]["competency_ids"] = ["unknown"]
    with pytest.raises(ValueError, match="cross-career"):
        module.validate(data)


def test_technology_cannot_be_mandatory(review):
    module, data = review
    row = next(
        r for r in data["record_dispositions"] if r["classification"] == "technology_example"
    )
    row["mandatory_requirement"] = True
    with pytest.raises(ValueError, match="mandatory"):
        module.validate(data)


def test_disputed_evidence_cannot_enter_inference(review):
    module, data = review
    row = next(r for r in data["record_dispositions"] if r["decision"] == "disputed")
    row["inference_eligible"] = True
    with pytest.raises(ValueError, match="inference"):
        module.validate(data)


def test_partial_mapping_cannot_transfer_rating(review):
    module, data = review
    data["topics"][0]["transfers_proficiency"] = True
    with pytest.raises(ValueError, match="Proficiency"):
        module.validate(data)


def test_existing_skill_identity_cannot_change(review):
    module, data = review
    data["existing_skills"][0]["competency_id"] = "changed"
    with pytest.raises(ValueError, match="identity"):
        module.validate(data)


def test_conflicting_expectation_cannot_be_accepted(review):
    module, data = review
    row = next(r for r in data["record_dispositions"] if r["decision"] == "disputed")
    row["decision"] = "agent_supported"
    with pytest.raises(ValueError, match="Conflicting"):
        module.validate(data)
