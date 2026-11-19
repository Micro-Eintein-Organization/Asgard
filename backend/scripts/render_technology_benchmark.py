"""Prepare owner-approved posting technology references and one atomic release offline."""

import argparse
from dataclasses import replace
from pathlib import Path
from uuid import uuid5

import render_career_skill_snapshot as base


def technology_key(label):
    return "benchmark-technology/" + str(uuid5(base.UUID_NAMESPACE, base.normalize_skill(label)))


def prepare(records, reviewer):
    careers = base.load_offline_careers()
    approved, by_career, vocabulary = [], {}, {}
    for record in records:
        if record["review_status"] == "rejected":
            continue
        career = base.map_career(record["asgard_career_proposed"], careers)
        if career is None:
            raise ValueError(f"Unresolved career for {record['posting_id']}")
        if base.normalize_skill(record["collected_by"]) == base.normalize_skill(reviewer):
            raise ValueError("Collector and approving reviewer must differ")
        approved.append({**record, "review_status": "verified", "reviewed_by": reviewer})
        for label in record["skills"].split("|"):
            label = " ".join(label.split())
            key = technology_key(label)
            item = vocabulary.setdefault(key, base.OfflineCompetency(key, label))
            by_career.setdefault(career.key, {})[key] = item
    technology_careers = tuple(replace(
        career, competencies=tuple(by_career.get(career.key, {}).values()),
    ) for career in careers)
    return approved, technology_careers, tuple(vocabulary.values())


def reference_sql(vocabulary, reviewer):
    statements = ["BEGIN;", "SELECT pg_advisory_xact_lock(411, 4);"]
    for item in vocabulary:
        uid = base.sql_literal(str(uuid5(base.UUID_NAMESPACE, item.canonical_key)))
        key, label = base.sql_literal(item.canonical_key), base.sql_literal(item.label)
        review = base.sql_literal(reviewer)
        guard = f"""BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.competencies WHERE
   (id={uid}::uuid OR canonical_key={key}) AND
   (id<>{uid}::uuid OR canonical_key<>{key} OR label<>{label}
    OR source<>'posting-technology-vocabulary' OR source_version<>'v1')) THEN
  RAISE EXCEPTION 'Benchmark technology conflicts with an existing canonical reference';
 END IF;
END"""
        tag = "$reference_guard$"
        while tag in guard:
            tag = tag[:-1] + "_$"
        statements.extend([
            f"DO {tag}{guard}{tag};",
            "INSERT INTO asgard_catalog.competencies "
            "(id,canonical_key,label,source,source_version,published,reviewed_by,reviewed_at) "
            f"VALUES ({uid}::uuid,{key},{label},'posting-technology-vocabulary','v1',"
            f"true,{review},statement_timestamp()) ON CONFLICT (id) DO NOTHING;",
            "UPDATE asgard_catalog.competencies SET published=true, "
            f"reviewed_by={review},reviewed_at=statement_timestamp() "
            f"WHERE id={uid}::uuid AND NOT published;",
        ])
    return "\n".join([*statements, "COMMIT;", ""])


def release_sql(records, reviewer, source, version):
    approved, careers, vocabulary = prepare(records, reviewer)
    if len(records) < 15 or len(approved) < 5:
        raise ValueError("Publication requires 15 input records and 5 approved postings")
    rows, report, _summary = base.aggregate_rows(approved, careers, version)
    if not rows or report:
        raise ValueError("Every approved posting skill must resolve to a technology reference")
    postings = base.build_posting_rows(approved, careers)
    parts = [reference_sql(vocabulary, reviewer), base.render_snapshot_sql(rows, source, version),
             base.render_postings_sql(postings, source, version, len(records), len(approved)),
             base.render_publish_sql(source, version, reviewer),
             base.render_postings_publish_sql(source, version, reviewer)]
    bodies = (part.strip().removeprefix("BEGIN;").removesuffix("COMMIT;") for part in parts)
    sql = "BEGIN;\n" + "\n".join(bodies) + "\nCOMMIT;\n"
    return sql, approved, vocabulary, rows


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", type=Path)
    parser.add_argument("--source", required=True)
    parser.add_argument("--source-version", required=True)
    parser.add_argument("--reviewer", required=True)
    parser.add_argument("--approval-reference", required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    for value in (args.source, args.source_version):
        if not base.SOURCE_PATTERN.fullmatch(value):
            parser.error("Invalid source or version")
    if (not base.REVIEWER_PATTERN.fullmatch(args.reviewer)
            or base.is_placeholder_reviewer(args.reviewer)):
        parser.error("A named approving reviewer is required")
    if not args.approval_reference.strip():
        parser.error("Actual owner approval reference is required")
    if base._load_validator()(args.csv_path):
        parser.error("Invalid posting CSV")
    sql, approved, vocabulary, rows = release_sql(
        base.read_records(args.csv_path), args.reviewer, args.source, args.source_version,
    )
    approval = args.approval_reference.replace("\n", " ").replace("\r", " ")
    prefix = f"-- Owner approval: {approval}\n-- Reviewer: {args.reviewer}\n"
    prefix += "-- Preserves all existing learning-path skill records and links.\n"
    base.write_new(args.output, prefix + sql, False)
    print(f"release={args.output}; technologies={len(vocabulary)}; "
          f"postings={len(approved)}; career_skill_mappings={len(rows)}")


if __name__ == "__main__":
    main()
