"""Render reviewed content as SQL for human review; never connect to a database."""

import argparse
import json
from datetime import datetime
from pathlib import Path
from uuid import NAMESPACE_URL, uuid5


def identifier(value):
    return str(uuid5(NAMESPACE_URL, "asgard/content/" + value))


def literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, list):
        return "ARRAY[" + ", ".join(literal(item) for item in value) + "]::text[]"
    return "'" + str(value).replace("'", "''") + "'"


def insert(table, fields):
    columns = ", ".join(fields)
    values = ", ".join(literal(value) for value in fields.values())
    identity = literal(fields["id"])
    differences = " OR ".join(
        f"{key} IS DISTINCT FROM {literal(value)}" for key, value in fields.items()
    )
    delimiter = "$asgard_content$"
    while delimiter in values:
        delimiter = delimiter[:-1] + "_" + "$"
    return (
        f"INSERT INTO asgard_catalog.{table} ({columns}) VALUES ({values}) ON CONFLICT (id) DO NOTHING;\n"
        f"DO {delimiter} BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.{table} WHERE id = {identity} AND ({differences})) "
        f"THEN RAISE EXCEPTION 'Published content identity already has different values'; END IF; END {delimiter};"
    )


def render(document):
    review = document.get("review") or {}
    if document.get("status") != "approved" or not all(
        review.get(key) for key in ("by", "at", "reference")
    ):
        raise ValueError(
            "Content must have an actual approved review record before SQL can be rendered."
        )
    if not document.get("source_license"):
        raise ValueError("Record the content source license.")
    reviewed_at = datetime.fromisoformat(review["at"])
    if reviewed_at.tzinfo is None:
        raise ValueError("Review timestamps must include a timezone.")
    version = document["version"]
    if not isinstance(version, int) or isinstance(version, bool) or version < 1:
        raise ValueError("Use a positive release version.")
    category, career, roadmap = document["category"], document["career"], document["roadmap"]
    category_id = identifier("category/" + category["slug"])
    career_id = identifier("career/" + career["slug"])
    roadmap_id = identifier("roadmap/" + career["slug"] + "/" + str(version))
    if (
        not career["description"].strip()
        or not career["responsibilities"]
        or not career["skills"]
        or not roadmap["milestones"]
    ):
        raise ValueError("Publish a real career explanation and nonempty curriculum.")
    statements = [
        "BEGIN;",
        insert(
            "releases",
            {
                "id": identifier("release/" + str(version)),
                "version": version,
                "published_at": review["at"],
            },
        ),
        insert(
            "categories",
            {
                "id": category_id,
                **{key: category[key] for key in ("slug", "title", "description", "position")},
            },
        ),
        insert(
            "careers",
            {
                "id": career_id,
                "category_id": category_id,
                **{
                    key: career[key]
                    for key in (
                        "slug",
                        "title",
                        "description",
                        "responsibilities",
                        "skills",
                        "source_urls",
                    )
                },
                "status": "published",
                "editor": "Codex",
                "source_license": document["source_license"],
                "reviewed_by": review["by"],
                "reviewed_at": review["at"],
                "revision_note": review["reference"],
            },
        ),
        insert(
            "roadmaps",
            {
                "id": roadmap_id,
                "career_id": career_id,
                "title": roadmap["title"],
                "description": roadmap["description"],
                "status": "published",
                "revision_note": review["reference"],
            },
        ),
    ]
    seen = set()
    for position, milestone in enumerate(roadmap["milestones"]):
        if milestone["slug"] in seen or not milestone["topics"]:
            raise ValueError("Milestones must be unique and contain learning topics.")
        seen.add(milestone["slug"])
        milestone_id = identifier("milestone/" + roadmap_id + "/" + milestone["slug"])
        statements.append(
            insert(
                "milestones",
                {
                    "id": milestone_id,
                    "roadmap_id": roadmap_id,
                    "title": milestone["title"],
                    "description": milestone["description"],
                    "position": position,
                },
            )
        )
        for topic_position, topic in enumerate(milestone["topics"]):
            key = "topic/" + topic["slug"]
            if key in seen or not topic["explanation"].strip() or not topic["resources"]:
                raise ValueError("Topics require unique identities, explanations and resources.")
            seen.add(key)
            if not any(resource.get("is_free") is True for resource in topic["resources"]):
                raise ValueError("Each topic needs at least one actually reviewed free resource.")
            topic_id = identifier("topic/" + roadmap_id + "/" + topic["slug"])
            statements.append(
                insert(
                    "topics",
                    {
                        "id": topic_id,
                        "roadmap_id": roadmap_id,
                        "milestone_id": milestone_id,
                        "title": topic["title"],
                        "explanation": topic["explanation"],
                        "position": topic_position,
                    },
                )
            )
            for resource_position, resource in enumerate(topic["resources"]):
                if (
                    not resource["url"].startswith("https://")
                    or not resource.get("license")
                    or not resource.get("reviewed_at")
                    or not isinstance(resource.get("is_free"), bool)
                ):
                    raise ValueError("Record resource access, license and actual review date.")
                if datetime.fromisoformat(resource["reviewed_at"]).tzinfo is None:
                    raise ValueError("Resource review timestamps must include a timezone.")
                statements.append(
                    insert(
                        "resources",
                        {
                            "id": identifier("resource/" + topic_id + "/" + str(resource_position)),
                            "topic_id": topic_id,
                            **{
                                key: resource[key]
                                for key in (
                                    "title",
                                    "url",
                                    "kind",
                                    "is_free",
                                    "license",
                                    "reviewed_at",
                                )
                            },
                            "position": resource_position,
                        },
                    )
                )
    return "\n\n".join(statements + ["COMMIT;"]) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("manifest", type=Path)
    args = parser.parse_args()
    print(render(json.loads(args.manifest.read_text(encoding="utf-8"))), end="")
