"""Validate hand-collected job posting CSV rows without network access."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

EXPECTED_HEADER = [
    "posting_id",
    "job_title",
    "company",
    "source_url",
    "retrieved_on",
    "skills",
    "asgard_career_proposed",
    "collected_by",
    "reviewed_by",
    "review_status",
]
REVIEW_STATUSES = {"pending", "verified", "rejected"}
DATE_PATTERN = re.compile(r"\d{4}-\d{2}-\d{2}\Z")
READABLE_SLUG_PATTERN = re.compile(r"[A-Za-z]+(?:-[A-Za-z]+)+\Z")


def looks_like_placeholder_url(value: str) -> bool:
    """Flag readable no-digit job slugs for review; this is not proof."""
    try:
        parsed = urlsplit(value)
        last_segment = parsed.path.rstrip("/").rsplit("/", 1)[-1]
        if READABLE_SLUG_PATTERN.fullmatch(last_segment):
            return True
        return any(
            READABLE_SLUG_PATTERN.fullmatch(candidate)
            for candidate in parse_qs(parsed.query).get("jk", [])
        )
    except ValueError:
        return False


def validate(path: Path) -> int:
    errors = 0
    warnings = 0
    row_count = 0
    status_counts: Counter[str] = Counter()
    seen_posting_ids: set[str] = set()
    seen_source_urls: set[str] = set()

    def error(row_number: int, message: str) -> None:
        nonlocal errors
        errors += 1
        print(f"ERROR row {row_number}: {message}")

    def warning(row_number: int | None, message: str) -> None:
        nonlocal warnings
        warnings += 1
        location = f" row {row_number}" if row_number is not None else ""
        print(f"WARNING{location}: {message}")

    try:
        with path.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.reader(csv_file)
            header = next(reader, None)
            if header != EXPECTED_HEADER:
                error(1, f"header must exactly match {','.join(EXPECTED_HEADER)}")

            for row in reader:
                row_number = reader.line_num
                if not row or all(not cell.strip() for cell in row):
                    continue

                row_count += 1
                if len(row) != len(EXPECTED_HEADER):
                    error(
                        row_number,
                        f"expected {len(EXPECTED_HEADER)} columns, found {len(row)}",
                    )
                record = {
                    name: row[index].strip() if index < len(row) else ""
                    for index, name in enumerate(EXPECTED_HEADER)
                }

                posting_id = record["posting_id"]
                if not posting_id:
                    error(row_number, "posting_id must not be empty")
                elif posting_id in seen_posting_ids:
                    error(row_number, f"duplicate posting_id: {posting_id}")
                else:
                    seen_posting_ids.add(posting_id)

                for field in ("job_title", "company", "source_url"):
                    if not record[field]:
                        error(row_number, f"{field} must not be empty")

                source_url = record["source_url"]
                if source_url:
                    if source_url in seen_source_urls:
                        error(row_number, "duplicate source_url")
                    else:
                        seen_source_urls.add(source_url)

                    if not source_url.startswith("https://"):
                        error(row_number, "source_url must start with https://")
                    else:
                        try:
                            parsed_url = urlsplit(source_url)
                            if not parsed_url.netloc:
                                error(row_number, "source_url must include a host")
                            elif parsed_url.path in ("", "/"):
                                error(row_number, "source_url must not be a bare homepage")
                            if looks_like_placeholder_url(source_url):
                                warning(
                                    row_number,
                                    "source_url looks like a placeholder; re-check the real posting URL",
                                )
                        except ValueError:
                            error(row_number, "source_url is malformed")

                retrieved_on = record["retrieved_on"]
                if not DATE_PATTERN.fullmatch(retrieved_on):
                    error(row_number, "retrieved_on must use YYYY-MM-DD format")
                else:
                    try:
                        retrieved_date = date.fromisoformat(retrieved_on)
                        if retrieved_date > date.today():
                            error(row_number, "retrieved_on must not be in the future")
                    except ValueError:
                        error(row_number, "retrieved_on is not a valid calendar date")

                skill_labels = [label.strip() for label in record["skills"].split("|")]
                if len([label for label in skill_labels if label]) < 2:
                    error(row_number, "skills must contain at least 2 non-empty labels separated by |")
                if any(not label for label in skill_labels):
                    error(row_number, "skills must not contain empty labels")
                for label in skill_labels:
                    if len(label) > 40:
                        error(row_number, "skill labels must be no longer than 40 characters")

                review_status = record["review_status"]
                if review_status not in REVIEW_STATUSES:
                    error(
                        row_number,
                        "review_status must be one of: pending, verified, rejected",
                    )
                else:
                    status_counts[review_status] += 1
    except (OSError, UnicodeError, csv.Error) as exc:
        error(1, f"could not read CSV: {exc}")

    if row_count < 15:
        warning(None, f"fewer than 15 rows (found {row_count})")
    if status_counts["verified"] < 5:
        warning(None, f"fewer than 5 verified rows (found {status_counts['verified']})")

    print(
        "Summary: "
        f"rows={row_count}, verified={status_counts['verified']}, "
        f"pending={status_counts['pending']}, rejected={status_counts['rejected']}"
    )
    return 1 if errors else 0


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Validate a hand-collected job postings CSV."
    )
    parser.add_argument("csv_path", type=Path, help="path to the CSV file")
    args = parser.parse_args()
    return validate(args.csv_path)


if __name__ == "__main__":
    sys.exit(main())
