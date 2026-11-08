"""Inspect draft guide inputs without approving or publishing content."""

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1] / "app" / "content" / "guide_v4"


def inspect(path):
    document = json.loads(path.read_text(encoding="utf-8"))
    milestones = document["roadmap"]["milestones"]
    topics = [topic for milestone in milestones for topic in milestone["topics"]]
    ids = [topic["id"] for topic in topics]
    slugs = [topic["slug"] for topic in topics]
    if len(ids) != len(set(ids)) or len(slugs) != len(set(slugs)):
        raise ValueError(f"Duplicate topic identity in {path.name}")
    graph = {topic["id"]: topic["card"]["prerequisite_ids"] for topic in topics}
    visited, active = set(), set()

    def visit(key):
        if key not in graph:
            raise ValueError(f"Unknown prerequisite {key} in {path.name}")
        if key in active:
            raise ValueError(f"Circular prerequisite {key} in {path.name}")
        if key in visited:
            return
        active.add(key)
        for dependency in graph[key]:
            visit(dependency)
        active.remove(key)
        visited.add(key)

    for key in graph:
        visit(key)
    differences = []
    for milestone in milestones:
        if not milestone["topics"]:
            raise ValueError(f"Empty milestone in {path.name}")
        for topic in milestone["topics"]:
            if topic["milestone_id"] != milestone["id"]:
                raise ValueError(f"Incorrect milestone for {topic['id']} in {path.name}")
            detail = topic["detail"]
            guide = detail["guide"]
            for field in ("overview", "tools_and_setup", "resources"):
                if guide[field] != detail[field]:
                    differences.append(f"{topic['id']}: {field}")
    return {"career": document["career"]["name"], "milestones": len(milestones),
            "topics": len(topics), "duplicate_field_differences": differences}


if __name__ == "__main__":
    paths = sorted(ROOT.glob("*.json"))
    if len(paths) != 23:
        raise ValueError(f"Expected 12 draft roadmaps, found {len(paths)}")
    print(json.dumps([inspect(path) for path in paths], indent=2))
