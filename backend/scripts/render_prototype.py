"""Render the owner-approved local prototype publication; does not connect to a database."""

import argparse
from pathlib import Path

from app.content.prototype_v1 import REVIEWED_AT, REVIEW_REFERENCE, SOURCE_LICENSE, careers
from app.modules.discovery.definition import definition
from render_content_release import identifier, insert, literal


def render():
    statements = [
        "BEGIN;",
        insert(
            "releases", {"id": identifier("release/1"), "version": 1, "published_at": REVIEWED_AT}
        ),
    ]
    for career in careers():
        category = career["category"]
        cid = identifier("category/" + category["slug"])
        career_id = identifier("career/" + career["slug"])
        roadmap_id = identifier("roadmap/" + career["slug"] + "/1")
        statements.append(insert("categories", {"id": cid, **category}))
        urls = list(
            dict.fromkeys(
                resource["url"]
                for milestone in career["roadmap"]["milestones"]
                for topic in milestone["topics"]
                for resource in topic["resources"]
            )
        )
        statements.append(
            insert(
                "careers",
                {
                    "id": career_id,
                    "category_id": cid,
                    **{
                        key: career[key]
                        for key in (
                            "slug",
                            "title",
                            "description",
                            "responsibilities",
                            "skills",
                            "relevance_attributes",
                        )
                    },
                    "status": "published",
                    "editor": "Codex",
                    "source_license": SOURCE_LICENSE,
                    "source_urls": urls,
                    "reviewed_by": "Codex (source/resource review within owner-approved local prototype scope)",
                    "reviewed_at": REVIEWED_AT,
                    "revision_note": REVIEW_REFERENCE,
                },
            )
        )
        path = career["roadmap"]
        statements.append(
            insert(
                "roadmaps",
                {
                    "id": roadmap_id,
                    "career_id": career_id,
                    "title": path["title"],
                    "description": path["description"],
                    "status": "published",
                    "revision_note": REVIEW_REFERENCE,
                },
            )
        )
        for position, milestone in enumerate(path["milestones"]):
            mid = identifier("milestone/" + roadmap_id + "/" + milestone["slug"])
            statements.append(
                insert(
                    "milestones",
                    {
                        "id": mid,
                        "roadmap_id": roadmap_id,
                        "title": milestone["title"],
                        "description": milestone["description"],
                        "position": position,
                    },
                )
            )
            branches = {}
            if group := milestone.get("branch_group"):
                gid = identifier("group/" + mid + "/" + group["slug"])
                statements.append(
                    insert(
                        "branch_groups",
                        {
                            "id": gid,
                            "roadmap_id": roadmap_id,
                            "milestone_id": mid,
                            "title": group["title"],
                            "explanation": group["explanation"],
                            "position": 0,
                        },
                    )
                )
                for branch_position, branch in enumerate(group["branches"]):
                    bid = identifier("branch/" + gid + "/" + branch["slug"])
                    branches[branch["slug"]] = bid
                    statements.append(
                        insert(
                            "branches",
                            {
                                "id": bid,
                                "roadmap_id": roadmap_id,
                                "milestone_id": mid,
                                "group_id": gid,
                                "title": branch["title"],
                                "position": branch_position,
                            },
                        )
                    )
            for topic_position, topic in enumerate(milestone["topics"]):
                tid = identifier("topic/" + roadmap_id + "/" + topic["slug"])
                statements.append(
                    insert(
                        "topics",
                        {
                            "id": tid,
                            "roadmap_id": roadmap_id,
                            "milestone_id": mid,
                            "branch_id": branches.get(topic["branch"]),
                            "title": topic["title"],
                            "explanation": topic["explanation"],
                            "position": topic_position,
                        },
                    )
                )
                for resource_position, resource in enumerate(topic["resources"]):
                    statements.append(
                        insert(
                            "resources",
                            {
                                "id": identifier("resource/" + tid + "/" + str(resource_position)),
                                "topic_id": tid,
                                **resource,
                                "position": resource_position,
                            },
                        )
                    )
    questionnaire = definition()
    statements.append(
        insert(
            "questionnaires",
            {
                "id": str(questionnaire.id),
                "version": questionnaire.version,
                "published_at": REVIEWED_AT,
            },
        )
    )
    for question in questionnaire.questions:
        # Questions have a composite key; a conflicting position aborts the transaction.
        qid, key = literal(str(questionnaire.id)), literal(question.question_id)
        statements.append(
            f"INSERT INTO asgard_catalog.questions (questionnaire_id, id, position) VALUES ({qid}, {key}, {question.position}) "
            f"ON CONFLICT (questionnaire_id, id) DO NOTHING;\n"
            f"DO $registry$ BEGIN IF EXISTS (SELECT 1 FROM asgard_catalog.questions WHERE questionnaire_id = {qid} AND id = {key} "
            f"AND position <> {question.position}) THEN RAISE EXCEPTION 'Question identity conflicts with published definition'; END IF; END $registry$;"
        )
    return "\n\n".join(statements + ["COMMIT;"]) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    sql = render()
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(sql, encoding="utf-8")
    else:
        print(sql, end="")
