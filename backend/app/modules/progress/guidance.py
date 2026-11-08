"""Private roadmap practice and milestone reflections."""

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Request
from pydantic import Field, model_validator
from sqlalchemy import text

from app.api.contracts import Contract, VersionedChange
from app.core.errors import ErrorBody
from app.core.security import Identity, current_identity
from app.modules.progress import service
from app.modules.progress.schemas import TopicStatus
from app.modules.storage import one, required, rows, transaction

Auth = Annotated[Identity, Depends(current_identity)]
router = APIRouter(
    prefix="/me/roadmaps/{roadmap_id}/guidance", tags=["guidance"],
    responses={code: {"model": ErrorBody} for code in (401, 404, 409, 422, 503)},
)


class GuidanceTopic(Contract):
    id: UUID
    milestone_id: UUID
    title: str
    explanation: str
    status: TopicStatus
    unavailable: Literal["retired", "branch"] | None
    skill_labels: list[str]


class GuidanceReflection(Contract):
    milestone_id: UUID
    title: str
    complete: bool
    retired: bool
    understood: str | None
    practise: str | None


class RoadmapGuidance(Contract):
    version: int
    next_topic: GuidanceTopic | None
    next_milestone_id: UUID | None
    needs_branch: bool
    topics: list[GuidanceTopic]
    practice: list[GuidanceTopic]
    suggestions: list[GuidanceTopic]
    reflections: list[GuidanceReflection]


class SavePractice(VersionedChange):
    saved: bool


class SaveReflection(VersionedChange):
    understood: Annotated[str, Field(max_length=1000)] = ""
    practise: Annotated[str, Field(max_length=1000)] = ""

    @model_validator(mode="after")
    def meaningful(self):
        if not (self.understood or self.practise):
            raise ValueError("Enter a reflection before saving.")
        return self


def parameters(uid, roadmap_id):
    return {"uid": uid, "roadmap": roadmap_id}


async def read(connection, uid, roadmap_id):
    params = parameters(uid, roadmap_id)
    content = await service.roadmap(connection, roadmap_id)
    progress_rows = await service.progress(connection, uid, roadmap_id)
    progress = {r["topic_id"]: r["status"] for r in progress_rows}
    chosen = {r["branch_id"] for r in await service.branches(connection, uid, roadmap_id)}
    state = await one(connection, """
        SELECT version FROM asgard_private.guidance_state
        WHERE user_id=:uid AND roadmap_id=:roadmap
    """, params)
    saved = {r["topic_id"] for r in await rows(connection, """
        SELECT topic_id FROM asgard_private.guidance_practice
        WHERE user_id=:uid AND roadmap_id=:roadmap
    """, params)}
    notes = {r["milestone_id"]: r for r in await rows(connection, """
        SELECT milestone_id, understood, practise FROM asgard_private.guidance_reflections
        WHERE user_id=:uid AND roadmap_id=:roadmap
    """, params)}
    linked = {}
    for row in await rows(connection, """
        SELECT l.topic_id, c.label FROM asgard_catalog.competency_links l
        JOIN asgard_catalog.competencies c ON c.id=l.competency_id
        JOIN asgard_private.user_competencies u ON u.competency_id=l.competency_id
        WHERE l.roadmap_id=:roadmap AND u.user_id=:uid AND u.level=0
        ORDER BY c.label, c.id
    """, params):
        linked.setdefault(row["topic_id"], []).append(row["label"])
    available, practice, suggestions, reflections = [], [], [], []
    next_topic = next_milestone_id = None
    needs_branch = False
    for milestone in content["milestones"]:
        retired = content["status"] == "retired" or milestone["retired_at"] is not None
        pending = any(
            not any(branch["id"] in chosen for branch in group["branches"])
            for group in milestone["branch_groups"]
        )
        applicable = []
        for topic in milestone["topics"]:
            tid = topic["id"]
            reason = None
            if retired or topic["retired_at"] is not None:
                reason = "retired"
            elif topic["branch_id"] is not None and topic["branch_id"] not in chosen:
                reason = "branch"
            item = {
                "id": tid, "milestone_id": milestone["id"], "title": topic["title"],
                "explanation": topic["explanation"], "status": progress.get(tid, "not_started"),
                "unavailable": reason, "skill_labels": linked.get(tid, []),
            }
            if tid in saved:
                practice.append(item)
            if reason is None:
                available.append(item)
                applicable.append(item)
                if item["skill_labels"] and item["status"] != "done" and tid not in saved:
                    suggestions.append(item)
        if not retired and next_milestone_id is None:
            candidate = next((t for t in applicable if t["status"] == "not_started"), None)
            if candidate or pending:
                next_topic, next_milestone_id = candidate, milestone["id"]
                needs_branch = candidate is None
        note = notes.get(milestone["id"], {})
        if not retired or note:
            reflections.append({
                "milestone_id": milestone["id"], "title": milestone["title"],
                "retired": retired, "complete": not retired and not pending and bool(applicable)
                and all(t["status"] == "done" for t in applicable),
                "understood": note.get("understood"), "practise": note.get("practise"),
            })
    active = next((t for t in available if t["status"] == "learning"), None)
    if active:
        next_topic, next_milestone_id, needs_branch = active, active["milestone_id"], False
    return {
        "version": state["version"] if state else 0, "next_topic": next_topic,
        "next_milestone_id": next_milestone_id, "needs_branch": needs_branch,
        "topics": available, "practice": practice, "suggestions": suggestions,
        "reflections": reflections,
    }


