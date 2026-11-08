"""Render reviewable ESCO SQL from explicit independent approval, without connecting."""

import argparse
import hashlib
import json
import sqlite3
from contextlib import closing
from pathlib import Path
from uuid import UUID

from import_esco import SHA256, VERSION
from render_content_release import identifier, literal
from render_occupational_release import render as render_occupational
from screen_esco import ACKNOWLEDGEMENT, STAGING


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(",", ":"))


def load(database, approval):
    required = {"archive_sha256", "content_review", "reuse_review", "concepts", "links", "mappings"}
    if not required <= approval.keys() or approval["archive_sha256"] != SHA256:
        raise ValueError("Approval must identify the pinned archive and list cleared records")
    for field in ("content_review", "reuse_review"):
        if not isinstance(approval[field], str) or not approval[field].strip():
            raise ValueError(f"Missing independent review reference: {field}")
    with closing(sqlite3.connect(database.resolve().as_uri() + "?mode=ro", uri=True)) as db:
        manifest = json.loads(db.execute("SELECT document FROM manifest").fetchone()[0])
        if manifest["archive_sha256"] != SHA256:
            raise ValueError("Staging and review refer to different archives")
        concepts = {}
        for kind in ("occupation", "skill"):
            member = f"{kind}s_en.csv"
            headers = manifest["members"][member]["columns"]
            for locator, cells in db.execute("""
                SELECT record, raw_cells FROM source_rows WHERE member = ? ORDER BY record
            """, (member,)):
                row = dict(zip(headers, json.loads(cells), strict=True))
                uri = row["conceptUri"]
                if uri not in approval["concepts"] or uri in concepts:
                    continue
                fields = set(approval["concepts"][uri])
                if "preferredLabel" not in fields or fields - {
                    "preferredLabel", "altLabels", "description",
                }:
                    raise ValueError(f"Invalid field clearance for {uri}")
                concepts[uri] = {
                    "kind": kind, "label": row["preferredLabel"],
                    "alternatives": row["altLabels"].splitlines() if "altLabels" in fields else [],
                    "description": row["description"] if "description" in fields else "",
                    "locator": f"{member}#{locator}",
                }
        if set(concepts) != set(approval["concepts"]) or not any(
            row["kind"] == "occupation" for row in concepts.values()
        ):
            raise ValueError("Clearance must resolve to known concepts and include occupations")
        selected_links = {tuple(link) for link in approval["links"]}
        if len(selected_links) != len(approval["links"]):
            raise ValueError("Duplicate approved ESCO link")
        links = {}
        for locator, cells in db.execute("""
            SELECT record, raw_cells FROM source_rows
            WHERE member = 'occupationSkillRelations_en.csv' ORDER BY record
        """):
            occupation, _, relationship, _, skill, _ = json.loads(cells)
            key = (occupation, skill, relationship)
            if key in selected_links:
                if occupation not in concepts or skill not in concepts:
                    raise ValueError("Approved link has a concept without field clearance")
                links[key] = f"occupationSkillRelations_en.csv#{locator}"
        if links.keys() != selected_links:
            raise ValueError("Approval contains an unknown ESCO relationship")
    mappings = set()
    for career, occupation in approval["mappings"]:
        if concepts.get(occupation, {}).get("kind") != "occupation":
            raise ValueError("Career mapping references an uncleared occupation")
        mappings.add((str(UUID(career)), occupation))
    return concepts, links, mappings


def render_catalog(release_id, digest, concepts, links, mappings):
    rid = literal(release_id)
    statements = [
        "BEGIN;", "SELECT pg_advisory_xact_lock(411, 3);",
        "INSERT INTO asgard_catalog.esco_releases(id, version, adaptations, sha256) VALUES ("
        + ", ".join(map(literal, (release_id, VERSION, "Asgard selected and mapped digital and "
                                   "computing roles and their relevant skills.", digest)))
        + ") ON CONFLICT (id) DO NOTHING;",
        "DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM asgard_catalog.esco_releases WHERE id="
        + rid + " AND sha256=" + literal(digest)
        + ") THEN RAISE EXCEPTION 'Conflicting ESCO release'; END IF; END $$;",
    ]
    for table, columns, records in (
        ("esco_concepts", "release_id,uri,kind,label,alternatives,description", (
            (uri, item["kind"], item["label"], item["alternatives"], item["description"])
            for uri, item in sorted(concepts.items())
        )),
        ("esco_links", "release_id,occupation_uri,skill_uri,relationship", sorted(links)),
        ("esco_career_links", "release_id,occupation_uri,career_id", (
            (occupation, career) for career, occupation in sorted(mappings)
        )),
    ):
        for record in records:
            # Explicit casts resolve literal SELECT columns before PostgreSQL inserts them.
            cells = list(map(literal, record))
            if table == "esco_career_links":
                cells[-1] += "::uuid"
            statements.append(
                f"INSERT INTO asgard_catalog.{table}({columns}) SELECT {rid}::uuid, "
                + ", ".join(cells)
                + f" WHERE EXISTS (SELECT 1 FROM asgard_catalog.esco_releases WHERE id={rid}"
                + " AND NOT sealed) ON CONFLICT DO NOTHING;"
            )
    return "\n".join([*statements, "COMMIT;", ""])


