"""Prepare a hash-bound local-test proposal without activating runtime evidence."""

import argparse
import hashlib
import json

from prepare_occupational_release import DESTINATION, check
from review_occupational_release import validate

OUTPUT = DESTINATION / "local-test-overlay.json"
INPUTS = ("manifest.json", "agent-review.json", "review-policy.json")


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def proposal():
    check()
    review = json.loads((DESTINATION / "agent-review.json").read_text(encoding="utf-8"))
    validate(review)
    records = sorted(
        (
            {
                "career_id": row["career_id"],
                "record_id": row["record_id"],
                "competency_id": row["competency_id"],
            }
            for row in review["record_dispositions"]
            if row["record_type"] == "expectation"
            and row["decision"] == "agent_supported"
            and row["classification"] == "core_function"
            and not row["mandatory_requirement"]
        ),
        key=lambda row: (row["career_id"], row["record_id"]),
    )
    supported = {(r["career_id"], r["competency_id"]) for r in records}
    topics = []
    for row in review["topics"]:
        targets = sorted(
            cid for cid in row["competency_ids"] if (row["career_id"], cid) in supported
        )
        if (
            targets
            and row["decision"] == "proposed_partial_coverage"
            and row["coverage"] == "partial"
            and not row["transfers_proficiency"]
            and row["source_locators"]
        ):
            topics.append(
                {
                    "career_id": row["career_id"],
                    "topic_id": row["topic_id"],
                    "competency_ids": targets,
                    "coverage": "partial",
                    "transfers_proficiency": False,
                }
            )
    careers = sorted(s["career_id"] for s in review["summaries"])
    if len(careers) != 12 or {r["career_id"] for r in records} != set(careers):
        raise ValueError("Local test proposal must cover all twelve careers")
    return {
        "release": "occupational-v1-local-test-proposal",
        "author": "Codex",
        "date": "2026-11-04",
        "scope": "owner-selected local testing only",
        "runtime_activation": False,
        "technical_review": "plan approved in chat by self-identified @YakisobaNissin, 2026-11-04",
        "independent_content_review": "unassigned; pending",
        "input_sha256": {name: digest(DESTINATION / name) for name in INPUTS},
        "career_ids": careers,
        "eligible_record_proposals": records,
        "partial_topic_proposals": sorted(topics, key=lambda r: (r["career_id"], r["topic_id"])),
        "limitations": [
            "Agent-supported scope is not independent semantic approval.",
            "Only listed career-specific records may enter local-test recommendation inputs.",
            "No occupational equivalence, target level, mandatory technology or rating transfer.",
            "Source context, disputed and suppressed observations remain outside inference.",
            "Unknown source dates and reuse metadata remain unresolved.",
            "This proposal neither publishes reference data nor changes application behavior.",
        ],
    }


def verify(data):
    if data != proposal():
        raise ValueError("Local test overlay differs from validated source proposal")
    return {
        "careers": len(data["career_ids"]),
        "records": len(data["eligible_record_proposals"]),
        "partial_topics": len(data["partial_topic_proposals"]),
        "runtime_activation": False,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--build", action="store_true")
    args = parser.parse_args()
    if args.build:
        OUTPUT.write_text(json.dumps(proposal(), indent=2) + "\n", encoding="utf-8")
    print(json.dumps(verify(json.loads(OUTPUT.read_text(encoding="utf-8")))))


if __name__ == "__main__":
    main()
