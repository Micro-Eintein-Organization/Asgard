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

SCRIPTS = Path(__file__).resolve().parent
BACKEND = SCRIPTS.parent
ROOT = BACKEND.parent
OUTPUT_DIR = ROOT / ".local" / "career-skill-snapshot"
ALIAS_PATH = ROOT / "docs" / "data" / "competency_aliases.csv"
UUID_NAMESPACE = UUID("6a66c8cc-7ef6-5c59-9ef5-70e0f0a215cb")
ADVISORY_LOCK = (411, 4)
SOURCE_PATTERN = re.compile(r"[A-Za-z0-9 ._:-]+\Z")
REVIEWER_PATTERN = re.compile(r"[A-Za-z0-9 .'-]+\Z")
PLACEHOLDER_REVIEWERS = {
    "test-only", "test", "tbd", "todo", "placeholder", "unknown", "n/a", "na",
}
EXPECTED_HEADER = (
    "posting_id", "job_title", "company", "source_url", "retrieved_on",
    "skills", "asgard_career_proposed", "collected_by", "reviewed_by",
    "review_status",
)
EXPECTED_ALIAS_HEADER = ("career_slug", "competency_key", "alias", "reviewed_by")

# Existing renderers import sibling backend/scripts modules by their module names.
if str(SCRIPTS) not in sys.path:
    sys.path.insert(0, str(SCRIPTS))
from convert_guide_v4 import convert  # noqa: E402
from guide_resource_selections import SELECTIONS  # noqa: E402


@dataclass(frozen=True)
class OfflineCompetency:
    canonical_key: str
    label: str
    aliases: tuple[str, ...] = ()


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


@dataclass(frozen=True)
class PostingRow:
    career_key: str
    posting_id: str
    job_title: str
    company: str
    source_url: str
    retrieved_on: str
    skill_labels: tuple[str, ...]
    collected_by: str
    reviewed_by: str


def normalize_skill(value: str) -> str:
    """Match the matcher's casefolded, whitespace-collapsed normalization."""
    return " ".join(value.split()).casefold()


def is_placeholder_reviewer(value: str) -> bool:
    normalized = normalize_skill(value)
    return normalized in {normalize_skill(item) for item in PLACEHOLDER_REVIEWERS}


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


def load_aliases(
    path: Path,
    careers: tuple[OfflineCareer, ...],
    allow_placeholder_reviewers: bool = False,
) -> tuple[tuple[OfflineCareer, ...], tuple[int, ...]]:
    """Load reviewed exact aliases; return careers and duplicate CSV row numbers."""
    if not path.exists():
        return careers, ()

    competencies = {
        career.key: {item.canonical_key: item for item in career.competencies}
        for career in careers
    }
    aliases: dict[tuple[str, str], list[str]] = {}
    seen_alias_owners: dict[tuple[str, str], str] = {}
    seen_rows: set[tuple[str, ...]] = set()
    duplicate_rows: list[int] = []

    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        if tuple(reader.fieldnames or ()) != EXPECTED_ALIAS_HEADER:
            raise ValueError(
                "Alias CSV row 1: header must exactly match "
                + ",".join(EXPECTED_ALIAS_HEADER)
            )

        for row in reader:
            row_number = reader.line_num
            raw_values = tuple((row.get(name) or "") for name in EXPECTED_ALIAS_HEADER)
            if raw_values in seen_rows:
                duplicate_rows.append(row_number)
                continue
            seen_rows.add(raw_values)

            career_slug, competency_key, alias, reviewed_by = (
                value.strip() for value in raw_values
            )
            if competency_key.split("/", 1)[0] != career_slug:
                raise ValueError(
                    f"Alias CSV row {row_number}: career_slug does not match competency_key prefix"
                )
            career_competencies = competencies.get(career_slug)
            if career_competencies is None or competency_key not in career_competencies:
                raise ValueError(
                    f"Alias CSV row {row_number}: competency_key is not an offline "
                    "competency for career_slug"
                )
            normalized = normalize_skill(alias)
            if not normalized:
                raise ValueError(f"Alias CSV row {row_number}: alias must not be blank")
            if not reviewed_by:
                raise ValueError(f"Alias CSV row {row_number}: reviewed_by must not be blank")
            if not allow_placeholder_reviewers and is_placeholder_reviewer(reviewed_by):
                raise ValueError(
                    f"Alias CSV row {row_number}: reviewed_by must not be a placeholder"
                )

            owner_key = (career_slug, normalized)
            previous_owner = seen_alias_owners.get(owner_key)
            if previous_owner is not None and previous_owner != competency_key:
                raise ValueError(
                    f"Alias CSV row {row_number}: normalized alias maps to two "
                    "competencies in one career"
                )
            seen_alias_owners[owner_key] = competency_key
            alias_values = aliases.setdefault((career_slug, competency_key), [])
            if normalized not in {normalize_skill(value) for value in alias_values}:
                alias_values.append(alias)

    aliased_careers = tuple(
        OfflineCareer(
            career.key,
            career.title,
            tuple(
                OfflineCompetency(
                    item.canonical_key,
                    item.label,
                    tuple(aliases.get((career.key, item.canonical_key), ())),
                )
                for item in career.competencies
            ),
        )
        for career in careers
    )
    return aliased_careers, tuple(duplicate_rows)


