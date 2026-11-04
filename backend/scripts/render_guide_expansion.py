"""Render release 5 SQL migration for the 11 new expanded careers."""
import json
from pathlib import Path

from convert_guide_v4 import convert
from render_content_release import identifier, insert, literal

ROOT = Path(__file__).resolve().parents[1]
AT = "2026-11-04T12:00:00+00:00"
NOTE = "Owner-requested catalog expansion to add 11 industry-standard careers aligned with roadmap.sh."

NEW_SLUGS = [
    "backend-developer",
    "full-stack-developer",
    "mobile-developer",
    "game-developer",
    "ai-engineer",
    "data-scientist",
    "bi-analyst",
    "cloud-engineer",
    "system-administrator",
    "cloud-security-engineer",
    "linux-systems-engineer"
]

CATEGORY_SPECS = [
    ("Software and AI", "software-ai"),
    ("Design & UX", "design-ux"),
    ("Data & Analytics", "data-analytics"),
    ("Cybersecurity", "cybersecurity"),
    ("Hardware & Embedded Systems", "hardware-embedded"),
    ("Networking & Infrastructure", "networking-infrastructure"),
]

def render_expansion():
    categories = {title: identifier("category/" + slug) for title, slug in CATEGORY_SPECS}
    topic_resources = json.loads((ROOT / "app/content/topic-resources.json").read_text(encoding="utf-8"))
    
    statements = [
        "BEGIN;",
        "SELECT pg_advisory_xact_lock(72611029);",
        "DO $expansion_upgrade$ BEGIN IF NOT EXISTS (SELECT 1 FROM asgard_catalog.releases WHERE version=5) THEN",
        "IF NOT EXISTS (SELECT 1 FROM asgard_catalog.releases WHERE version=4) THEN RAISE EXCEPTION 'Missing release 4'; END IF;"
    ]
    
    curriculum = []
    
    for slug in NEW_SLUGS:
        path = ROOT / f"app/content/guide_v4/{slug}.json"
        doc = convert(path)
        career, roadmap = doc["career"], doc["roadmap"]
        
        # Resources for career
        career_resources = topic_resources.get(slug, {})
        urls = [r["url"] for r in career_resources.values()]
        
        career_record = {
            **career,
            "category_id": categories[doc["category_title"]],
            "status": "published",
            "editor": "Antigravity",
            "source_license": "Original Asgard-authored summaries; third-party resources linked only and retain their stated licenses",
            "source_urls": list(dict.fromkeys(urls)),
            "reviewed_by": "Antigravity (curriculum expansion aligned with roadmap.sh)",
            "reviewed_at": AT,
            "revision_note": NOTE,
            "relevance_attributes": {
                "activities": career["responsibilities"],
                "scope": "Comprehensive beginner-to-intermediate learning track"
            },
            "revision": 1
        }
        
        curriculum.append(insert("careers", career_record))
        
        roadmap_record = {
            k: v for k, v in {
                **roadmap,
                "career_id": career["id"],
                "status": "published",
                "revision_note": NOTE
            }.items() if k != "milestones"
        }
        curriculum.append(insert("roadmaps", roadmap_record))
        
        for mp, m in enumerate(roadmap["milestones"]):
            curriculum.append(insert("milestones", {
                "id": m["id"],
                "roadmap_id": roadmap["id"],
                "title": m["title"],
                "description": m["description"],
                "position": mp
            }))
            
            for tp, t in enumerate(m["topics"]):
                curriculum.append(insert("topics", {
                    "id": t["id"],
                    "roadmap_id": roadmap["id"],
                    "milestone_id": m["id"],
                    "title": t["title"],
                    "explanation": t["explanation"],
                    "position": tp
                }))
                
                # Resources for topic
                res_meta = career_resources.get(t["slug"])
                if res_meta:
                    curriculum.append(insert("resources", {
                        "id": identifier(f"resource/{t['id']}/0"),
                        "topic_id": t["id"],
                        "title": f"{t['title']}: {res_meta['title']}",
                        "url": res_meta["url"],
                        "kind": res_meta.get("kind", "documentation"),
                        "is_free": res_meta.get("is_free", True),
                        "license": res_meta.get("license", "External link only; publisher copyright retained; license audit not performed"),
                        "reviewed_at": AT,
                        "position": 0
                    }))
                    
        for m in roadmap["milestones"]:
            for t in m["topics"]:
                for dep in t["prerequisite_ids"]:
                    curriculum.append(
                        f"INSERT INTO asgard_catalog.topic_prerequisites VALUES ({literal(roadmap['id'])},{literal(t['id'])},{literal(dep)}) ON CONFLICT DO NOTHING;"
                    )

    release_record = insert("releases", {
        "id": identifier("release/5"),
        "version": 5,
        "published_at": AT
    })
    
    statements.extend(curriculum)
    statements.append(release_record)
    statements.append("END IF; END $expansion_upgrade$;")
    statements.append("COMMIT;\n")
    
    out_sql = ROOT.parent / "supabase" / "content" / "20261104_guide_expansion_11_careers.sql"
    out_sql.write_text("\n".join(statements), encoding="utf-8")
    print(f"Generated {out_sql} ({len(statements)} statements)")

if __name__ == "__main__":
    render_expansion()
