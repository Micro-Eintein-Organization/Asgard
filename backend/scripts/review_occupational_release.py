"""Build an inactive, policy-assisted agent review; never publish semantic approval."""

import argparse
import hashlib
import json
from collections import Counter, defaultdict

from convert_guide_v4 import convert
from prepare_occupational_release import DESTINATION, ROOT, check, read_tables
from render_content_release import identifier


def build():
    check(include_review=False)
    tables = read_tables(DESTINATION)
    policy = json.loads((DESTINATION / "review-policy.json").read_text(encoding="utf-8"))
    competencies = {r["competency_id"]: r for r in tables["competencies"]}
    roles = {r["occupation_id"]: r for r in tables["source_occupations"]}
    groups = defaultdict(list)
    for row in tables["expectations"]:
        groups[
            (
                row["occupation_id"],
                row["competency_id"],
                row["native_scale"],
                row["observation_date"],
            )
        ].append(row)
    conflicts = {
        r["expectation_id"]
        for rows in groups.values()
        if len({r["native_level"] for r in rows}) > 1
        for r in rows
    }
    summaries, decisions, topics, skills, relationship_reviews = [], [], [], [], []
    for career in tables["careers"]:
        scope = policy["careers"][career["slug"]]
        links = [
            r
            for r in tables["crosswalks"]
            if r["from_type"] == "asgard_career" and r["from_id"] == career["career_id"]
        ]
        occupation_ids = {r["to_id"] for r in links}
        inherited = [r for r in tables["expectations"] if r["occupation_id"] in occupation_ids]
        for link in links:
            role = roles[link["to_id"]]
            relation = (
                "broader"
                if role["source_id"] == "SRC-01"
                or role["title"]
                in ("Software Developers", "Computer Hardware Engineers", "Web Developers")
                else "related"
            )
            relationship_reviews.append(
                {
                    "crosswalk_id": link["crosswalk_id"],
                    "career_id": career["career_id"],
                    "relationship": relation,
                    "decision": "retain_scoped_reference",
                    "equivalence_accepted": False,
                    "source_locator": role["locator"],
                    "role_description": role["description"],
                    "rationale": scope["scope"],
                    "source_level_verified": False,
                    "independent_review": "pending",
                }
            )
        for row in inherited:
            competency = competencies[row["competency_id"]]
            status, kind = "retained_context", "source_context"
            reason = "Scoped reference only; inheritance is not a career requirement."
            if competency["type"] == "technology_example":
                kind = "technology_example"
                reason = "Technology example only; no mandatory requirement or user proficiency."
            elif competency["label"] in scope["core_labels"]:
                status, kind = "agent_supported", "core_function"
                reason = "Explicit agent scope selection: " + scope["scope"]
            elif competency["type"] in ("essential_skills", "transferable_skills"):
                kind = "supporting_competency"
                reason = "Supporting context only; no occupational equivalence or threshold."
            if row["expectation_id"] in conflicts:
                status, kind, reason = (
                    "disputed",
                    "source_context",
                    "Repeated observations disagree within the same source "
                    "role/competency/scale/date; retain originals and withhold a unique "
                    "expectation.",
                )
            if row["suppression"].upper() in ("Y", "YES", "TRUE") or row[
                "not_relevant"
            ].upper() in ("Y", "YES", "TRUE"):
                status, kind, reason = (
                    "excluded",
                    "source_context",
                    "Source suppression/not-relevant flag prevents use as accepted expectation.",
                )
            if row["source_id"] == "SRC-13" and row["locator"].startswith("PDF page 65"):
                status, kind, reason = (
                    "disputed",
                    "source_context",
                    "Original page 65 right table is Security Architect; do not assign its "
                    "levels to Security Analyst.",
                )
            decisions.append(
                {
                    "career_id": career["career_id"],
                    "record_type": "expectation",
                    "record_id": row["expectation_id"],
                    "competency_id": row["competency_id"],
                    "decision": status,
                    "classification": kind,
                    "rationale": reason,
                    "source_locator": row["locator"],
                    "native_scale": row["native_scale"],
                    "native_level": row["native_level"],
                    "mandatory_requirement": False,
                    "inference_eligible": False,
                    "independent_review": "pending",
                }
            )
        for row in tables["tasks"]:
            if row["occupation_id"] in occupation_ids:
                decisions.append(
                    {
                        "career_id": career["career_id"],
                        "record_type": "task",
                        "record_id": row["task_id"],
                        "decision": "retained_context",
                        "classification": "source_context",
                        "source_locator": row["locator"],
                        "rationale": "Retain native task under its named source role; "
                        + scope["scope"],
                        "mandatory_requirement": False,
                        "inference_eligible": False,
                        "independent_review": "pending",
                    }
                )
        source = ROOT / "backend/app/content/guide_v4" / (career["slug"] + ".json")
        guide = convert(source)
        authored_topics = [t for m in guide["roadmap"]["milestones"] for t in m["topics"]]
        inherited_ids = {
            r["competency_id"]
            for r in inherited
            if r["expectation_id"] not in conflicts
            and r["suppression"].upper() != "Y"
            and r["not_relevant"].upper() != "Y"
        }
        for topic, target in zip(authored_topics, scope["topic_candidates"], strict=True):
            candidates = sorted(
                cid for cid in inherited_ids if competencies[cid]["label"] == target
            )
            topics.append(
                {
                    "career_id": career["career_id"],
                    "roadmap_id": career["roadmap_id"],
                    "topic_id": topic["id"],
                    "title": topic["title"],
                    "candidate_label": target,
                    "competency_ids": candidates,
                    "decision": "proposed_partial_coverage"
                    if candidates
                    else "no_justified_mapping",
                    "coverage": "partial" if candidates else "none",
                    "transfers_proficiency": False,
                    "rationale": (
                        "Agent explicitly selected this topic/concept pairing for partial "
                        "practice, not full occupational coverage: "
                        + topic["title"]
                        + " -> "
                        + target
                    )
                    if candidates
                    else "No usable source match; do not guess a substitute.",
                    "source_locators": [
                        competencies[cid]["definition_locator"] for cid in candidates
                    ],
                    "independent_review": "pending",
                }
            )
        original = json.loads(source.read_text(encoding="utf-8"))
        for i, label in enumerate(original["career_overview"]["core_skills"], 1):
            matched = [
                r for r in topics if r["career_id"] == career["career_id"] and r["title"] == label
            ]
            candidates = sorted({cid for r in matched for cid in r["competency_ids"]})
            skills.append(
                {
                    "career_id": career["career_id"],
                    "competency_id": identifier(
                        f"competency/{guide['career']['slug']}/core-{i:02d}"
                    ),
                    "label": label,
                    "related_source_ids": candidates,
                    "relationship": "partial" if candidates else "unmapped",
                    "transfers_proficiency": False,
                    "saved_rating_changed": False,
                    "independent_review": "pending",
                }
            )
        summaries.append(
            {
                "career_id": career["career_id"],
                "slug": career["slug"],
                "scope": scope["scope"],
                "source_roles": [roles[key] for key in sorted(occupation_ids)],
                "record_dispositions": dict(
                    Counter(
                        r["decision"] for r in decisions if r["career_id"] == career["career_id"]
                    )
                ),
                "unmapped_topics": [
                    r["topic_id"]
                    for r in topics
                    if r["career_id"] == career["career_id"] and not r["competency_ids"]
                ],
                "independent_review": "pending",
            }
        )
    previous = []
    for row in tables["learning_associations"]:
        selected = next(
            r
            for r in topics
            if r["career_id"] == row["career_id"] and r["topic_id"] == row["topic_id"]
        )
        previous.append(
            {
                "association_id": row["association_id"],
                "decision": "retained_as_proposal"
                if row["competency_id"] in selected["competency_ids"]
                else "not_carried_forward",
                "rationale": "Rechecked explicit pairing; former generic links are not accepted.",
            }
        )
    data = {
        "reviewer": "Codex",
        "date": "2026-11-04",
        "method": "Agent-authored policy-assisted review; independent approval pending",
        "activation_eligible": False,
        "summaries": summaries,
        "career_relationships": relationship_reviews,
        "record_dispositions": decisions,
        "topics": topics,
        "existing_skills": skills,
        "prior_learning_associations": previous,
        "competency_inventory": [
            {
                "competency_id": r["competency_id"],
                "decision": "retained_source_definition",
                "independent_review": "pending",
            }
            for r in tables["competencies"]
        ],
        "noncareer_crosswalks": [
            {
                "crosswalk_id": r["crosswalk_id"],
                "decision": "related_only_no_equivalence",
                "independent_review": "pending",
            }
            for r in tables["crosswalks"]
            if r["from_type"] != "asgard_career"
        ],
    }
    for summary in summaries:
        cid = summary["career_id"]
        inherited = {
            r["competency_id"]
            for r in decisions
            if r["career_id"] == cid and r["record_type"] == "expectation"
        }
        linked = {
            ref for topic in topics if topic["career_id"] == cid for ref in topic["competency_ids"]
        }
        summary["competencies_without_topic_coverage"] = sorted(inherited - linked)
    (DESTINATION / "agent-review.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    lines = [
        "# Twelve-career agent review",
        "",
        "Reviewer: Codex. Date: 2026-11-04.",
        "Status: inactive, policy-assisted agent proposals; independent approval pending.",
        "",
        "All candidate records have a conservative disposition. This is not a claim of",
        "individual expert validation. No role equivalence, mandatory technology, user",
        "proficiency transfer or recommendation activation has been approved.",
        "",
        "| Career | Source roles | Dispositions | Unlinked source concepts |",
        "| --- | ---: | ---: | ---: |",
    ]
    for summary in summaries:
        lines.append(
            f"| {summary['slug']} | {len(summary['source_roles'])} | "
            f"{sum(summary['record_dispositions'].values())} | "
            f"{len(summary['competencies_without_topic_coverage'])} |"
        )
    lines += ["", "## Career scope findings"]
    for summary in summaries:
        lines += [
            "",
            "### " + summary["slug"],
            summary["scope"],
            "",
            "Dispositions: " + json.dumps(summary["record_dispositions"], sort_keys=True),
        ]
    lines += [
        "",
        "## Limits and remaining approval",
        "All 288 topics have proposed partial associations; these do not cover the full",
        "Unlinked source concepts include technology examples and broad context.",
        "No association implies mastery or an",
        "equivalent assessment. Technology examples and broad source context are not",
        "career requirements. Source-native scales remain separate from personal 0–4.",
        "Known page-65 role scope and page-70 conflicts remain withheld from inference.",
        "All inference flags remain false until the required content approval is recorded.",
        "The 96 comparison cases remain proposed reference cases, not executed app tests.",
        "Independent content reviewer is unassigned. Architecture review is assigned to",
        "@YakisobaNissin; runtime integration is a subsequent gated milestone.",
    ]
    (DESTINATION / "review-summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    manifest_path = DESTINATION / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["agent_review_artifacts"] = {
        name: hashlib.sha256((DESTINATION / name).read_bytes()).hexdigest()
        for name in ("review-policy.json", "agent-review.json", "review-summary.md")
    }
    manifest_path.write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    return validate(data)