def map_career(value: str, careers: tuple[OfflineCareer, ...]) -> OfflineCareer | None:
    """Resolve only an exact normalized title or slug, never a fuzzy title."""
    key = normalize_skill(value)
    matches = [career for career in careers
               if key in {normalize_skill(career.title), normalize_skill(career.key)}]
    return matches[0] if len(matches) == 1 else None


def map_competency(
    value: str, career: OfflineCareer
) -> tuple[OfflineCompetency | None, str | None]:
    """Resolve exact normalized labels/keys; report absent or ambiguous matches."""
    key = normalize_skill(value)
    matches = [
        competency
        for competency in career.competencies
        if key in {
            normalize_skill(competency.label),
            normalize_skill(competency.canonical_key),
            *(normalize_skill(alias) for alias in competency.aliases),
        }
    ]
    if not matches:
        return None, "unmapped skill"
    if len(matches) > 1:
        return None, "ambiguous skill"
    return matches[0], None


def aggregate_rows(
    records: list[dict[str, str]],
    careers: tuple[OfflineCareer, ...],
    source_version: str,
):
    """Aggregate verified postings; each competency counts once per posting."""
    report: list[dict[str, str]] = []
    summary: Counter[str] = Counter()
    resolved: dict[str, OfflineCareer] = {}
    postings_by_career: dict[str, list[dict[str, str]]] = {}
    unmapped_postings: dict[tuple[str, str], tuple[str, set[str]]] = {}
    total_skill_mentions = 0
    mapped_skill_mentions = 0
    for record in records:
        status = record["review_status"]
        if status != "verified":
            summary[status] += 1
            report.append(
                {
                    "posting_id": record["posting_id"],
                    "career": record["asgard_career_proposed"],
                    "skill": "",
                    "reason": f"ignored review_status={status}",
                }
            )
            continue
        career_text = record["asgard_career_proposed"]
        skill_mentions = record["skills"].split("|")
        total_skill_mentions += len(skill_mentions)
        career = map_career(career_text, careers)
        if career is None:
            summary["unmapped_careers"] += 1
            report.append(
                {
                    "posting_id": record["posting_id"],
                    "career": career_text,
                    "skill": "",
                    "reason": "unmapped or ambiguous career",
                }
            )
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
                    if reason == "unmapped skill":
                        normalized = normalize_skill(skill_text)
                        key = (career_key, normalized)
                        _, posting_ids = unmapped_postings.setdefault(
                            key, (skill_text, set())
                        )
                        posting_ids.add(record["posting_id"])
                    continue
                assert competency is not None
                mapped_skill_mentions += 1
                if competency.canonical_key not in seen:
                    seen.add(competency.canonical_key)
                    counts[(career_key, competency.canonical_key)] += 1

    rows = [SnapshotRow(career_key, competency_key, posting_count,
                        len(postings_by_career[career_key]),
                        snapshot_uuid(career_key, competency_key, source_version))
            for (career_key, competency_key), posting_count in sorted(counts.items())]
    summary["verified"] = sum(len(postings) for postings in postings_by_career.values())
    summary["total_skill_mentions"] = total_skill_mentions
    summary["mapped_skill_mentions"] = mapped_skill_mentions
    summary["mapped_ratio"] = (
        mapped_skill_mentions / total_skill_mentions if total_skill_mentions else 0.0
    )
    summary["snapshot_rows"] = len(rows)

    for entry in report:
        entry["section"] = "details"
        entry["rank"] = ""
        entry["verified_postings"] = ""
    ranked_unmapped = sorted(
        unmapped_postings.items(),
        key=lambda item: (-len(item[1][1]), item[0][0].casefold(), item[0][1]),
    )
    report.extend(
        {
            "section": "ranked_unmapped_skills",
            "rank": str(rank),
            "posting_id": "",
            "career": career_key,
            "skill": display,
            "verified_postings": str(len(posting_ids)),
            "reason": "unmapped skill",
        }
        for rank, ((career_key, _), (display, posting_ids)) in enumerate(
            ranked_unmapped, start=1
        )
    )
    return rows, report, summary


