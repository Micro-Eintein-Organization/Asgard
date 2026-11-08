from datetime import datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from pydantic import Field

from app.api.contracts import Contract, VersionedChange
from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.careers import service
from app.modules.careers.schemas import Career
from app.modules.competencies import service as skills
from app.modules.competencies.schemas import ComparisonItem
from app.modules.recommendations.occupational_runtime import reference_release
from app.modules.storage import one, required, rows, transaction


class SavedCareer(Contract):
    career_id: UUID
    title: str
    note: str
    available: bool
    updated_at: datetime


class CareerShortlist(Contract):
    available: bool
    version: int
    items: list[SavedCareer]


class SaveCareer(VersionedChange):
    note: Annotated[str, Field(max_length=500)] = ""


class CareerColumn(Contract):
    career: Career
    experience: list[ComparisonItem]


class CareerComparison(Contract):
    catalog_release_id: UUID
    occupational_release_id: UUID | None
    account_version: int
    careers: Annotated[list[CareerColumn], Field(min_length=2, max_length=2)]


async def ready(connection):
    result = await one(
        connection, "SELECT to_regclass('asgard_private.career_shortlist') IS NOT NULL AS ready"
    )
    return result["ready"]


async def shortlist(connection, uid):
    if not await ready(connection):
        return {"available": False, "version": 0, "items": []}
    await one(
        connection, "SELECT pg_advisory_xact_lock(hashtextextended(:uid,512))", {"uid": str(uid)}
    )
    revision = await one(
        connection,
        "SELECT version FROM asgard_private.career_shortlist_state WHERE "
        "user_id=CAST(:uid AS uuid)",
        {"uid": str(uid)},
    )
    items = await rows(
        connection,
        "SELECT s.career_id,s.title,s.note,s.updated_at,coalesce(c.status='published',false) "
        "AS available FROM asgard_private.career_shortlist s LEFT JOIN asgard_catalog.careers c "
        "ON c.id=s.career_id WHERE s.user_id=CAST(:uid AS uuid) ORDER BY "
        "lower(s.title),s.career_id",
        {"uid": str(uid)},
    )
    return {"available": True, "version": revision["version"] if revision else 0, "items": items}


async def mutate(connection, uid, career_id, body, remove=False):
    if not await ready(connection):
        raise APIError(503, "shortlist_unavailable", "Saved careers are temporarily unavailable.")
    await one(
        connection, "SELECT pg_advisory_xact_lock(hashtextextended(:uid,512))", {"uid": str(uid)}
    )
    current = await shortlist(connection, uid)
    if current["version"] != body.expected_version:
        raise APIError(409, "shortlist_conflict", "Saved careers changed. Reload before saving.")
    params = {"uid": str(uid), "career": str(career_id), "version": current["version"] + 1}
    if not remove:
        career = required(
            await one(
                connection,
                "SELECT title FROM asgard_catalog.careers WHERE id=CAST(:career AS uuid) "
                "AND status='published'",
                params,
            )
        )
        params.update(title=career["title"], note=body.note)
    else:
        required(next((r for r in current["items"] if r["career_id"] == career_id), None))
    await one(
        connection,
        "INSERT INTO asgard_private.career_shortlist_state(user_id,version) "
        "VALUES(CAST(:uid AS uuid),:version) ON CONFLICT(user_id) DO UPDATE SET "
        "version=excluded.version RETURNING version",
        params,
    )
    if remove:
        await one(
            connection,
            "DELETE FROM asgard_private.career_shortlist WHERE user_id=CAST(:uid AS uuid) "
            "AND career_id=CAST(:career AS uuid) RETURNING career_id",
            params,
        )
    else:
        await one(
            connection,
            "INSERT INTO asgard_private.career_shortlist(user_id,career_id,title,note) "
            "VALUES(CAST(:uid AS uuid),CAST(:career AS uuid),:title,:note) ON "
            "CONFLICT(user_id,career_id) "
            "DO UPDATE SET title=excluded.title,note=excluded.note,"
            "updated_at=statement_timestamp() "
            "RETURNING career_id",
            params,
        )
    return await shortlist(connection, uid)


router = APIRouter(
    tags=["career-comparison"],
    responses={code: {"model": ErrorBody} for code in (401, 404, 409, 422, 503)},
)
Owner = Annotated[Identity, Depends(current_identity)]


@router.get(
    "/me/career-shortlist", response_model=CareerShortlist, operation_id="get_career_shortlist"
)
async def get_shortlist(request: Request, identity: Owner):
    async with transaction(request, identity) as connection:
        return await shortlist(connection, identity.user_id)


@router.patch(
    "/me/career-shortlist/{career_id}",
    response_model=CareerShortlist,
    operation_id="save_shortlisted_career",
)
async def save(request: Request, identity: Owner, career_id: UUID, body: SaveCareer):
    async with transaction(request, identity) as connection:
        return await mutate(connection, identity.user_id, career_id, body)


@router.post(
    "/me/career-shortlist/{career_id}/remove",
    response_model=CareerShortlist,
    operation_id="remove_shortlisted_career",
)
async def remove(request: Request, identity: Owner, career_id: UUID, body: VersionedChange):
    async with transaction(request, identity) as connection:
        return await mutate(connection, identity.user_id, career_id, body, True)


@router.get(
    "/me/career-comparison", response_model=CareerComparison, operation_id="compare_careers"
)
async def compare(
    request: Request,
    identity: Owner,
    left: Annotated[UUID, Query()],
    right: Annotated[UUID, Query()],
):
    if left == right:
        raise APIError(422, "distinct_careers_required", "Choose two different careers.")
    async with transaction(request, identity) as connection:
        await one(
            connection,
            "SELECT user_id FROM asgard_private.learning_state "
            "WHERE user_id=CAST(:uid AS uuid) FOR SHARE",
            {"uid": str(identity.user_id)},
        )
        await skills.lock(connection, identity.user_id)
        reference = await reference_release(connection)
        release = required(
            await one(
                connection, "SELECT id FROM asgard_catalog.releases ORDER BY version DESC LIMIT 1"
            )
        )
        columns = []
        version = 0
        for cid in (left, right):
            career = await service.career(connection, cid)
            if career["status"] != "published":
                raise APIError(404, "career_unavailable", "Choose another published career.")
            experience = await skills.compare(connection, identity.user_id, cid)
            version = experience["account_version"]
            columns.append({"career": career, "experience": experience["items"]})
        return {
            "catalog_release_id": release["id"],
            "occupational_release_id": reference,
            "account_version": version,
            "careers": columns,
        }
