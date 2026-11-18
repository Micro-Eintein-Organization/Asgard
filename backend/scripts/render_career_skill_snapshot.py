"""Render career skill snapshot SQL offline; this script never connects to a database.

The UUID namespace is fixed at 6a66c8cc-7ef6-5c59-9ef5-70e0f0a215cb.
Career keys are the converted career slugs; competency keys are the
career-qualified ``<slug>/core-NN`` keys used by render_competencies.py.
"""

from __future__ import annotations

import argparse
import csv
import importlib.util
import re
import sys
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from uuid import UUID, uuid5

ROOT = Path(__file__).resolve().parents[2]
BACKEND = ROOT / "backend"
SCRIPTS = BACKEND / "scripts"
OUTPUT_DIR = ROOT / ".local" / "career-skill-snapshot"
UUID_NAMESPACE = UUID("6a66c8cc-7ef6-5c59-9ef5-70e0f0a215cb")
ADVISORY_LOCK = (411, 4)
SOURCE_PATTERN = re.compile(r"[A-Za-z0-9 ._:-]+\Z")
REVIEWER_PATTERN = re.compile(r"[A-Za-z0-9 .'-]+\Z")
EXPECTED_HEADER = (
    "posting_id", "job_title", "company", "source_url", "retrieved_on",
    "skills", "asgard_career_proposed", "collected_by", "reviewed_by",
    "review_status",
)

# Existing renderers import sibling backend/scripts modules by their module names.
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
from convert_guide_v4 import convert  # noqa: E402
from guide_resource_selections import SELECTIONS  # noqa: E402


@dataclass(frozen=True)
class OfflineCompetency:
    canonical_key: str
    label: str


@dataclass(frozen=True)
class OfflineCareer:
    key: str
    title: str
    competencies: tuple[OfflineCompetency, ...]


@dataclass(frozen=True)
class SnapshotRow:
    career_key: str
    competency_key: str
    posting_count: int
    total_postings: int
    snapshot_id: UUID


def normalize_skill(value: str) -> str:
    """Match the matcher's casefolded, whitespace-collapsed normalization."""
    return " ".join(value.split()).casefold()


def snapshot_uuid(career_key: str, competency_key: str, source_version: str) -> UUID:
    """Return a stable UUIDv5 under the fixed namespace documented above."""
    return uuid5(UUID_NAMESPACE, f"{career_key}:{competency_key}:{source_version}")


def sql_literal(value: str) -> str:
    """Quote a PostgreSQL string literal, escaping embedded apostrophes."""
    return "'" + value.replace("'", "''") + "'"


def load_offline_careers() -> tuple[OfflineCareer, ...]:
    """Read career slugs, titles, labels and stable competency keys offline."""
    careers = []
    for source_slug in sorted(SELECTIONS):
        guide = convert(BACKEND / "app" / "content" / "guide_v4" / f"{source_slug}.json")
        career = guide["career"]
        slug = career["slug"]
        competencies = tuple(
            OfflineCompetency(f"{slug}/core-{index + 1:02d}", label)
            for index, label in enumerate(career["skills"])
        )
        careers.append(OfflineCareer(slug, career["title"], competencies))
    return tuple(careers)


def map_career(value: str, careers: tuple[OfflineCareer, ...]) -> OfflineCareer | None:
    """Resolve only an exact normalized title or slug, never a fuzzy title."""
    key = normalize_skill(value)
    matches = [career for career in careers
               if key in {normalize_skill(career.title), normalize_skill(career.key)}]
    return matches[0] if len(matches) == 1 else None


def map_competency(value: str, career: OfflineCareer) -> tuple[OfflineCompetency | None, str | None]:
    """Resolve exact normalized labels/keys; report absent or ambiguous matches."""
    key = normalize_skill(value)
    matches = [competency for competency in career.competencies
               if key in {normalize_skill(competency.label), normalize_skill(competency.canonical_key)}]
    if not matches:
        return None, "unmapped skill"
    if len(matches) > 1:
        return None, "ambiguous skill"
    return matches[0], None