def build_posting_rows(
    records: list[dict[str, str]], careers: tuple[OfflineCareer, ...]
) -> list[PostingRow]:
    """Keep verified, career-resolved posting facts for the separate postings table."""
    result = []
    for record in records:
        if record["review_status"] != "verified":
            continue
        career = map_career(record["asgard_career_proposed"], careers)
        if career is None:
            continue
        result.append(
            PostingRow(
                career_key=career.key,
                posting_id=record["posting_id"],
                job_title=record["job_title"],
                company=record["company"],
                source_url=record["source_url"],
                retrieved_on=record["retrieved_on"],
                skill_labels=tuple(
                    label.strip() for label in record["skills"].split("|")
                ),
                collected_by=record["collected_by"],
                reviewed_by=record["reviewed_by"],
            )
        )
    return result


def _posting_values_sql(
    rows: list[PostingRow], source: str, source_version: str
) -> str:
    tuples = []
    for row in rows:
        labels = "ARRAY[" + ", ".join(map(sql_literal, row.skill_labels)) + "]::text[]"
        tuples.append(
            "(" + ", ".join(
                (
                    sql_literal(source),
                    sql_literal(source_version),
                    sql_literal(row.posting_id),
                    sql_literal(row.career_key),
                    sql_literal(row.job_title),
                    sql_literal(row.company),
                    sql_literal(row.source_url),
                    sql_literal(row.retrieved_on) + "::date",
                    labels,
                    sql_literal(row.collected_by),
                    sql_literal(row.reviewed_by),
                )
            ) + ")"
        )
    if tuples:
        return "VALUES\n        " + ",\n        ".join(tuples)
    return (
        "SELECT NULL::text, NULL::text, NULL::text, NULL::text, NULL::text, "
        "NULL::text, NULL::text, NULL::date, NULL::text[], NULL::text, NULL::text "
        "WHERE FALSE"
    )


def _posting_lock_sql(source: str) -> str:
    """Return the shared publisher/importer lock expression for one source."""
    lock_key = sql_literal("asgard:career-skill-postings:" + source)
    return f"SELECT pg_advisory_xact_lock(hashtextextended({lock_key}, 411));"


def render_postings_sql(
    rows: list[PostingRow],
    source: str,
    source_version: str,
    input_row_count: int,
    verified_row_count: int,
) -> str:
    """Render an offline, draft-only replacement for one source/version."""
    values = _posting_values_sql(rows, source, source_version)
    career_values = (
        "VALUES\n        " + ",\n        ".join(
            "(" + sql_literal(row.posting_id) + ", " + sql_literal(row.career_key) + ")"
            for row in rows
        )
        if rows
        else "SELECT NULL::text, NULL::text WHERE FALSE"
    )
    return f"""BEGIN;
{_posting_lock_sql(source)}
DO $posting_draft_guard$
BEGIN
    IF EXISTS (
        SELECT 1 FROM asgard_catalog.career_skill_posting_versions
        WHERE source = {sql_literal(source)}
          AND source_version = {sql_literal(source_version)}
          AND status <> 'draft'
    ) THEN
        RAISE EXCEPTION 'Published or retired posting versions cannot be replaced by a draft';
    END IF;
    IF EXISTS (
        SELECT 1 FROM ({career_values}) AS input(posting_id, career_key)
        LEFT JOIN asgard_catalog.careers AS career ON career.slug = input.career_key
        WHERE career.id IS NULL
    ) THEN
        RAISE EXCEPTION 'Career postings contain an unresolved career key';
    END IF;
END
$posting_draft_guard$;
INSERT INTO asgard_catalog.career_skill_posting_versions
    (source, source_version, input_row_count, verified_row_count, posting_count, status)
VALUES (
    {sql_literal(source)}, {sql_literal(source_version)}, {input_row_count},
    {verified_row_count}, {len(rows)}, 'draft'
)
ON CONFLICT (source, source_version) DO UPDATE
SET input_row_count = EXCLUDED.input_row_count,
    verified_row_count = EXCLUDED.verified_row_count,
    posting_count = EXCLUDED.posting_count
WHERE asgard_catalog.career_skill_posting_versions.status = 'draft';
DELETE FROM asgard_catalog.career_skill_postings
WHERE source = {sql_literal(source)}
  AND source_version = {sql_literal(source_version)};
WITH input(source, source_version, posting_id, career_key, job_title, company,
           source_url, retrieved_on, skill_labels, collected_by, record_reviewed_by) AS (
    {values}
)
INSERT INTO asgard_catalog.career_skill_postings
    (source, source_version, posting_id, career_id, job_title, company, source_url,
     retrieved_on, skill_labels, collected_by, reviewed_by)
SELECT input.source, input.source_version, input.posting_id, career.id,
       input.job_title, input.company, input.source_url, input.retrieved_on,
       input.skill_labels, input.collected_by, input.record_reviewed_by
FROM input
JOIN asgard_catalog.careers AS career ON career.slug = input.career_key;
COMMIT;
"""