def validate(data=None):
    tables = read_tables(DESTINATION)
    data = data or json.loads((DESTINATION / "agent-review.json").read_text(encoding="utf-8"))
    if data["activation_eligible"]:
        raise ValueError("Unapproved activation")
    if (
        len(data["topics"]) != 288
        or len(data["existing_skills"]) != 120
        or len(data["summaries"]) != 12
    ):
        raise ValueError("Incomplete review coverage")
    expected = set()
    for c in tables["careers"]:
        roles = {
            r["to_id"]
            for r in tables["crosswalks"]
            if r["from_id"] == c["career_id"] and r["to_type"] == "source_occupation"
        }
        for table, key in (("expectations", "expectation_id"), ("tasks", "task_id")):
            expected.update(
                (c["career_id"], "expectation" if table == "expectations" else "task", r[key])
                for r in tables[table]
                if r["occupation_id"] in roles
            )
    actual = [
        (r["career_id"], r["record_type"], r["record_id"]) for r in data["record_dispositions"]
    ]
    if set(actual) != expected or len(actual) != len(expected):
        raise ValueError("Missing or duplicate dispositions")
    observations = {r["expectation_id"]: r for r in tables["expectations"]}
    grouped = defaultdict(list)
    for row in observations.values():
        grouped[
            (
                row["occupation_id"],
                row["competency_id"],
                row["native_scale"],
                row["observation_date"],
            )
        ].append(row)
    conflicting = {
        row["expectation_id"]
        for group in grouped.values()
        if len({row["native_level"] for row in group}) > 1
        for row in group
    }
    for decision in data["record_dispositions"]:
        if decision["record_type"] != "expectation":
            continue
        original = observations[decision["record_id"]]
        if original["suppression"].upper() == "Y" or original["not_relevant"].upper() == "Y":
            if decision["decision"] != "excluded":
                raise ValueError("Suppressed expectation cannot be accepted")
        elif decision["record_id"] in conflicting and decision["decision"] != "disputed":
            raise ValueError("Conflicting expectation cannot be accepted")
    for r in data["record_dispositions"]:
        if r["mandatory_requirement"] or r["inference_eligible"]:
            raise ValueError("Unapproved inference or mandatory requirement")
    for topic in data["topics"]:
        role_ids = {
            r["to_id"]
            for r in tables["crosswalks"]
            if r["from_id"] == topic["career_id"] and r["to_type"] == "source_occupation"
        }
        permitted = {
            r["competency_id"] for r in tables["expectations"] if r["occupation_id"] in role_ids
        }
        if not set(topic["competency_ids"]) <= permitted:
            raise ValueError("Unsupported cross-career competency association")
    expected_skills = set()
    for career in tables["careers"]:
        source = ROOT / "backend/app/content/guide_v4" / (career["slug"] + ".json")
        guide = convert(source)
        labels = json.loads(source.read_text(encoding="utf-8"))["career_overview"]["core_skills"]
        expected_skills.update(
            (
                career["career_id"],
                identifier(f"competency/{guide['career']['slug']}/core-{i:02d}"),
                label,
            )
            for i, label in enumerate(labels, 1)
        )
    if {
        (r["career_id"], r["competency_id"], r["label"]) for r in data["existing_skills"]
    } != expected_skills:
        raise ValueError("Existing skill identity changed")
    for row in data["topics"] + data["existing_skills"]:
        if row["transfers_proficiency"]:
            raise ValueError("Proficiency transfer prohibited")
    allowed = {
        c["career_id"]: {r["topic_id"] for r in data["topics"] if r["career_id"] == c["career_id"]}
        for c in tables["careers"]
    }
    for c in tables["careers"]:
        guide = convert(ROOT / "backend/app/content/guide_v4" / (c["slug"] + ".json"))
        if allowed[c["career_id"]] != {
            t["id"] for m in guide["roadmap"]["milestones"] for t in m["topics"]
        }:
            raise ValueError("Unsupported career/topic association")
    return {
        "careers": 12,
        "topics": 288,
        "existing_skills": 120,
        "record_dispositions": len(actual),
        "topic_decisions": dict(Counter(r["decision"] for r in data["topics"])),
        "activation_eligible": False,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--build", action="store_true")
    print(json.dumps(build() if parser.parse_args().build else validate(), sort_keys=True))