def aggregate_rows(records: list[dict[str, str]], careers: tuple[OfflineCareer, ...], source_version: str):
    """Aggregate verified postings; each competency counts once per posting."""
    report: list[dict[str, str]] = []
    summary: Counter[str] = Counter()
    resolved: dict[str, OfflineCareer] = {}
    postings_by_career: dict[str, list[dict[str, str]]] = {}
    for record in records:
        status = record["review_status"]
        if status != "verified":
            summary[status] += 1
            report.append({"posting_id": record["posting_id"], "career": record["asgard_career_proposed"],
                           "skill": "", "reason": f"ignored review_status={status}"})
            continue
        career_text = record["asgard_career_proposed"]
        career = map_career(career_text, careers)
        if career is None:
            summary["unmapped_careers"] += 1
            report.append({"posting_id": record["posting_id"], "career": career_text,
                           "skill": "", "reason": "unmapped or ambiguous career"})
            continue
        resolved[career.key] = career
        postings_by_career.setdefault(career.key, []).append(record)

    counts: Counter[tuple[str, str]] = Counter()
    for career_key, postings in postings_by_career.items():
        career = resolved[career_key]
        for record in postings:
            seen: set[str] = set()
            for raw_skill in record["skills"].split("|"):
                skill_text = raw_skill.strip()
                competency, reason = map_competency(skill_text, career)
                if reason:
                    summary["unmapped_or_ambiguous_skills"] += 1
                    report.append({"posting_id": record["posting_id"], "career": career_key,
                                   "skill": skill_text, "reason": reason})
                    continue
                assert competency is not None
                if competency.canonical_key not in seen:
                    seen.add(competency.canonical_key)
                    counts[(career_key, competency.canonical_key)] += 1

    rows = [SnapshotRow(career_key, competency_key, posting_count,
                        len(postings_by_career[career_key]),
                        snapshot_uuid(career_key, competency_key, source_version))
            for (career_key, competency_key), posting_count in sorted(counts.items())]
    summary["verified"] = sum(len(postings) for postings in postings_by_career.values())
    summary["snapshot_rows"] = len(rows)
    return rows, report, summary


def _values_sql(rows: list[SnapshotRow], source: str, source_version: str) -> str:
    tuples = [
        "(" + ", ".join((sql_literal(str(row.snapshot_id)) + "::uuid", sql_literal(row.career_key),
                          sql_literal(row.competency_key), str(row.posting_count), str(row.total_postings),
                          sql_literal(source), sql_literal(source_version))) + ")"
        for row in rows
    ]
    return "VALUES\n        " + ",\n        ".join(tuples) if tuples else (
        "SELECT NULL::uuid, NULL::text, NULL::text, NULL::integer, NULL::integer, NULL::text, NULL::text WHERE FALSE"
    )


def render_snapshot_sql(rows: list[SnapshotRow], source: str, source_version: str) -> str:
    """Render a guarded, repeat-safe, draft-only snapshot transaction."""
    values = _values_sql(rows, source, source_version)
    lock_a, lock_b = ADVISORY_LOCK
    guard_values = (
        "VALUES\n        " + ",\n        ".join(
            "(" + sql_literal(row.career_key) + ", " + sql_literal(row.competency_key) + ")"
            for row in rows
        ) if rows else "SELECT NULL::text, NULL::text WHERE FALSE"
    )
    return f"""BEGIN;
SELECT pg_advisory_xact_lock({lock_a}, {lock_b});
DO $snapshot_guard$
BEGIN
    IF EXISTS (
        SELECT 1 FROM ({guard_values}) AS input(career_key, competency_key)
        LEFT JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
        LEFT JOIN asgard_catalog.competencies AS competency ON competency.canonical_key = input.competency_key
        WHERE career.id IS NULL OR competency.id IS NULL
    ) THEN
        RAISE EXCEPTION 'Career skill snapshot contains unresolved career or competency keys';
    END IF;
END
$snapshot_guard$;
WITH input(snapshot_id, career_key, competency_key, posting_count, total_postings, source, source_version) AS (
    {values}
)
INSERT INTO asgard_catalog.career_skill_snapshot
    (id, career_id, competency_id, posting_count, total_postings, source, source_version,
     published, reviewed_by, reviewed_at)
SELECT input.snapshot_id, career.id, competency.id, input.posting_count, input.total_postings,
       input.source, input.source_version, false, NULL, NULL
FROM input
JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
JOIN asgard_catalog.competencies AS competency ON competency.canonical_key = input.competency_key
ON CONFLICT (career_id, competency_id, source_version) DO UPDATE
SET posting_count = EXCLUDED.posting_count,
    total_postings = EXCLUDED.total_postings,
    source = EXCLUDED.source
WHERE asgard_catalog.career_skill_snapshot.published = false;
COMMIT;
"""