def merge_recommendations(base, selected, concepts, links, mappings):
    profiles = {profile["career"]["career_id"]: profile for profile in base["profiles"]}
    for profile in profiles.values():
        profile.pop("esco_references", None)
    keys = {tuple(item) for item in selected}
    if len(keys) != len(selected):
        raise ValueError("Duplicate recommendation approval")
    for career, occupation, skill, relationship in sorted(keys):
        career = str(UUID(career))
        key = (occupation, skill, relationship)
        if career not in profiles or (career, occupation) not in mappings or key not in links:
            raise ValueError("Recommendation approval must reference a cleared career and link")
        row = {
            "career_id": career, "record_id": identifier(canonical(key)),
            "competency_id": str(UUID(skill.rsplit("/", 1)[1])),
            "occupation_id": str(UUID(occupation.rsplit("/", 1)[1])),
            "label": concepts[skill]["label"], "definition": concepts[skill]["description"],
            "source_id": "ESCO", "source_title": "European Commission ESCO",
            "source_version": VERSION, "source_sha256": SHA256,
            "reuse_notes": "https://esco.ec.europa.eu/en/use-esco/download/privacy-statement",
            "source_role_title": concepts[occupation]["label"],
            "career_relationship": "reviewed reference",
            "locator": links[key], "related_skill_ids": [], "relationship": "source_reference",
            "limitation": "European occupational context. No personal proficiency target.",
            "evidence_type": "esco_occupation_skill", "source_relationship": relationship,
        }
        profiles[career].setdefault("esco_references", []).append(row)
    return base


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("approval", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--staging", type=Path, default=STAGING / "staging.sqlite3")
    parser.add_argument("--base-occupational", type=Path)
    args = parser.parse_args()
    approval = json.loads(args.approval.read_text(encoding="utf-8"))
    concepts, links, mappings = load(args.staging, approval)
    release_data = {
        "approval": approval, "concepts": concepts, "links": sorted(links.items()),
        "mappings": sorted(mappings), "version": VERSION,
    }
    digest = hashlib.sha256(canonical(release_data).encode()).hexdigest()
    release_id = identifier("esco/" + digest)
    catalog = render_catalog(release_id, digest, concepts, links, mappings)
    occupational = None
    if args.base_occupational:
        base = json.loads(args.base_occupational.read_text(encoding="utf-8"))
        occupational = render_occupational(data=merge_recommendations(
            base, approval["recommendation_links"], concepts, links, mappings,
        ))
    manifest = {
        "release_id": release_id, "sha256": digest, "archive_sha256": SHA256,
        "version": VERSION, "language": "en", "acknowledgement": ACKNOWLEDGEMENT,
        "adaptations": "Asgard selected and mapped digital and computing records.",
        "counts": {"concepts": len(concepts), "links": len(links), "mappings": len(mappings)},
        "content_review": approval["content_review"], "reuse_review": approval["reuse_review"],
    }
    files = {"catalog.sql": catalog}
    if occupational is not None:
        files["occupational.sql"] = occupational
    manifest["files"] = {
        name: hashlib.sha256(contents.encode()).hexdigest() for name, contents in files.items()
    }
    files["manifest.json"] = json.dumps(manifest, indent=2, sort_keys=True) + "\n"
    args.output.mkdir(parents=True, exist_ok=True)
    for name, contents in files.items():
        target = args.output / name
        if target.exists() and target.read_bytes() != contents.encode():
            raise ValueError(f"Conflicting rendered output: {target}")
    for name, contents in files.items():
        (args.output / name).write_bytes(contents.encode())


if __name__ == "__main__":
    main()
