"""Prepare and validate an inactive occupational research packet; never publish it."""

import argparse
import csv
import hashlib
import json
import shutil
from collections import Counter
from pathlib import Path

from convert_guide_v4 import convert
from guide_resource_selections import SELECTIONS

ROOT = Path(__file__).resolve().parents[2]
DESTINATION = ROOT / "backend/app/content/occupational/v1"
TABLES = (
    "careers",
    "sources",
    "source_occupations",
    "competencies",
    "expectations",
    "tasks",
    "crosswalks",
    "learning_associations",
    "native_records",
    "source_locators",
    "interpretation",
    "decisions",
    "transformations",
    "comparison_cases",
)


def read_tables(directory):
    result = {}
    for name in TABLES:
        with (directory / (name + ".csv")).open(encoding="utf-8-sig", newline="") as stream:
            result[name] = list(csv.DictReader(stream))
    return result


def audit(tables):
    keys = {
        "careers": "career_id",
        "sources": "source_id",
        "source_occupations": "occupation_id",
        "competencies": "competency_id",
        "native_records": "record_id",
    }
    identities = {}
    for table, key in keys.items():
        values = [row[key] for row in tables[table]]
        if len(values) != len(set(values)):
            raise ValueError("Duplicate identity in " + table)
        identities[table] = set(values)
    if len(tables["careers"]) != 12:
        raise ValueError("Expected all twelve current careers")
    actual = {
        doc["career"]["id"]: doc
        for doc in (
            convert(ROOT / "backend/app/content/guide_v4" / f"{slug}.json")
            for slug in SELECTIONS
        )
    }
    if identities["careers"] != set(actual):
        raise ValueError("Research careers differ from current application careers in the original guide roster")
    for career in tables["careers"]:
        if career["roadmap_id"] != actual[career["career_id"]]["roadmap"]["id"]:
            raise ValueError("Research roadmap differs from current application")
    for association in tables["learning_associations"]:
        doc = actual.get(association["career_id"])
        if doc is None or association["topic_id"] not in {
            t["id"] for m in doc["roadmap"]["milestones"] for t in m["topics"]
        }:
            raise ValueError("Learning association has an unsupported current topic")
    references = {
        "source_id": "sources",
        "occupation_id": "source_occupations",
        "competency_id": "competencies",
        "native_record_id": "native_records",
        "career_id": "careers",
    }
    for table in (
        "expectations",
        "tasks",
        "learning_associations",
        "source_occupations",
        "competencies",
    ):
        for row in tables[table]:
            for field, target in references.items():
                if row.get(field) and row[field] not in identities[target]:
                    raise ValueError("Unresolved " + table + "." + field)
    for row in tables["crosswalks"]:
        for side in ("from", "to"):
            kind = row[side + "_type"]
            table = {
                "asgard_career": "careers",
                "source_occupation": "source_occupations",
                "competency": "competencies",
            }.get(kind)
            if not table or row[side + "_id"] not in identities[table]:
                raise ValueError("Unresolved crosswalk endpoint")
    return {
        "row_counts": {name: len(rows) for name, rows in tables.items()},
        "reference_integrity": "passed",
        "semantic_review": "pending",
        "native_scales": dict(Counter(r["native_scale"] for r in tables["expectations"])),
        "activation_eligible": False,
    }


