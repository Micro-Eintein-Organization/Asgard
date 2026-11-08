import importlib
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

from app.modules.recommendations.occupational_context import reported_facts, select_references


def profiles():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        return importlib.import_module("render_occupational_release").payload()["profiles"]


def test_unknown_zero_and_missing_are_distinct():
    state = {
        "version": 2,
        "items": [
            {"competency_id": "unknown", "label": "HTML", "level": None},
            {"competency_id": "zero", "label": "CSS", "level": 0},
        ],
    }
    facts = reported_facts(state)
    assert len(facts) == 2
    assert "unknown" in facts[0]["description"]
    assert "no experience" in facts[1]["description"]
    assert reported_facts({"version": 0, "items": []}) == []


def test_all_careers_have_bounded_deterministic_references():
    for profile in profiles():
        reports = {
            "version": 1,
            "items": [{"competency_id": r["competency_id"], "level": 3} for r in profile["skills"]],
        }
        result = select_references("release", profile, reports)
        assert result == select_references("release", profile, reports)
        assert 0 < result["included_count"] <= 6
        assert all(r["career_id"] == profile["career"]["career_id"] for r in result["references"])
        assert all("native_level" not in r for r in result["references"])


def test_disputed_overlay_injection_rejected():
    profile = profiles()[0]
    row = next(r for r in profile["records"] if r["review"]["decision"] != "agent_supported")
    profile["eligible_records"].append(row["review"]["record_id"])
    with pytest.raises(ValueError, match="Ineligible"):
        select_references("release", profile, {"items": []})


def test_partial_relationship_cannot_transfer_proficiency():
    profile = profiles()[0]
    profile["skills"][0]["transfers_proficiency"] = True
    with pytest.raises(ValueError, match="transfer"):
        select_references("release", profile, {"items": []})


def test_esco_uses_combined_budget_and_requires_same_career():
    profile = {
        "career": {"career_id": "career"},
        "skills": [],
        "competencies": [],
        "eligible_records": [],
        "records": [],
        "esco_references": [
            {
                "career_id": "career",
                "record_id": str(index),
                "evidence_type": "esco_occupation_skill",
                "source_relationship": "optional" if index == 0 else "essential",
                "related_skill_ids": [],
                "relationship": "source_reference",
            }
            for index in range(8)
        ],
    }
    result = select_references("release", profile, {"items": []})
    assert result["eligible_count"] == 8
    assert result["included_count"] == 6
    assert all(row["source_relationship"] == "essential" for row in result["references"])
    assert result == select_references("release", profile, {"items": []})
    other = select_references("another-release", profile, {"items": []})
    assert result["references"][0]["id"] != other["references"][0]["id"]
    profile["esco_references"][0]["career_id"] = "other career"
    with pytest.raises(ValueError, match="Invalid ESCO reference"):
        select_references("release", profile, {"items": []})
