"""Render draft skill mappings; never connect or publish approval."""

import argparse
from datetime import UTC, datetime
from pathlib import Path

from convert_guide_v4 import convert
from guide_resource_selections import SELECTIONS
from render_content_release import identifier, literal

ROOT = Path(__file__).resolve().parents[1]


def render(*, publish_reviewed=False, reviewer=None):
    if publish_reviewed and (not reviewer or not reviewer.strip()):
        raise ValueError("Reviewed publication requires the recorded reviewer name")
    reviewed_at = datetime.now(UTC).isoformat()
    statements = ["BEGIN;", "SELECT pg_advisory_xact_lock(411, 1);"]
    for slug in sorted(SELECTIONS):
        guide = convert(ROOT / "app/content/guide_v4" / f"{slug}.json")
        topics = [t for m in guide["roadmap"]["milestones"] for t in m["topics"]]
        for index, label in enumerate(guide["career"]["skills"]):
            # Career-qualified identities avoid unreviewed equivalence across curricula.
            key = f"{guide['career']['slug']}/core-{index + 1:02d}"
            cid = identifier("competency/" + key)
            values = [cid, key, label, "Asgard-authored", "guide-v4-2026-11-04"]
            where = " AND ".join(
                f"{column} IS NOT DISTINCT FROM {literal(value)}"
                for column, value in zip(
                    ("id", "canonical_key", "label", "source", "source_version"),
                    values,
                    strict=True,
                )
            )
            statements.append(
                "INSERT INTO "
                "asgard_catalog.competencies(id,canonical_key,label,source,source_version) "
                "VALUES (" + ",".join(literal(v) for v in values) + ") ON CONFLICT(id) DO NOTHING;"
            )
            statements.append(
                "DO $$ BEGIN IF NOT EXISTS(SELECT 1 FROM asgard_catalog.competencies WHERE "
                + where
                + ") THEN RAISE EXCEPTION 'Conflicting skill reference'; END IF; END $$;"
            )
            if publish_reviewed:
                statements.append(
                    "UPDATE asgard_catalog.competencies SET published=true,reviewed_by="
                    + literal(reviewer.strip())
                    + ",reviewed_at="
                    + literal(reviewed_at)
                    + " WHERE id="
                    + literal(cid)
                    + " AND NOT published;"
                )
            for topic in topics:
                if topic["title"].strip().casefold() == label.strip().casefold():
                    statements.append(
                        "INSERT INTO "
                        "asgard_catalog.competency_links("
                        "competency_id,career_id,roadmap_id,topic_id) "
                        "VALUES ("
                        + ",".join(
                            literal(v)
                            for v in (
                                cid,
                                guide["career"]["id"],
                                guide["roadmap"]["id"],
                                topic["id"],
                            )
                        )
                        + ") ON CONFLICT DO NOTHING;"
                    )
    statements.append("COMMIT;")
    return "\n".join(statements) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--publish-reviewed",
        action="store_true",
        help="Render publication only after recorded content approval",
    )
    parser.add_argument("--reviewer", help="Name from the completed content review")
    args = parser.parse_args()
    if args.publish_reviewed and not (args.reviewer and args.reviewer.strip()):
        parser.error("--publish-reviewed requires --reviewer")
    print(render(publish_reviewed=args.publish_reviewed, reviewer=args.reviewer), end="")
