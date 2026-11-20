"""Version-only draft tracking and current, account-scoped experience support."""

import hashlib
import json
import re
from types import SimpleNamespace

from app.modules.recommendations.resume_connections import saved_connections
from app.modules.skill_matching.matcher import BenchmarkSkill, Career, ResumeEvidence, rank_careers
from app.modules.storage import one, rows


async def current(connection, uid):
    reports = await rows(
        connection,
        "SELECT c.id,c.label,l.career_id,r.slug FROM asgard_private.user_competencies u "
        "JOIN asgard_catalog.competencies c ON c.id=u.competency_id AND c.published "
        "JOIN asgard_catalog.competency_links l ON l.competency_id=c.id "
        "JOIN asgard_catalog.careers r ON r.id=l.career_id AND r.status='published' "
        "WHERE u.user_id=CAST(:uid AS uuid) "
        "AND (u.level>0 OR (u.evidence_confirmed AND u.level IS NULL)) "
        "UNION SELECT c.id,c.label,r.id AS career_id,r.slug "
        "FROM asgard_private.user_competencies u "
        "JOIN asgard_catalog.competencies c ON c.id=u.competency_id AND c.published "
        "JOIN asgard_catalog.career_skill_snapshot s ON s.competency_id=c.id AND s.published "
        "JOIN asgard_catalog.career_skill_posting_versions v ON v.source=s.source "
        "AND v.source_version=s.source_version AND v.status='published' "
        "JOIN asgard_catalog.careers r ON r.id=s.career_id AND r.status='published' "
        "WHERE u.user_id=CAST(:uid AS uuid) "
        "AND (u.level>0 OR (u.evidence_confirmed AND u.level IS NULL))",
        {"uid": str(uid)},
    )
    state = await one(
        connection,
        "SELECT version FROM asgard_private.competency_state WHERE user_id=CAST(:uid AS uuid)",
        {"uid": str(uid)},
    )
    doc = await one(
        connection,
        "SELECT id,analysis_id,revision,evidence FROM asgard_private.documents "
        "WHERE user_id=CAST(:uid AS uuid) AND status='active'",
        {"uid": str(uid)},
    )
    support = {}
    for report in reports:
        support.setdefault(report["slug"], set()).add(str(report["id"]))
    task_roles = set()
    if doc:
        context = SimpleNamespace(
            document=SimpleNamespace(
                document_id=doc["id"], analysis_id=doc["analysis_id"], revision=doc["revision"]
            ),
            facts=[
                SimpleNamespace(
                    id="pdf:" + str(index),
                    source="pdf_analysis",
                    source_id=str(doc["analysis_id"]),
                    source_revision=doc["revision"],
                    description=item["text"],
                )
                for index, item in enumerate(doc["evidence"])
            ],
        )
        links = await saved_connections(connection, uid, context)
        careers = await rows(
            connection, "SELECT id,slug FROM asgard_catalog.careers WHERE status='published'"
        )
        exact = await rows(
            connection,
            "SELECT DISTINCT c.id,c.label,c.aliases,r.id AS career_id,r.slug "
            "FROM asgard_catalog.competencies c "
            "JOIN asgard_catalog.competency_links l ON l.competency_id=c.id "
            "JOIN asgard_catalog.careers r ON r.id=l.career_id "
            "WHERE c.published AND r.status='published'",
        )
        skills_by_career = {}
        for row in exact:
            skills_by_career.setdefault((row["career_id"], row["slug"]), []).append(
                BenchmarkSkill(str(row["id"]), row["label"],
                               tuple(row["aliases"] or []), row["id"])
            )
        evidence = [ResumeEvidence(item["kind"], item["text"], item["page"], item["span"])
                    for item in doc["evidence"]]
        ranked = rank_careers([
            Career(career_id, slug, tuple(skills))
            for (career_id, slug), skills in skills_by_career.items()
        ], (), evidence)
        for career in ranked:
            for skill in career.skill_matches:
                if skill.resume_signals:
                    support.setdefault(career.career_name, set()).add(str(skill.competency_id))
        for career in careers:
            for link in links.get(str(career["id"]), []):
                support.setdefault(career["slug"], set()).add(link["competency_id"])
                if len(link["label"].split()) >= 3 and re.search(
                    r"\b(built|implemented|deployed|debugged|configured|designed|tested)\b",
                    link["quote"],
                    re.I,
                ):
                    task_roles.add(career["slug"])
    token = hashlib.sha256(
        json.dumps(
            [
                state,
                [str(doc[k]) for k in ("id", "analysis_id", "revision")] if doc else None,
                {key: sorted(value) for key, value in support.items()},
            ],
            sort_keys=True,
        ).encode()
    ).hexdigest()
    counts = {key: len(value) for key, value in support.items()}
    counts["_task_roles"] = sorted(task_roles)
    return token, counts


async def augment_reports(connection, uid, reports):
    links = await rows(
        connection,
        "SELECT u.competency_id,r.id AS career_id,r.title FROM asgard_private.user_competencies u "
        "JOIN asgard_catalog.career_skill_snapshot s ON s.competency_id=u.competency_id "
        "JOIN asgard_catalog.career_skill_posting_versions v ON v.source=s.source "
        "AND v.source_version=s.source_version AND v.status='published' "
        "JOIN asgard_catalog.careers r ON r.id=s.career_id AND r.status='published' "
        "WHERE u.user_id=CAST(:uid AS uuid) AND s.published",
        {"uid": str(uid)},
    )
    for item in reports["items"]:
        for link in links:
            if str(item["competency_id"]) == str(link["competency_id"]) and not any(
                str(c["career_id"]) == str(link["career_id"]) for c in item["career_context"]
            ):
                item["career_context"].append(
                    {"career_id": link["career_id"], "title": link["title"]}
                )
    return reports
