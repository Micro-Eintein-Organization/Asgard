"""Convert guide drafts to reviewable content; never approve or publish them."""

import json
import sys
from pathlib import Path

from inspect_guide_v4 import inspect
from render_content_release import identifier


def convert(path):
    inspection = inspect(path)
    if inspection["duplicate_field_differences"]:
        raise ValueError(f"Conflicting guide fields in {path.name}")
    source = json.loads(path.read_text(encoding="utf-8"))
    career = source["career"]
    overview = source["career_overview"]
    roadmap = source["roadmap"]
    slug = "frontend" if career["slug"] == "frontend-developer" else career["slug"]
    roadmap_id = identifier(f"roadmap/{slug}/3")
    topic_ids = {
        t["id"]: identifier(f"topic/{roadmap_id}/{t['slug']}")
        for m in roadmap["milestones"] for t in m["topics"]
    }
    milestones = []
    for milestone in roadmap["milestones"]:
        topics = []
        for topic in milestone["topics"]:
            guide = topic["detail"]["guide"]
            subtopics = topic["detail"]["subtopics"]
            sections = [
                ("Overview", guide["overview"]),
                ("What you'll learn", "\n".join(f"- {item}" for item in guide["learn_items"])),
                ("Subtopics", "\n".join(f"{item['title']}: {item['explanation']}" for item in subtopics)),
                ("Learning outcome", guide["learning_goal"]),
                ("Tools and setup", guide["tools_and_setup"]),
                ("Practice", guide["practice"]),
                ("Completion check", guide["completion_check"]),
            ]
            topics.append({
                "id": topic_ids[topic["id"]], "slug": topic["slug"], "title": topic["title"],
                "explanation": "\n\n".join(f"{name}\n{text}" for name, text in sections if text),
                "prerequisite_ids": [topic_ids[key] for key in topic["card"]["prerequisite_ids"]],
                "resources_pending_review": guide["resources"],
                "editorial_status": topic["editorial_status"],
            })
        milestones.append({"id": identifier(f"milestone/{roadmap_id}/{milestone['slug']}"),
                           "slug": milestone["slug"], "title": milestone["title"],
                           "description": milestone["summary"], "topics": topics})
    return {
        "status": "draft", "publication_ready": False,
        "category_title": career["category"],
        "career": {"id": identifier(f"career/{slug}"), "slug": slug, "title": career["name"],
                   "description": overview["short_description"] + "\n\nRepresentative work: "
                   + " ".join(overview["representative_work"]),
                   "responsibilities": overview["responsibilities"], "skills": overview["core_skills"]},
        "roadmap": {"id": roadmap_id, "title": roadmap["title"],
                    "description": "\n\n".join(f"{label}\n{roadmap[key]}" for label, key in
                        [("Intended learner", "intended_learner"), ("Starting requirements", "starting_requirements"),
                         ("Final outcome", "final_outcome")]), "milestones": milestones},
    }


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: convert_guide_v4.py INPUT.json")
    print(json.dumps(convert(Path(sys.argv[1])), indent=2, ensure_ascii=False))
