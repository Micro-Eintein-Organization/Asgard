"""Stage the reviewed ESCO archive offline, preserving CSV record locators."""

import argparse
import csv
import hashlib
import io
import json
import sqlite3
import tempfile
from contextlib import closing
from pathlib import Path
from zipfile import BadZipFile, ZipFile

ROOT = Path(__file__).resolve().parents[2]
VERSION = "1.2.1"
SHA256 = "f9761b0b52be1828b38a3e5e0ae59a93a7b0ce358bc800f52f57a8b002adeb3e"
DOWNLOAD = "https://esco.ec.europa.eu/en/use-esco/download"
COUNTS = {
    "occupations": 3043, "dictionary": 160, "skills": 13960, "ISCOGroups": 619,
    "skillGroups": 640, "broaderRelationsOccPillar": 3648,
    "broaderRelationsSkillPillar": 20819, "occupationSkillRelations": 126051,
    "transversalSkillsCollection": 95, "languageSkillsCollection": 359,
    "skillSkillRelations": 5818, "conceptSchemes": 20, "digCompSkillsCollection": 25,
    "greenSkillsCollection": 629, "researchSkillsCollection": 40,
    "digitalSkillsCollection": 1284, "researchOccupationsCollection": 122,
    "skillsHierarchy": 640, "greenShareOcc": 3590,
}


def digest(path):
    with path.open("rb") as source:
        return hashlib.file_digest(source, "sha256").hexdigest()


def read_member(archive, db, table, expected_count):
    name = f"{table}_en.csv"
    data = archive.read(name)
    reader = csv.reader(io.TextIOWrapper(io.BytesIO(data), encoding="utf-8-sig", newline=""),
                        strict=True)
    header = next(reader)
    width = len(header)
    short_rows = 0
    count = 0
    concepts = {}
    repeated_dates = 0
    for number, row in enumerate(reader, start=2):
        count += 1
        missing = width - len(row)
        if missing:
            if (
                table != "skillsHierarchy"
                or not 1 <= missing <= 3
                or any(row[level * 2] for level in range(4 - missing, 4))
            ):
                raise ValueError(f"Unexpected CSV width in {name}, record {number}")
            short_rows += 1
        db.execute("INSERT INTO source_rows VALUES (?, ?, ?, ?)",
                   (name, number, json.dumps(row), json.dumps(row + [None] * missing)))
        if table in ("occupations", "skills"):
            concept = dict(zip(header, row))
            uri = concept["conceptUri"]
            modified = concept.pop("modifiedDate")
            if uri in concepts:
                previous, previous_date = concepts[uri]
                if previous != concept or previous_date == modified:
                    raise ValueError(f"Conflicting or repeated concept in {name}, record {number}")
                repeated_dates += 1
                continue
            concepts[uri] = concept, modified
            db.execute("INSERT INTO concepts VALUES (?, ?, ?)",
                       (table, uri, concept["preferredLabel"]))
        elif table == "occupationSkillRelations":
            edge = dict(zip(header, row))
            db.execute("INSERT INTO occupation_skills VALUES (?, ?, ?)",
                       (edge["occupationUri"], edge["relationType"], edge["skillUri"]))
    if count != expected_count or short_rows != (188 if table == "skillsHierarchy" else 0):
        raise ValueError(f"Unexpected row counts in {name}")
    if repeated_dates != {"occupations": 4, "skills": 21}.get(table, 0):
        raise ValueError(f"Unexpected repeated concept count in {name}")
    return {
        "sha256": hashlib.sha256(data).hexdigest(), "bytes": len(data),
        "columns": header, "rows": count, "short_rows": short_rows,
        "repeated_concept_dates": repeated_dates,
        "reuse_status": "pending_review",
    }


def build(archive, destination):
    with closing(sqlite3.connect(destination)) as db:
        with db:
            db.executescript("""
                CREATE TABLE source_rows (
                    member TEXT, record INTEGER, raw_cells TEXT, normalized_cells TEXT,
                    PRIMARY KEY (member, record)
                ) WITHOUT ROWID;
                CREATE TABLE concepts (
                    kind TEXT, uri TEXT PRIMARY KEY, preferred_label TEXT
                ) WITHOUT ROWID;
                CREATE TABLE occupation_skills (
                    occupation_uri TEXT, relation_type TEXT CHECK (relation_type IN ('essential', 'optional')),
                    skill_uri TEXT, PRIMARY KEY (occupation_uri, relation_type, skill_uri)
                ) WITHOUT ROWID;
                CREATE TABLE manifest (document TEXT NOT NULL);
            """)
            members = {f"{table}_en.csv" for table in COUNTS}
            if set(archive.namelist()) != members or len(archive.namelist()) != len(members):
                raise ValueError("Unexpected ESCO archive member list")
            inventory = {
                f"{table}_en.csv": read_member(archive, db, table, count)
                for table, count in COUNTS.items()
            }
            if db.execute("""
                SELECT 1 FROM occupation_skills e
                LEFT JOIN concepts o ON o.uri = e.occupation_uri AND o.kind = 'occupations'
                LEFT JOIN concepts s ON s.uri = e.skill_uri AND s.kind = 'skills'
                WHERE o.uri IS NULL OR s.uri IS NULL LIMIT 1
            """).fetchone():
                raise ValueError("Occupation–skill link has an invalid endpoint")
            manifest = {
                "version": VERSION, "language": "en", "archive_sha256": SHA256,
                "source_url": DOWNLOAD, "members": inventory,
                "validation": ["archive SHA-256", "member inventory and CRC", "CSV shapes and counts",
                               "unique concept and occupation–skill keys", "occupation–skill endpoints"],
                "publication_ready": False,
            }
            db.execute("INSERT INTO manifest VALUES (?)", (json.dumps(manifest, sort_keys=True),))
            return manifest


def stage(source, directory):
    if digest(source) != SHA256:
        raise ValueError("Archive SHA-256 does not match the pinned ESCO v1.2.1 English CSV release")
    directory.mkdir(parents=True, exist_ok=True)
    original = directory / "input.zip"
    database = directory / "staging.sqlite3"
    if original.exists() and digest(original) != SHA256:
        raise ValueError(f"Conflicting staged archive at {original}")
    with tempfile.TemporaryDirectory(dir=directory) as scratch:
        scratch = Path(scratch)
        copy = scratch / "input.zip"
        copy.write_bytes(source.read_bytes())
        if digest(copy) != SHA256:
            raise ValueError("Archive changed while it was being copied")
        csv.field_size_limit(1024 * 1024)
        staged = scratch / database.name
        with ZipFile(copy) as archive:
            manifest = build(archive, staged)
        if database.exists() and digest(database) != digest(staged):
            raise ValueError(f"Conflicting staging database at {database}")
        if not original.exists():
            copy.replace(original)
        if not database.exists():
            staged.replace(database)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("zip", type=Path)
    args = parser.parse_args()
    try:
        manifest = stage(args.zip, ROOT / ".local" / "esco" / f"v{VERSION}")
    except (BadZipFile, csv.Error, OSError, ValueError, sqlite3.Error) as error:
        parser.exit(1, f"ESCO import failed: {error}\n")
    print(json.dumps(manifest, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
