"""Deterministic experience facts and bounded, career-specific source selection."""

from collections import defaultdict
from uuid import NAMESPACE_URL, uuid5


def reported_facts(state):
    facts = []
    for item in sorted(state["items"], key=lambda row: str(row["competency_id"])):
        level = item["level"]
        if level is not None and (type(level) is not int or not 0 <= level <= 4):
            raise ValueError("Invalid self-report level")
        description = (
            "experience level unknown"
            if level is None
            else "level 0: reports no experience"
            if level == 0
            else f"self-reported experience level {level} on Asgard's 0–4 scale"
        )
        facts.append(
            {
                "id": "reported-skill:" + str(item["competency_id"]),
                "source": "reported_skill",
                "source_id": str(item["competency_id"]),
                "source_revision": state["version"],
                "description": (
                    f"{item['label']}: {description}; not assessed ability or career preference."
                ),
            }
        )
    return facts


def select_references(release_id, profile, reports, limit=6):
    if not 0 <= limit <= 6:
        raise ValueError("Evidence limit must be between zero and six")
    reported = {str(item["competency_id"]) for item in reports["items"]}
    links = defaultdict(set)
    career = profile["career"]["career_id"]
    for skill in profile["skills"]:
        if skill["career_id"] != career:
            raise ValueError("Cross-career skill relationship")
        if skill["transfers_proficiency"]:
            raise ValueError("Personal proficiency cannot transfer")
        if skill["relationship"] == "partial" and skill["competency_id"] in reported:
            for concept in skill["related_source_ids"]:
                links[concept].add(skill["competency_id"])
    definitions = {r["competency_id"]: r for r in profile["competencies"]}
    sources = {r["source_id"]: r for r in profile.get("sources", [])}
    roles = {r["occupation_id"]: r for r in profile.get("source_roles", [])}
    scopes = {r["occupation_id"]: r for r in profile.get("relationships", [])}
    eligible = set(profile["eligible_records"])
    candidates = []
    for row in profile["records"]:
        review, native = row["review"], row["native"]
        if review["record_id"] not in eligible:
            continue
        if (
            review["career_id"] != career
            or review["decision"] != "agent_supported"
            or review["classification"] != "core_function"
            or review["record_type"] != "expectation"
            or review["mandatory_requirement"]
            or native.get("suppression", "").upper() in ("Y", "YES", "TRUE")
            or native.get("not_relevant", "").upper() in ("Y", "YES", "TRUE")
        ):
            raise ValueError("Ineligible source record in local-test overlay")
        concept = native["competency_id"]
        definition = definitions[concept]
        source = sources.get(native["source_id"], {})
        if definition["type"] == "technology_example":
            raise ValueError("Technology examples cannot become requirements")
        candidates.append(
            {
                "id": str(
                    uuid5(
                        NAMESPACE_URL,
                        f"asgard/evidence/{release_id}/{career}/{review['record_id']}",
                    )
                ),
                "career_id": career,
                "release_id": str(release_id),
                "record_id": review["record_id"],
                "competency_id": concept,
                "label": definition["label"],
                "definition": definition["definition"],
                "occupation_id": native["occupation_id"],
                "source_id": native["source_id"],
                "source_title": source.get("title", "Unknown source title"),
                "source_version": source.get("version", "Unknown version"),
                "source_sha256": source.get("sha256", "unknown"),
                "reuse_notes": source.get("reuse_notes", "Unknown reuse metadata"),
                "source_role_title": roles.get(native["occupation_id"], {}).get(
                    "title", "Unknown role"
                ),
                "career_relationship": scopes.get(native["occupation_id"], {}).get(
                    "relationship", "unassessed"
                ),
                "locator": native["locator"],
                "related_skill_ids": sorted(links[concept]),
                "relationship": "partial" if links[concept] else "source_reference",
                "limitation": (
                    "Agent-reviewed local test reference; no proficiency transfer or target."
                ),
            }
        )
    candidates.sort(key=lambda row: (not bool(row["related_skill_ids"]), row["record_id"]))
    esco = []
    for row in profile.get("esco_references", []):
        if (
            row["career_id"] != career
            or row["evidence_type"] != "esco_occupation_skill"
            or row["source_relationship"] not in ("essential", "optional")
            or row["related_skill_ids"]
            or row["relationship"] != "source_reference"
        ):
            raise ValueError("Invalid ESCO reference in occupational release")
        reference_key = f"asgard/evidence/{release_id}/{career}/{row['record_id']}"
        esco.append({
            **row,
            "id": str(uuid5(NAMESPACE_URL, reference_key)),
            "release_id": str(release_id),
        })
    # Keep experience-linked evidence first. Give cleared ESCO references room
    # before filling the remaining slots with general occupational observations.
    esco.sort(key=lambda row: (row["source_relationship"] != "essential", row["record_id"]))
    candidates = (
        [row for row in candidates if row["related_skill_ids"]]
        + esco
        + [row for row in candidates if not row["related_skill_ids"]]
    )
    return {
        "references": candidates[:limit],
        "eligible_count": len(candidates),
        "included_count": min(limit, len(candidates)),
        "limited_coverage": len(candidates) > limit,
    }
