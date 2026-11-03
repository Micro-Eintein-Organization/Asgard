"""Validate release artifacts independently of preparation and application runtime."""

import argparse
import csv
import hashlib
import io
import json
import re
import zipfile
from collections import defaultdict
from pathlib import Path

from curate_dataset import ROOT, DEFAULT_OUTPUT


def validate(out, source_dir=None, report=True):
    tables = {}
    for p in sorted(out.glob("*.csv")):
        with p.open(encoding="utf-8", newline="") as f:
            tables[p.stem] = list(csv.DictReader(f))
    package = json.loads((out / "dataset.json").read_text(encoding="utf-8"))
    assert package["tables"] == tables, "CSV/JSON disagreement"
    assert len(tables["careers"]) == 12
    ids = {}
    for name, rows in tables.items():
        field = next(iter(rows[0]))
        keys = [r[field] for r in rows]
        assert len(keys) == len(set(keys)), f"Duplicate identity in {name}"
        assert all(None not in r and all(v is not None for v in r.values()) for r in rows)
        ids[name] = set(keys)
    for r in tables["expectations"]:
        assert r["occupation_id"] in ids["source_occupations"]
        assert r["competency_id"] in ids["competencies"]
        assert r["native_record_id"] in ids["native_records"]
    for r in tables["crosswalks"]:
        assert r["from_id"] in ids["careers" if r["from_type"] == "asgard_career" else "competencies"]
        assert r["to_id"] in ids["source_occupations" if r["to_type"] == "source_occupation" else "competencies"]
        assert r["review_status"] == "proposed"
    for name in ["tasks", "source_occupations", "competencies", "native_records", "decisions", "transformations", "interpretation"]:
        for r in tables[name]:
            assert r["source_id"] in ids["sources"]
    native = {r["record_id"]: r for r in tables["native_records"]}
    for r in tables["expectations"]:
        original = json.loads(native[r["native_record_id"]]["values_json"])
        if r["source_id"] == "SRC-10":
            assert r["native_level"] == original.get("Data Value", "")
            assert r["suppression"] == original.get("Recommend Suppress", "")
            assert r["not_relevant"] == original.get("Not Relevant", "")
            assert r["observation_date"] == original.get("Date", "")
        else:
            assert r["native_level"] == original["level"]
            assert original["level"] in original["raw_line"]
    for r in tables["competencies"]:
        assert r["label"] and len(r["label"]) < 100, "Likely PDF column contamination"
        assert not any(x in r["label"] for x in ["\ufffd", "\n", "�", "•"]), "Invalid label extraction"
        assert not r["label"].startswith(("Competencies ", "Skills and "))
        assert r["definition_locator"]
    for r in tables["decisions"]:
        assert int(r["input_records"]) == int(r["retained_records"]) + int(r["not_retained_records"])
    assert len({r["career_id"] for r in tables["comparison_cases"]}) == 12
    assert len({r["career_id"] for r in tables["learning_associations"]}) == 12
    import sys
    sys.path.insert(0, str(ROOT / "backend/scripts"))
    from convert_guide_v4 import convert
    docs = [convert(p) for p in (ROOT / "backend/app/content/guide_v4").glob("*.json")]
    topics = {(d["career"]["id"], d["roadmap"]["id"], t["id"])
              for d in docs for m in d["roadmap"]["milestones"] for t in m["topics"]}
    for r in tables["learning_associations"]:
        assert (r["career_id"], r["roadmap_id"], r["topic_id"]) in topics
        assert r["competency_id"] in ids["competencies"]
    source_status = "not run; source directory not supplied"
    if source_dir:
        for r in tables["sources"]:
            assert hashlib.sha256((source_dir / r["filename"]).read_bytes()).hexdigest() == r["sha256"]
        with zipfile.ZipFile(source_dir / "db_31_0_csv.zip") as z:
            assert z.testzip() is None
            for key in {r["table"] for r in native.values() if r["source_id"] == "SRC-10"}:
                original_rows = list(csv.DictReader(io.StringIO(z.read("db_31_0_csv/" + key + ".csv").decode("utf-8-sig"))))
                for r in native.values():
                    if r["source_id"] == "SRC-10" and r["table"] == key:
                        pos = int(r["locator"].rsplit(" ", 1)[1]) - 2
                        assert json.loads(r["values_json"]) == original_rows[pos]
        source_status = "passed: source hashes, ZIP CRC, selected O*NET rows and exact field preservation"
    groups = defaultdict(list)
    for r in tables["expectations"]:
        if r["source_id"] != "SRC-10":
            groups[(r["occupation_id"], r["competency_id"])].append(r)
    conflicts = [{"occupation_id": k[0], "competency_id": k[1], "native_levels": sorted({r["native_level"] for r in v}),
                  "expectation_ids": [r["expectation_id"] for r in v], "action": "withhold definitive target; independent review pending"}
                 for k, v in groups.items() if len({r["native_level"] for r in v}) > 1]
    result = {"status": "artifact checks passed; independent semantics/publication review pending", "release": "curated-v0.1",
              "counts": {n: len(v) for n, v in tables.items()}, "source_checks": source_status,
              "local_definition_gaps": sum(not r["definition"] for r in tables["competencies"]),
              "conflicting_native_expectations": conflicts,
              "not_run": ["Independent expert/content acceptance", "User competence assessment", "Application/database/browser/security tests", "Participant study", "Full local competency definition transcription"],
              "artifact_sha256": {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(out.glob("*.csv"))}}
    if report:
        (out / "validation.json").write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--release-dir", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--source-dir", type=Path)
    args = parser.parse_args()
    print(json.dumps(validate(args.release_dir, args.source_dir), indent=2))