def render_publish_sql(source: str, source_version: str, reviewer: str) -> str:
    """Render the separately reviewed publication transaction."""
    lock_a, lock_b = ADVISORY_LOCK
    return f"""BEGIN;
SELECT pg_advisory_xact_lock({lock_a}, {lock_b});
UPDATE asgard_catalog.career_skill_snapshot
SET published = true, reviewed_by = {sql_literal(reviewer.strip())}, reviewed_at = now()
WHERE source = {sql_literal(source)}
  AND source_version = {sql_literal(source_version)}
  AND NOT published;
COMMIT;
"""


def read_records(path: Path) -> list[dict[str, str]]:
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if tuple(reader.fieldnames or ()) != EXPECTED_HEADER:
            raise ValueError("CSV header differs from the validated postings schema")
        return [{key: (value or "").strip() for key, value in row.items()} for row in reader]


def _load_validator():
    path = ROOT / "docs" / "data" / "validate_postings.py"
    spec = importlib.util.spec_from_file_location("asgard_validate_postings", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Cannot load validator at {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.validate


def write_new(path: Path, content: str, force: bool) -> None:
    """Write UTF-8/LF output without replacing existing files unless forced."""
    path.parent.mkdir(parents=True, exist_ok=True)
    if path.exists() and not force:
        raise FileExistsError(f"Refusing to overwrite {path}; pass --force")
    with path.open("w" if force else "x", encoding="utf-8", newline="\n") as stream:
        stream.write(content.replace("\r\n", "\n"))


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--source", required=True)
    parser.add_argument("--source-version", required=True)
    parser.add_argument("--publish-reviewed", action="store_true")
    parser.add_argument("--reviewer")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    for name, value in (("--source", args.source), ("--source-version", args.source_version)):
        if not SOURCE_PATTERN.fullmatch(value):
            parser.error(f"{name} may contain only letters, digits, spaces, period, underscore, colon, or hyphen")
    if args.publish_reviewed and not (args.reviewer and REVIEWER_PATTERN.fullmatch(args.reviewer.strip())):
        parser.error("--publish-reviewed requires --reviewer NAME using letters, digits, spaces, period, apostrophe, or hyphen")
    if args.reviewer and not args.publish_reviewed:
        parser.error("--reviewer is only valid with --publish-reviewed")

    if _load_validator()(args.csv_path) != 0:
        raise SystemExit("CSV validation failed; no output was written")
    records = read_records(args.csv_path)
    verified_count = sum(record["review_status"] == "verified" for record in records)
    rows, report, summary = aggregate_rows(records, load_offline_careers(), args.source_version)
    base = OUTPUT_DIR / args.csv_path.stem
    snapshot_path = base.with_suffix(".snapshot.sql")
    report_path = base.with_suffix(".unmapped.csv")
    publish_path = base.with_suffix(".publish.sql")
    if args.publish_reviewed and (len(records) < 15 or verified_count < 5):
        raise SystemExit("Publication requires at least 15 CSV rows and at least 5 verified rows")
    targets = [snapshot_path, report_path] + ([publish_path] if args.publish_reviewed else [])
    if not args.force:
        existing = [path for path in targets if path.exists()]
        if existing:
            raise SystemExit("Refusing to overwrite: " + ", ".join(map(str, existing)) + "; pass --force")

    write_new(snapshot_path, render_snapshot_sql(rows, args.source, args.source_version), args.force)
    with report_path.open("w" if args.force else "x", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=("posting_id", "career", "skill", "reason"), lineterminator="\n")
        writer.writeheader()
        writer.writerows(report)
    if args.publish_reviewed:
        write_new(publish_path, render_publish_sql(args.source, args.source_version, args.reviewer), args.force)
    print("Summary: " + ", ".join(f"{key}={value}" for key, value in sorted(summary.items())))
    print(f"ignored_pending={summary['pending']}, ignored_rejected={summary['rejected']}")
    print(f"snapshot_sql={snapshot_path}")
    print(f"unmapped_report={report_path}")
    if args.publish_reviewed:
        print(f"publish_sql={publish_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())