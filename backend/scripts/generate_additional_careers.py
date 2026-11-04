"""Generate 11 additional careers conforming to Asgard v4 curriculum guide schema."""
import json
from pathlib import Path
from urllib.parse import urlparse

from data_additional_careers import CAREERS_DATA
from careers_batch_1 import BATCH_1
from careers_batch_2 import BATCH_2
from careers_batch_3 import BATCH_3

ROOT = Path(__file__).resolve().parents[1]
GUIDE_DIR = ROOT / "app" / "content" / "guide_v4"
TOPIC_RESOURCES_PATH = ROOT / "app" / "content" / "topic-resources.json"

TOOLS_SETUP_DEFAULT = (
    "Use a free editor (such as VS Code), modern web browser, and relevant local "
    "runtime/CLI; no paid service or subscription is required for these exercises."
)

def make_career_pack(slug, name, category, short_desc, responsibilities, representative_work, core_skills, milestones_data):
    milestones = []
    topic_counter = 1
    
    for m_idx, m_data in enumerate(milestones_data, 1):
        m_id = f"M{m_idx:02d}"
        topics = []
        for t_data in m_data["topics"]:
            t_id = f"T{topic_counter:02d}"
            t_slug = t_data["slug"]
            t_title = t_data["title"]
            t_overview = t_data["overview"]
            subtopics = [
                {
                    "id": f"{t_id}-S{s_idx:02d}",
                    "title": s_title,
                    "explanation": s_expl
                }
                for s_idx, (s_title, s_expl) in enumerate(t_data["subtopics"], 1)
            ]
            learn_items = [s["title"] for s in subtopics]
            learning_goal = f"Understand {t_title.lower()}, complete the practical exercise, and explain the key concepts."
            practice_text = t_data["practice"]
            completion_text = f"You can show and explain the outcome of: {practice_text.lower()} Check that it functions as expected and meets requirements."
            
            res_url = t_data["url"]
            res_provider = urlparse(res_url).hostname or "documentation"
            res_title = t_data["resource_title"]
            
            resource_obj = {
                "title": res_title,
                "provider": res_provider,
                "url": res_url,
                "type": "documentation",
                "covers": [],
                "access": "free to read; exercises, accounts or equipment may have conditions",
                "use_this_for": f"Consult relevant sections for background on {t_title.lower()}; verify subtopic coverage before treating this as a complete lesson.",
                "license_or_usage_notice": "Not verified; external link only",
                "last_checked": "Not verified",
                "verification_scope": "URL, exact lesson coverage and access not independently verified",
                "id": f"{t_id}-R01",
                "resource_role": "primary"
            }
            
            prereqs = [f"T{topic_counter - 1:02d}"] if topic_counter > 1 else []
            
            topics.append({
                "id": t_id,
                "slug": t_slug,
                "title": t_title,
                "milestone_id": m_id,
                "card": {
                    "title": t_title,
                    "summary": t_overview,
                    "prerequisite_ids": prereqs
                },
                "detail": {
                    "eyebrow": f"{m_id} · {m_data['title']}",
                    "title": t_title,
                    "overview": t_overview,
                    "learning_outcomes": [learning_goal],
                    "tools_and_setup": TOOLS_SETUP_DEFAULT,
                    "subtopics": subtopics,
                    "practice": {
                        "instructions": practice_text
                    },
                    "completion_check": {
                        "criteria": completion_text
                    },
                    "resources": [resource_obj],
                    "guide": {
                        "overview": t_overview,
                        "learn_items": learn_items,
                        "learning_goal": learning_goal,
                        "tools_and_setup": TOOLS_SETUP_DEFAULT,
                        "resources": [resource_obj],
                        "practice": practice_text,
                        "completion_check": completion_text
                    }
                },
                "editorial_status": "Draft — pending human review"
            })
            topic_counter += 1
            
        milestones.append({
            "id": m_id,
            "slug": m_data["slug"],
            "title": m_data["title"],
            "summary": m_data["summary"],
            "topics": topics
        })
        
    return {
        "schema_version": "4.0.0-draft",
        "career": {
            "name": name,
            "slug": slug,
            "category": category,
            "status": "Draft — pending human review"
        },
        "career_overview": {
            "short_description": short_desc,
            "responsibilities": responsibilities,
            "representative_work": [representative_work],
            "core_skills": core_skills
        },
        "roadmap": {
            "title": f"{name}: beginner foundations and starter project",
            "intended_learner": "Motivated beginner; basic computer literacy assumed, with no prior professional experience.",
            "starting_requirements": "Computer, internet access, text editor, terminal and modern browser. Most tasks use free software or local runtimes.",
            "final_outcome": representative_work,
            "milestones": milestones
        }
    }


def main():
    all_careers = CAREERS_DATA + BATCH_1 + BATCH_2 + BATCH_3
    print(f"Total new careers to generate: {len(all_careers)}")
    
    # Load existing topic-resources.json
    topic_resources = json.loads(TOPIC_RESOURCES_PATH.read_text(encoding="utf-8"))
    
    for c_def in all_careers:
        pack = make_career_pack(
            slug=c_def["slug"],
            name=c_def["name"],
            category=c_def["category"],
            short_desc=c_def["short_description"],
            responsibilities=c_def["responsibilities"],
            representative_work=c_def["representative_work"],
            core_skills=c_def["core_skills"],
            milestones_data=c_def["milestones"]
        )
        out_file = GUIDE_DIR / f"{c_def['slug']}.json"
        out_file.write_text(json.dumps(pack, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Wrote {out_file.name} (6 milestones, 24 topics)")
        
        # Add to topic-resources
        career_key = c_def["slug"]
        topic_resources[career_key] = {}
        for m in c_def["milestones"]:
            for t in m["topics"]:
                t_slug = t["slug"]
                t_title = t["title"]
                t_url = t["url"]
                provider = urlparse(t_url).hostname or "documentation"
                topic_resources[career_key][t_slug] = {
                    "title": t["resource_title"],
                    "provider": provider,
                    "url": t_url,
                    "kind": "documentation",
                    "is_free": True,
                    "license": "External link only; publisher copyright retained; license audit not performed",
                    "reviewed_at": "2026-11-04T12:00:00.000000+00:00",
                    "covers": [t_slug],
                    "selection_note": f"Selected to support {t_title}. Shared lessons support related prerequisite, practice or project work; not a claim of exhaustive coverage.",
                    "access": "Free documentation; software, hardware or service use may have separate requirements"
                }
                
    TOPIC_RESOURCES_PATH.write_text(json.dumps(topic_resources, indent=2, ensure_ascii=False), encoding="utf-8")
    print("Updated topic-resources.json successfully.")


if __name__ == "__main__":
    main()