async def advance(connection, params, version):
    if version == 0:
        updated = await one(connection, """
            INSERT INTO asgard_private.guidance_state (user_id, roadmap_id, version)
            VALUES (:uid, :roadmap, 1) ON CONFLICT DO NOTHING RETURNING version
        """, params)
    else:
        updated = await one(connection, """
            UPDATE asgard_private.guidance_state SET version=version+1
            WHERE user_id=:uid AND roadmap_id=:roadmap AND version=:version RETURNING version
        """, {**params, "version": version})
    if updated is None:
        service.conflict()


@router.get("", response_model=RoadmapGuidance, operation_id="get_roadmap_guidance")
async def get_guidance(request: Request, identity: Auth, roadmap_id: UUID):
    async with transaction(request, identity) as connection:
        return await read(connection, identity.user_id, roadmap_id)


@router.put("/practice/{topic_id}", response_model=RoadmapGuidance, operation_id="save_practice")
async def save_practice(
    request: Request, identity: Auth, roadmap_id: UUID, topic_id: UUID, body: SavePractice,
):
    async with transaction(request, identity) as connection:
        current = await read(connection, identity.user_id, roadmap_id)
        if current["version"] != body.expected_version:
            service.conflict()
        key = "topics" if body.saved else "practice"
        required(next((item for item in current[key] if item["id"] == topic_id), None))
        params = {**parameters(identity.user_id, roadmap_id), "target": topic_id}
        await advance(connection, params, body.expected_version)
        query = """
            INSERT INTO asgard_private.guidance_practice (user_id, roadmap_id, topic_id)
            VALUES (:uid, :roadmap, :target) ON CONFLICT DO NOTHING
        """ if body.saved else """
            DELETE FROM asgard_private.guidance_practice
            WHERE user_id=:uid AND roadmap_id=:roadmap AND topic_id=:target
        """
        await connection.execute(text(query), params)
        return await read(connection, identity.user_id, roadmap_id)


async def write_reflection(request, identity, roadmap_id, milestone_id, body, remove):
    async with transaction(request, identity) as connection:
        current = await read(connection, identity.user_id, roadmap_id)
        if current["version"] != body.expected_version:
            service.conflict()
        reflections = current["reflections"]
        target = next((r for r in reflections if r["milestone_id"] == milestone_id), None)
        required(target)
        params = {**parameters(identity.user_id, roadmap_id), "target": milestone_id}
        await advance(connection, params, body.expected_version)
        if remove:
            await connection.execute(text("""
                DELETE FROM asgard_private.guidance_reflections
                WHERE user_id=:uid AND roadmap_id=:roadmap AND milestone_id=:target
            """), params)
        else:
            await connection.execute(text("""
                INSERT INTO asgard_private.guidance_reflections
                    (user_id, roadmap_id, milestone_id, understood, practise)
                VALUES (:uid, :roadmap, :target, :understood, :practise)
                ON CONFLICT (user_id, roadmap_id, milestone_id) DO UPDATE
                SET understood=excluded.understood, practise=excluded.practise
            """), {**params, "understood": body.understood, "practise": body.practise})
        return await read(connection, identity.user_id, roadmap_id)


@router.put("/reflections/{milestone_id}", response_model=RoadmapGuidance,
            operation_id="save_milestone_reflection")
async def save_reflection(
    request: Request, identity: Auth, roadmap_id: UUID, milestone_id: UUID, body: SaveReflection,
):
    return await write_reflection(request, identity, roadmap_id, milestone_id, body, False)


@router.delete("/reflections/{milestone_id}", response_model=RoadmapGuidance,
               operation_id="delete_milestone_reflection")
async def delete_reflection(
    request: Request, identity: Auth, roadmap_id: UUID, milestone_id: UUID, body: VersionedChange,
):
    return await write_reflection(request, identity, roadmap_id, milestone_id, body, True)
