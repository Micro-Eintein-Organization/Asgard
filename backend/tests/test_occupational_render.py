import importlib
import sys
from pathlib import Path
from unittest.mock import patch


def renderer():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        return importlib.import_module("render_occupational_release")


def test_full_payload_preserves_review_and_native_values():
    data = renderer().payload()
    assert len(data["profiles"]) == 12
    records = [r for profile in data["profiles"] for r in profile["records"]]
    assert len(records) == 9922
    assert any(r["review"]["decision"] == "disputed" for r in records)
    for profile in data["profiles"]:
        eligible = set(profile["eligible_records"])
        for row in profile["records"]:
            if row["review"]["record_id"] in eligible:
                assert row["review"]["decision"] == "agent_supported"
                assert row["review"]["classification"] == "core_function"
                assert row["native"]["native_level"] == row["review"]["native_level"]


def test_repeat_render_is_identical_and_does_not_activate():
    module = renderer()
    sql = module.render()
    assert sql == module.render()
    assert "INSERT INTO asgard_catalog.occupational_active_release" not in sql
    assert "Conflicting occupational release" in sql
    assert sql.startswith("BEGIN;") and sql.endswith("COMMIT;\n")
