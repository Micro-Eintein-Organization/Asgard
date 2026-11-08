"""Render immutable local-test reference SQL; never connect or activate implicitly."""

import argparse
import hashlib
import json
from pathlib import Path

from prepare_occupational_local_test import OUTPUT, verify
from prepare_occupational_release import DESTINATION, read_tables
from render_content_release import identifier, literal


def payload():
    overlay = json.loads(OUTPUT.read_text(encoding="utf-8"))
    verify(overlay)
    tables = read_tables(DESTINATION)
    review = json.loads((DESTINATION / "agent-review.json").read_text(encoding="utf-8"))
    careers = []
    definitions = {r["competency_id"]: r for r in tables["competencies"]}
    expectations = {r["expectation_id"]: r for r in tables["expectations"]}
    tasks = {r["task_id"]: r for r in tables["tasks"]}
    for career in tables["careers"]:
        cid = career["career_id"]
        crosswalks = {r["crosswalk_id"]: r for r in tables["crosswalks"]}
        relationships = [
            {**r, "occupation_id": crosswalks[r["crosswalk_id"]]["to_id"]}
            for r in review["career_relationships"]
            if r["career_id"] == cid
        ]
        occupation_ids = {
            r["to_id"]
            for r in tables["crosswalks"]
            if r["crosswalk_id"] in {link["crosswalk_id"] for link in relationships}
        }
        records = []
        for decision in review["record_dispositions"]:
            if decision["career_id"] != cid:
                continue
            native = (expectations if decision["record_type"] == "expectation" else tasks)[
                decision["record_id"]
            ]
            records.append({"review": decision, "native": native})
        concept_ids = {
            r["native"]["competency_id"] for r in records if "competency_id" in r["native"]
        }
        careers.append(
            {
                "career": career,
                "source_roles": [
                    r for r in tables["source_occupations"] if r["occupation_id"] in occupation_ids
                ],
                "sources": [
                    r
                    for r in tables["sources"]
                    if r["source_id"]
                    in {
                        role["source_id"]
                        for role in tables["source_occupations"]
                        if role["occupation_id"] in occupation_ids
                    }
                ],
                "relationships": relationships,
                "records": records,
                "competencies": [definitions[key] for key in sorted(concept_ids)],
                "topics": [r for r in review["topics"] if r["career_id"] == cid],
                "skills": [r for r in review["existing_skills"] if r["career_id"] == cid],
                "eligible_records": [
                    r["record_id"]
                    for r in overlay["eligible_record_proposals"]
                    if r["career_id"] == cid
                ],
            }
        )
    return {
        "overlay": overlay,
        "sources": tables["sources"],
        "profiles": careers,
        "scale_definitions": {
            "IM": "Importance (native range 1–5)",
            "LV": "Level (native range 0–7)",
            "PSF functional competency level": "Source-native functional competency level",
            "technology example; no proficiency scale": "Example technology; no proficiency scale",
        },
        "scale_provenance": {
            "IM": "SRC-10; db_31_0_csv/scales_reference.csv; Scale ID=IM",
            "LV": "SRC-10; db_31_0_csv/scales_reference.csv; Scale ID=LV",
        },
    }


def render(*, activate=False, data=None):
    if data is None:
        data = payload()
    encoded = json.dumps(data, sort_keys=True, separators=(",", ":"))
    digest = hashlib.sha256(encoded.encode()).hexdigest()
    release_id = identifier("occupational/local-test/" + digest)
    statements = ["BEGIN;", "SELECT pg_advisory_xact_lock(411, 2);"]
    statements.append(
        "INSERT INTO asgard_catalog.occupational_releases"
        "(id,sha256,canonical_payload,payload) VALUES ("
        + literal(release_id)
        + ","
        + literal(digest)
        + ","
        + literal(encoded)
        + ","
        + literal(encoded)
        + "::jsonb) ON CONFLICT(id) DO NOTHING;"
    )
    statements.append(
        "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM asgard_catalog.occupational_releases WHERE id="
        + literal(release_id)
        + " AND sha256="
        + literal(digest)
        + " AND payload="
        + literal(encoded)
        + "::jsonb) THEN RAISE EXCEPTION 'Conflicting occupational release';"
        + " END IF; END $$;"
    )
    if activate:
        statements.append(
            "SELECT asgard_catalog.activate_occupational_release(" + literal(release_id) + ");"
        )
    statements.append("COMMIT;")
    return "\n".join(statements) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--activate", action="store_true")
    args = parser.parse_args()
    args.output.write_text(render(activate=args.activate), encoding="utf-8")


if __name__ == "__main__":
    main()
