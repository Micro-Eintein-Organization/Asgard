"""Audit research-data support; this does not implement skill matching or assess users."""

import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RELEASE = ROOT / "data/post-mvp/releases/curated-v0.1"


def review():
    tables = json.loads((RELEASE / "dataset.json").read_text(encoding="utf-8"))["tables"]
    occupations = {r["occupation_id"]: r for r in tables["source_occupations"]}
    competencies = {r["competency_id"]: r for r in tables["competencies"]}
    expectations = defaultdict(list)
    tasks = defaultdict(list)
    for row in tables["expectations"]:
        expectations[row["occupation_id"]].append(row)
        assert row["source_id"] == occupations[row["occupation_id"]]["source_id"]
        assert row["source_id"] == competencies[row["competency_id"]]["source_id"]
    for row in tables["tasks"]:
        assert row["occupation_id"] in occupations
        assert row["source_id"] == occupations[row["occupation_id"]]["source_id"]
        tasks[row["occupation_id"]].append(row)
    summaries = []
    career_sets = {}
    for career in tables["careers"]:
        links = [r for r in tables["crosswalks"] if r["from_type"] == "asgard_career"
                 and r["from_id"] == career["career_id"]]
        role_ids = {r["to_id"] for r in links}
        rows = [r for oid in role_ids for r in expectations[oid]]
        comp_ids = {r["competency_id"] for r in rows}
        local_rows = [r for r in rows if r["source_id"] != "SRC-10"]
        local_ids = {r["competency_id"] for r in local_rows}
        career_sets[career["slug"]] = comp_ids
        learning = [r for r in tables["learning_associations"] if r["career_id"] == career["career_id"]]
        assert role_ids and comp_ids, career["slug"]
        assert all(r["competency_id"] in comp_ids for r in learning), career["slug"]
        summaries.append({
            "slug": career["slug"], "title": career["title"], "coverage_conclusion": career["coverage"],
            "candidate_roles": [{"id": oid, "title": occupations[oid]["title"],
                                 "source": occupations[oid]["source_id"],
                                 "level": occupations[oid]["career_level"],
                                 "expectation_rows": len(expectations[oid])}
                                for oid in sorted(role_ids)],
            "unique_reference_items": len(comp_ids),
            "reference_types": dict(Counter(competencies[c]["type"] for c in sorted(comp_ids))),
            "local_expectation_rows": len(local_rows), "unique_local_labels": len(local_ids),
            "local_definition_gaps": [competencies[c]["label"] for c in sorted(local_ids)
                                      if not competencies[c]["definition"]],
            "task_rows": sum(len(tasks[oid]) for oid in role_ids),
            "learning_links": len(learning),
            "linked_expectation_labels": len({r["competency_id"] for r in learning}),
            "accepted_role_mappings": sum(r["review_status"] == "accepted" for r in links),
        })
    pairs = []
    for first, second in [("data-analyst", "data-engineer"), ("frontend-developer", "ui-designer"),
                          ("ui-designer", "ux-designer"), ("cybersecurity-analyst", "penetration-tester")]:
        assert first in career_sets and second in career_sets
        shared = career_sets[first] & career_sets[second]
        pairs.append({"from": first, "to": second, "shared_source_qualified_items": len(shared),
                      "shared_types": dict(Counter(competencies[c]["type"] for c in sorted(shared))),
                      "shared_local_labels": sorted(competencies[c]["label"] for c in shared
                                                    if competencies[c]["source_id"] != "SRC-10"),
                      "interpretation": "candidate reference overlap only; no transferability or readiness conclusion"})
    dated = [r for r in tables["expectations"] if r["observation_date"] not in ("", "unknown")]
    result = {
        "date": "2026-11-03", "release": "curated-v0.1",
        "dataset_sha256": hashlib.sha256((RELEASE / "dataset.json").read_bytes()).hexdigest(),
        "checks_passed": ["expectation source agrees with role and competency source",
                          "task references and source agree with source role",
                          "all 12 careers have candidate roles and expectation references",
                          "every learning link belongs to a candidate career expectation set"],
        "career_evidence": summaries, "candidate_transition_overlap": pairs,
        "common_items_all_careers": len(set.intersection(*career_sets.values())),
        "source_contributions": {
            s["source_id"]: {name: sum(r.get("source_id") == s["source_id"] for r in tables[name])
                             for name in ["source_occupations", "competencies", "expectations", "tasks", "interpretation"]}
            for s in tables["sources"]},
        "types": dict(Counter(r["type"] for r in tables["competencies"])),
        "expectation_scales": dict(Counter(r["native_scale"] for r in tables["expectations"])),
        "suppression_flags": dict(Counter(r["suppression"] for r in tables["expectations"])),
        "not_relevant_flags": dict(Counter(r["not_relevant"] for r in tables["expectations"])),
        "observation_dates": dict(sorted(Counter(r["observation_date"] for r in dated).items())),
        "undated_expectation_rows": len(tables["expectations"]) - len(dated),
        "sources_unknown_publication_date": sum(r["publication_date"] == "unknown" for r in tables["sources"]),
        "sources_unknown_download_date": sum(r["download_date"] == "unknown" for r in tables["sources"]),
        "crosswalk_review_states": dict(Counter(r["review_status"] for r in tables["crosswalks"])),
        "comparison_case_status": "96 proposed reference cases; not executed skill-comparison behavior",
        "not_tested": ["individual competence", "application comparison logic", "independent role equivalence",
                       "Philippine employer demand or technology freshness", "learning effectiveness"],
    }
    destination = ROOT / "docs/research/dataset-objective-evidence.json"
    destination.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"checks_passed": result["checks_passed"],
                      "careers": [{k: r[k] for k in ["slug", "unique_reference_items", "unique_local_labels",
                                  "local_definition_gaps", "learning_links", "accepted_role_mappings"]}
                                  for r in summaries], "transition_overlap": pairs,
                      "scales": result["expectation_scales"], "suppression": result["suppression_flags"],
                      "unknown_publication_dates": result["sources_unknown_publication_date"],
                      "unknown_download_dates": result["sources_unknown_download_date"]}, indent=2))


if __name__ == "__main__":
    review()
