"""Build an offline ESCO screening ledger for independent review."""

import csv
import hashlib
import json
import re
import sqlite3
import tempfile
from collections import Counter
from contextlib import closing
from pathlib import Path

from import_esco import ROOT, SHA256, VERSION

STAGING = ROOT / ".local" / "esco" / f"v{VERSION}"
POLICY_VERSION = "digital-computing-v2"
ACKNOWLEDGEMENT = "This service uses the ESCO classification of the European Commission."
TECH = re.compile(
    r"\b(?:software|firmware|cyber ?security|cyber attack|ethical hack\w*|"
    r"penetration test\w*|data (?:analy\w*|engineer\w*|scientis\w*|warehouse\w*)|"
    r"machine learning|artificial intelligence|computer\w*|ICT|information technology|"
    r"information systems?|telecom\w*|electronics?|microelectronics|semiconductors?|"
    r"embedded systems?|user (?:interface|experience)|web develop\w*|"
    r"web design\w*|DevOps|database\w*|cloud (?:infrastructure|computing)|"
    r"industrial automation|programmable logic controllers?)\b",
    re.IGNORECASE,
)
AMBIGUOUS = re.compile(
    r"\b(?:digital|automation|robotics?|network|systems?|data|electrical|"
    r"instrumentation|engineering|technical|broadcast|mechatronics?)\b",
    re.IGNORECASE,
)
ADJACENT = re.compile(
    r"\b(?:retail|shop|sales|presales|distribution|teacher|recruiter)\b", re.IGNORECASE,
)


def screen(role, digital_count, essential_count):
    _, _, group, label, aliases, _, _, _, _, scope, definition, _, description, *_ = role
    label_match = TECH.search(label)
    if label_match:
        if ADJACENT.search(label):
            return "needs_review", "Tech domain is explicit, but the role may center on another function."
        return "included", f"Preferred label signals a core tech function ({label_match[0]})."
    signal = TECH.search(" ".join((aliases, scope, definition, description)))
    if group.startswith(("25", "35")) or signal or AMBIGUOUS.search(label):
        return "needs_review", "Occupation group, title, or scope suggests a possible tech function."
    if digital_count >= 2 and digital_count * 2 >= essential_count:
        return "needs_review", "Digital skills account for at least half of the essential links."
    return "excluded", "Screening found no evidence that digital or computing work defines the role."


def occupations(connection):
    roles = {}
    for number, cells in connection.execute("""
        SELECT record, raw_cells FROM source_rows
        WHERE member = 'occupations_en.csv' ORDER BY record
    """):
        row = json.loads(cells)
        roles.setdefault(row[1], (number, row))
    if len(roles) != 3039:
        raise ValueError("Expected 3,039 unique occupations in the pinned archive")
    return roles


def write_ledgers(connection, output):
    roles = occupations(connection)
    digital_skills = {
        json.loads(row)[1]
        for (row,) in connection.execute("""
            SELECT raw_cells FROM source_rows WHERE member = 'digitalSkillsCollection_en.csv'
        """)
    }
    counts = Counter()
    link_counts = Counter()
    with (output / "occupations.csv").open("w", encoding="utf-8", newline="") as role_file, (
        output / "skills.csv"
    ).open("w", encoding="utf-8", newline="") as skill_file:
        role_writer = csv.writer(role_file)
        skill_writer = csv.writer(skill_file)
        role_writer.writerow((
            "occupation_uri", "label", "locator", "draft_disposition", "rationale",
            "essential_links", "essential_digital_links", "reuse_clearance",
            "recommendation_eligibility",
        ))
        skill_writer.writerow((
            "occupation_uri", "skill_uri", "label", "relationship", "locator",
            "draft_disposition", "rationale", "reuse_clearance", "recommendation_eligibility",
        ))
        # The importer preserves logical CSV records, including quoted multiline cells.
        links = {}
        for number, cells in connection.execute("""
            SELECT record, raw_cells FROM source_rows
            WHERE member = 'occupationSkillRelations_en.csv' ORDER BY record
        """):
            role, _, relation, _, skill, label = json.loads(cells)
            links.setdefault(role, []).append((number, relation, skill, label))
        for uri, (number, role) in sorted(roles.items()):
            edges = links.get(uri, [])
            essential = sum(relation == "essential" for _, relation, _, _ in edges)
            digital = sum(
                relation == "essential" and skill in digital_skills
                for _, relation, skill, _ in edges
            )
            disposition, rationale = screen(role, digital, essential)
            counts[disposition] += 1
            role_writer.writerow((
                uri, role[3], f"occupations_en.csv#{number}", disposition, rationale,
                essential, digital, "pending_review", "ineligible",
            ))
            if disposition == "excluded":
                continue
            for link_number, relation, skill, label in edges:
                relevant = skill in digital_skills or bool(TECH.search(label))
                decision = "included" if relevant else "needs_review"
                rationale = (
                    "Source links a digital collection member or tech-labeled skill to this occupation."
                    if relevant else "Review occupational relevance, including transferable skills."
                )
                link_counts[decision] += 1
                skill_writer.writerow((
                    uri, skill, label, relation, f"occupationSkillRelations_en.csv#{link_number}",
                    decision, rationale, "pending_review", "ineligible",
                ))
    return counts, link_counts


def prepare(database, output):
    with closing(sqlite3.connect(database.resolve().as_uri() + "?mode=ro", uri=True)) as db:
        manifest = json.loads(db.execute("SELECT document FROM manifest").fetchone()[0])
        if (manifest["archive_sha256"], manifest["version"], manifest["language"]) != (
            SHA256, VERSION, "en",
        ):
            raise ValueError("Expected the pinned ESCO v1.2.1 English staging database")
        counts, link_counts = write_ledgers(db, output)
    report = {
        "version": VERSION,
        "language": "en",
        "archive_sha256": SHA256,
        "screening_policy": POLICY_VERSION,
        "occupation_dispositions": dict(counts),
        "skill_link_dispositions": dict(link_counts),
        "files": {},
        "clearance": "pending_independent_review",
        "cleared_occupations": 0,
        "cleared_skill_links": 0,
        "acknowledgement": ACKNOWLEDGEMENT,
        "adaptation_notes": "Asgard applies a draft digital and computing occupation scope.",
    }
    for filename in ("occupations.csv", "skills.csv"):
        report["files"][filename] = hashlib.sha256((output / filename).read_bytes()).hexdigest()
    (output / "manifest.json").write_text(
        json.dumps(report, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n",
    )
    return report


def main():
    output = STAGING / f"review-{POLICY_VERSION}"
    with tempfile.TemporaryDirectory(dir=STAGING) as scratch:
        candidate = Path(scratch) / "packet"
        candidate.mkdir()
        report = prepare(STAGING / "staging.sqlite3", candidate)
        if output.exists():
            if any(
                not (output / item.name).is_file()
                or (output / item.name).read_bytes() != item.read_bytes()
                for item in candidate.iterdir()
            ):
                raise SystemExit("Conflicting ESCO review packet. Preserve edits and use a new policy version.")
        else:
            candidate.rename(output)
    print(json.dumps(report, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