def render_postings_publish_sql(
    source: str, source_version: str, reviewer: str
) -> str:
    """Render atomic publication and source-local retirement for a reviewed version."""
    return f"""BEGIN;
{_posting_lock_sql(source)}
DO $posting_publish_guard$
DECLARE target asgard_catalog.career_skill_posting_versions%ROWTYPE;
        actual_posting_count integer;
BEGIN
    SELECT * INTO target
    FROM asgard_catalog.career_skill_posting_versions
    WHERE source = {sql_literal(source)}
      AND source_version = {sql_literal(source_version)}
    FOR UPDATE;
    IF NOT FOUND OR target.status <> 'draft' THEN
        RAISE EXCEPTION 'Target career posting version is not an unpublished draft';
    END IF;
    IF target.input_row_count < 15 OR target.verified_row_count < 5
       OR target.posting_count < 1 THEN
        RAISE EXCEPTION 'Career posting version does not meet publication requirements';
    END IF;
    SELECT count(*) INTO actual_posting_count
    FROM asgard_catalog.career_skill_postings
    WHERE source = target.source AND source_version = target.source_version;
    IF actual_posting_count <> target.posting_count THEN
        RAISE EXCEPTION 'Career posting draft row count does not match its manifest';
    END IF;
END
$posting_publish_guard$;
UPDATE asgard_catalog.career_skill_posting_versions
SET status = 'retired', retired_at = now()
WHERE source = {sql_literal(source)} AND status = 'published';
UPDATE asgard_catalog.career_skill_posting_versions
SET status = 'published', reviewed_by = {sql_literal(reviewer.strip())},
    reviewed_at = now(), published_at = now()
WHERE source = {sql_literal(source)}
  AND source_version = {sql_literal(source_version)}
  AND status = 'draft';
COMMIT;
"""