def prepare(source):
    tables = read_tables(source)
    report = audit(tables)
    DESTINATION.mkdir(parents=True, exist_ok=True)
    files = {}
    for name in TABLES:
        filename = name + ".csv"
        shutil.copyfile(source / filename, DESTINATION / filename)
        raw = (DESTINATION / filename).read_bytes()
        files[filename] = {"sha256": hashlib.sha256(raw).hexdigest(), "bytes": len(raw)}
    profiles = []
    for career in tables["careers"]:
        links = [
            r
            for r in tables["crosswalks"]
            if r["from_type"] == "asgard_career" and r["from_id"] == career["career_id"]
        ]
        occupations = {r["to_id"] for r in links}
        expectations = [r for r in tables["expectations"] if r["occupation_id"] in occupations]
        tasks = [r for r in tables["tasks"] if r["occupation_id"] in occupations]
        profiles.append(
            {
                "career": career,
                "source_roles": [
                    r for r in tables["source_occupations"] if r["occupation_id"] in occupations
                ],
                "crosswalk_ids": [r["crosswalk_id"] for r in links],
                "competency_ids": sorted({r["competency_id"] for r in expectations}),
                "expectation_ids": [r["expectation_id"] for r in expectations],
                "task_ids": [r["task_id"] for r in tasks],
                "coverage_status": "all linked draft records included; semantic approval pending",
            }
        )
    availability = []
    for item in tables["sources"]:
        availability.append(
            {
                "source_id": item["source_id"],
                "filename": item["filename"],
                "recorded_sha256": item["sha256"],
                "original_hash_verified": False,
                "blocker": "original file not supplied to this portable preparation",
            }
        )
    manifest = {
        "release": "occupational-v1-research",
        "prepared_date": "2026-11-04",
        "author": "Codex",
        "status": "inactive research packet; not approved publication",
        "activation_eligible": False,
        "files": files,
        "source_availability": availability,
        "structural_audit": report,
        "profiles": profiles,
        "review_boundaries": [
            "No semantic or independent content approval inferred",
            "No source-native scale converted to user levels",
            "No original documents or cached page-text dumps copied",
            "Current saved skills and active application data unchanged",
        ],
    }
    (DESTINATION / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    return report


def inspect_originals(directory, sources):
    verified = []
    for source in sources:
        filename = source["filename"]
        if Path(filename).name != filename:
            raise ValueError("Source filename must be relative and flat")
        original = directory / filename
        if not original.is_file():
            raise ValueError("Missing original: " + filename)
        digest = hashlib.sha256()
        with original.open("rb") as stream:
            while chunk := stream.read(1024 * 1024):
                digest.update(chunk)
        if digest.hexdigest() != source["sha256"] or original.stat().st_size != int(
            source["bytes"]
        ):
            raise ValueError("Original differs from source registry: " + filename)
        verified.append(
            {
                "source_id": source["source_id"],
                "filename": filename,
                "recorded_sha256": source["sha256"],
                "observed_sha256": digest.hexdigest(),
                "observed_bytes": original.stat().st_size,
                "original_hash_verified": True,
            }
        )
    return verified


def verify_originals(directory):
    check()
    verified = inspect_originals(directory, read_tables(DESTINATION)["sources"])
    path = DESTINATION / "manifest.json"
    manifest = json.loads(path.read_text(encoding="utf-8"))
    manifest["source_availability"] = verified
    manifest["original_verification"] = {
        "verified_date": "2026-11-04",
        "verified_by": "Codex",
        "scope": "Supplied bytes match source registry; not official-origin or semantic approval",
        "count": len(verified),
    }
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return {"originals_verified": len(verified), "activation_eligible": False}


def check(*, include_review=True):
    manifest = json.loads((DESTINATION / "manifest.json").read_text(encoding="utf-8"))
    if manifest["activation_eligible"] or len(manifest["profiles"]) != 12:
        raise ValueError("Research packet cannot claim publication readiness")
    for filename, expected in manifest["files"].items():
        if filename not in {name + ".csv" for name in TABLES}:
            raise ValueError("Unexpected manifest path")
        raw = (DESTINATION / filename).read_bytes()
        if hashlib.sha256(raw).hexdigest() != expected["sha256"] or len(raw) != expected["bytes"]:
            raise ValueError("Artifact differs from frozen manifest: " + filename)
    if include_review:
        for filename, expected_hash in manifest.get("agent_review_artifacts", {}).items():
            if filename not in {"review-policy.json", "agent-review.json", "review-summary.md"}:
                raise ValueError("Unexpected agent review artifact path")
            if hashlib.sha256((DESTINATION / filename).read_bytes()).hexdigest() != expected_hash:
                raise ValueError("Agent review artifact differs from frozen manifest")
    return audit(read_tables(DESTINATION))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prepare", type=Path, help="Explicit research CSV input directory")
    parser.add_argument(
        "--verify-originals", type=Path, help="Verify supplied original files without copying them"
    )
    args = parser.parse_args()
    if args.prepare and args.verify_originals:
        parser.error("Prepare and verify originals are separate operations")
    if args.prepare:
        result = prepare(args.prepare.resolve())
    elif args.verify_originals:
        result = verify_originals(args.verify_originals.resolve())
    else:
        result = check()
    print(json.dumps(result, sort_keys=True))
