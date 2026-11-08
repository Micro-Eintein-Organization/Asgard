"""Render the owner-authorized, as-supplied local guide release without connecting."""

import json
from pathlib import Path

from convert_guide_v4 import convert
from render_content_release import identifier, insert, literal

ROOT = Path(__file__).resolve().parents[1]
AT = "2026-11-02T00:21:19+08:00"
NOTE = "Owner requested import of v4 as supplied, waived resource verification in chat on 2026-11-02. Human subject-matter/independent technical acceptance pending."


def assertion(table, record):
    conditions = " AND ".join(f"{key} IS NOT DISTINCT FROM {literal(value)}" for key, value in record.items())
    return f"IF NOT EXISTS (SELECT 1 FROM asgard_catalog.{table} WHERE {conditions}) THEN RAISE EXCEPTION 'Unexpected {table} baseline'; END IF;"


def render(include_resources=True):
    baseline = json.loads((ROOT / "app/content/guide-release2-baseline.json").read_text(encoding="utf-8-sig"))
    changes, checks = [], []
    for table, records in baseline.items():
        changes.extend(assertion(table, record) for record in records)
    category_specs = [
        ("Software and AI", "software-ai", "Build useful digital tools."),
        ("Design & UX", "design-ux", "Understand people and improve product interactions."),
        ("Data & Analytics", "data-analytics", "Explore information and explain findings."),
        ("Cybersecurity", "cybersecurity", "Investigate and protect digital systems."),
        ("Hardware & Embedded Systems", "hardware-embedded", "Design circuits and embedded devices."),
        ("Networking & Infrastructure", "networking-infrastructure", "Connect systems and operate reliable services."),
    ]
    categories = {}
    changes.append("UPDATE asgard_catalog.categories SET position=position+100 WHERE id IN (" + ",".join(literal(c["id"]) for c in baseline["categories"]) + ");")
    for position, (title, slug, description) in enumerate(category_specs):
        record = dict(id=identifier("category/" + slug), slug=slug, title=title, description=description, position=position)
        categories[title] = record["id"]
        if any(c["id"] == record["id"] for c in baseline["categories"]):
            changes.append("UPDATE asgard_catalog.categories SET " + ",".join(f"{k}={literal(v)}" for k,v in record.items()) + " WHERE id=" + literal(record["id"]) + ";")
        else:
            changes.append(insert("categories", record))
        checks.append(insert("categories", record))
    for old in baseline["roadmaps"]:
        final = {**old, "status": "retired", "revision": old["revision"] + 1, "revision_note": NOTE}
        changes.append(f"UPDATE asgard_catalog.roadmaps SET status='retired',revision=revision+1,revision_note={literal(NOTE)} WHERE id={literal(old['id'])};")
        checks.append(insert("roadmaps", final))
    old_design = next(c for c in baseline["careers"] if c["slug"] == "ui-ux-designer")
    changes.append(f"UPDATE asgard_catalog.careers SET status='retired',revision=revision+1,revision_note={literal(NOTE)} WHERE id={literal(old_design['id'])};")
    checks.append(insert("careers", {**old_design, "status": "retired", "revision": old_design["revision"]+1, "revision_note": NOTE}))
    curriculum = []
    for path in sorted((ROOT / "app/content/guide_v4").glob("*.json")):
        doc = convert(path)
        career, roadmap = doc["career"], doc["roadmap"]
        resources = [r for m in roadmap["milestones"] for t in m["topics"] for r in t["resources_pending_review"]]
        record = {**career, "category_id": categories[doc["category_title"]], "status": "published", "editor": "Codex",
                  "source_license": "Owner-supplied Asgard guide v4; external links only; provider usage notices unverified",
                  "source_urls": list(dict.fromkeys(r["url"] for r in resources)),
                  "reviewed_by": "Codex (structural conversion only; owner waived resource verification)",
                  "reviewed_at": AT, "revision_note": NOTE,
                  "relevance_attributes": {"activities": career["responsibilities"], "scope": "Introductory exploration; no competency assessment"}}
        old = next((c for c in baseline["careers"] if c["id"] == record["id"]), None)
        record["revision"] = old["revision"]+1 if old else 1
        if old:
            changes.append("UPDATE asgard_catalog.careers SET " + ",".join(f"{k}={literal(v)}" for k,v in record.items()) + " WHERE id=" + literal(record["id"]) + ";")
        else:
            changes.append(insert("careers", record))
        checks.append(insert("careers", record))
        curriculum.append(insert("roadmaps", {k:v for k,v in {**roadmap, "career_id":career["id"], "status":"published", "revision_note":NOTE}.items() if k != "milestones"}))
        for mp,m in enumerate(roadmap["milestones"]):
            curriculum.append(insert("milestones", {"id":m["id"], "roadmap_id":roadmap["id"], "title":m["title"], "description":m["description"], "position":mp}))
            for tp,t in enumerate(m["topics"]):
                curriculum.append(insert("topics", {"id":t["id"], "roadmap_id":roadmap["id"], "milestone_id":m["id"], "title":t["title"], "explanation":t["explanation"], "position":tp}))
                for rp,r in enumerate(t["resources_pending_review"]):
                    if not include_resources:
                        continue
                    if not r["url"].startswith("https://"):
                        raise ValueError("Resource URL must be HTTPS")
                    kind = r["type"] if r["type"] in ("article","course","video","documentation","tool") else "course" if "course" in r["type"] else "article"
                    curriculum.append(insert("resources", {"id":identifier(f"resource/{t['id']}/{rp}"), "topic_id":t["id"], "title":r["title"], "url":r["url"], "kind":kind,
                        "is_free":False, "license":"Access unverified; supplied access: " + r["access"] + "; " + r["license_or_usage_notice"] + "; reviewed_at records structural import only", "reviewed_at":AT, "position":rp}))
        for m in roadmap["milestones"]:
            for t in m["topics"]:
                for dependency in t["prerequisite_ids"]:
                    curriculum.append(f"INSERT INTO asgard_catalog.topic_prerequisites VALUES ({literal(roadmap['id'])},{literal(t['id'])},{literal(dependency)}) ON CONFLICT DO NOTHING;")
    release = insert("releases", {"id":identifier("release/3"), "version":3, "published_at":AT})
    return "\n".join(["BEGIN;", "SELECT pg_advisory_xact_lock(72611029);",
        "DO $guide_upgrade$ BEGIN IF NOT EXISTS (SELECT 1 FROM asgard_catalog.releases WHERE version=3) THEN",
        *changes, "END IF; END $guide_upgrade$;", *checks, *curriculum, release, "COMMIT;"]) + "\n"


if __name__ == "__main__":
    print(render())