def _values_sql(rows: list[SnapshotRow], source: str, source_version: str) -> str:
    tuples = [
        "(" + ", ".join(
            (
                sql_literal(str(row.snapshot_id)) + "::uuid",
                sql_literal(row.career_key),
                sql_literal(row.competency_key),
                str(row.posting_count),
                str(row.total_postings),
                sql_literal(source),
                sql_literal(source_version),
            )
        ) + ")"
        for row in rows
    ]
    return "VALUES\n        " + ",\n        ".join(tuples) if tuples else (
        "SELECT NULL::uuid, NULL::text, NULL::text, NULL::integer, "
        "NULL::integer, NULL::text, NULL::text WHERE FALSE"
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
"""  # noqa: E501


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


def validate_posting_reviewers(path: Path, allow_placeholder_reviewers: bool) -> None:
    if allow_placeholder_reviewers:
        return
    with path.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        for row in reader:
            row_number = reader.line_num
            status = (row.get("review_status") or "").strip()
            reviewer = (row.get("reviewed_by") or "").strip()
            if status == "verified" and is_placeholder_reviewer(reviewer):
                raise ValueError(
                    f"Postings CSV row {row_number}: reviewed_by must not be a placeholder"
                )


def output_paths(csv_path: Path, allow_placeholder_reviewers: bool) -> tuple[Path, Path, Path]:
    stem = csv_path.stem
    if allow_placeholder_reviewers:
        stem = f"SCRATCH-{stem}"
    base = OUTPUT_DIR / stem
    return (
        Path(f"{base}.snapshot.sql"),
        Path(f"{base}.unmapped.csv"),
        Path(f"{base}.publish.sql"),
    )


def posting_output_paths(
    csv_path: Path, allow_placeholder_reviewers: bool
) -> tuple[Path, Path]:
    """Return separate draft and publication SQL paths for collected postings."""
    stem = csv_path.stem
    if allow_placeholder_reviewers:
        stem = f"SCRATCH-{stem}"
    base = OUTPUT_DIR / stem
    return Path(f"{base}.postings.sql"), Path(f"{base}.postings-publish.sql")


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
    parser.add_argument("--aliases", type=Path, default=ALIAS_PATH)
    parser.add_argument("--allow-placeholder-reviewers", action="store_true")
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()
    if args.allow_placeholder_reviewers and args.publish_reviewed:
        parser.error("--allow-placeholder-reviewers cannot be used with --publish-reviewed")
    for name, value in (("--source", args.source), ("--source-version", args.source_version)):
        if not SOURCE_PATTERN.fullmatch(value):
            parser.error(
                f"{name} may contain only letters, digits, spaces, period, "
                "underscore, colon, or hyphen"
            )
    if args.publish_reviewed and not (
        args.reviewer and REVIEWER_PATTERN.fullmatch(args.reviewer.strip())
    ):
        parser.error(
            "--publish-reviewed requires --reviewer NAME using letters, digits, "
            "spaces, period, apostrophe, or hyphen"
        )
    if args.reviewer and not args.publish_reviewed:
        parser.error("--reviewer is only valid with --publish-reviewed")

    if _load_validator()(args.csv_path) != 0:
        raise SystemExit("CSV validation failed; no output was written")
    validate_posting_reviewers(args.csv_path, args.allow_placeholder_reviewers)
    records = read_records(args.csv_path)
    verified_count = sum(record["review_status"] == "verified" for record in records)
    try:
        careers, duplicate_alias_rows = load_aliases(
            args.aliases,
            load_offline_careers(),
            args.allow_placeholder_reviewers,
        )
    except ValueError as exc:
        parser.error(str(exc))
    rows, report, summary = aggregate_rows(records, careers, args.source_version)
    postings = build_posting_rows(records, careers)
    snapshot_path, report_path, publish_path = output_paths(
        args.csv_path, args.allow_placeholder_reviewers
    )
    postings_path, postings_publish_path = posting_output_paths(
        args.csv_path, args.allow_placeholder_reviewers
    )
    if args.publish_reviewed and (len(records) < 15 or verified_count < 5):
        raise SystemExit("Publication requires at least 15 CSV rows and at least 5 verified rows")
    targets = [snapshot_path, report_path, postings_path]
    if args.publish_reviewed:
        targets.extend((publish_path, postings_publish_path))
    if not args.force:
        existing = [path for path in targets if path.exists()]
        if existing:
            raise SystemExit(
                "Refusing to overwrite: "
                + ", ".join(map(str, existing))
                + "; pass --force"
            )

    write_new(
        snapshot_path,
        render_snapshot_sql(rows, args.source, args.source_version),
        args.force,
    )
    write_new(
        postings_path,
        render_postings_sql(
            postings,
            args.source,
            args.source_version,
            len(records),
            verified_count,
        ),
        args.force,
    )
    with report_path.open("w" if args.force else "x", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(
            stream,
            fieldnames=(
                "section",
                "rank",
                "posting_id",
                "career",
                "skill",
                "verified_postings",
                "reason",
            ),
            lineterminator="\n",
        )
        writer.writeheader()
        writer.writerows(report)
    if args.publish_reviewed:
        write_new(
            publish_path,
            render_publish_sql(args.source, args.source_version, args.reviewer),
            args.force,
        )
        write_new(
            postings_publish_path,
            render_postings_publish_sql(
                args.source, args.source_version, args.reviewer
            ),
            args.force,
        )
    print("Summary: " + ", ".join(f"{key}={value}" for key, value in sorted(summary.items())))
    if duplicate_alias_rows:
        print("duplicate_alias_rows=" + ",".join(map(str, duplicate_alias_rows)))
    print(f"ignored_pending={summary['pending']}, ignored_rejected={summary['rejected']}")
    print(f"snapshot_sql={snapshot_path}")
    print(f"postings_sql={postings_path}")
    print(f"unmapped_report={report_path}")
    if args.publish_reviewed:
        print(f"publish_sql={publish_path}")
        print(f"postings_publish_sql={postings_publish_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
