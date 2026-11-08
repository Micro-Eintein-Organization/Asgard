import hashlib
import importlib
import json
import sys
from pathlib import Path
from unittest.mock import patch

from app.modules.careers.exploration import ROOT, package


def test_complete_exploration_package_preserves_catalog_identities():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        convert = importlib.import_module("convert_guide_v4").convert
        identifier = importlib.import_module("render_content_release").identifier
    profiles = package()
    assert len(profiles) == 23
    review = json.loads((ROOT / "occupational/v1/agent-review.json").read_text())
    summaries = {s["career_id"]: s for s in review["summaries"]}
    ids = set()
    for profile in profiles:
        if profile["career_id"] in summaries:
            assert profile["source_scope"] == summaries[profile["career_id"]]["scope"]
        source = ROOT / "guide_v4" / profile["source_file"]
        guide = convert(source)
        assert profile["career_id"] == guide["career"]["id"]
        assert hashlib.sha256(source.read_bytes()).hexdigest() == profile["source_sha256"]
        topics = {t["id"] for m in guide["roadmap"]["milestones"] for t in m["topics"]}
        expected = {
            identifier(f"competency/{guide['career']['slug']}/core-{i + 1:02d}") for i in range(10)
        }
        assert {s["id"] for s in profile["skills"]} == expected
        assert not ids.intersection(expected)
        ids.update(expected)
        assert profile["starter"]["topic_id"] in topics
        for group in profile["learning_groups"]:
            assert group["topic_id"] in topics
            assert group["roadmap_id"] == guide["roadmap"]["id"]
        for skill in profile["skills"]:
            assert skill["topic_id"] in topics
            assert skill["career_id"] == profile["career_id"]
            assert skill["question"] and skill["example"]
            if "mappings" in skill:
                assert skill["mappings"]
                assert all(link["topic_id"] in topics for link in skill["mappings"])
            else:
                assert skill["source_locator"]
    assert len(ids) == 230
