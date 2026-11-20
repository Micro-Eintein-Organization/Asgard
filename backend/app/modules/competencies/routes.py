from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request

from app.api.contracts import VersionedChange
from app.core.errors import ErrorBody
from app.core.security import Identity, current_identity
from app.modules.competencies import service
from app.modules.competencies.evidence import CareerEvidence
from app.modules.competencies.evidence import read as read_evidence
from app.modules.competencies.schemas import (
    CompetencyComparison,
    CompetencyPage,
    CompetencyState,
    ConfirmSkills,
    InterpretSkills,
    SaveCompetency,
    SkillPreview,
)
from app.modules.storage import transaction

Auth = Annotated[Identity, Depends(current_identity)]
router = APIRouter(
    tags=["competencies"],
    responses={code: {"model": ErrorBody} for code in (401, 404, 409, 422, 503)},
)


@router.post("/me/competencies/interpret", response_model=SkillPreview)
async def interpret_skills(request: Request, identity: Auth, body: InterpretSkills):
    from app.modules.competencies.interpretation import preview
    return await preview(request, identity, body)


@router.post("/me/competencies/confirm", response_model=CompetencyState)
async def confirm_skills(request: Request, identity: Auth, body: ConfirmSkills):
    from app.modules.competencies.interpretation import confirm
    return await confirm(request, identity, body)


@router.get("/competencies", response_model=CompetencyPage, operation_id="search_competencies")
async def search(
    request: Request,
    identity: Auth,
    q: str = "",
    career_id: UUID | None = None,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    async with transaction(request, identity) as connection:
        return await service.search(connection, q, career_id, limit, offset)


@router.get("/me/competencies", response_model=CompetencyState, operation_id="get_my_competencies")
async def state(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        await service.lock(connection, identity.user_id)
        data = await service.state(connection, identity.user_id)
        data["recommendations_enabled"] = await service.privacy_ready(connection)
        return data


@router.patch(
    "/me/competencies/{competency_id}",
    response_model=CompetencyState,
    operation_id="save_my_competency",
)
async def save(request: Request, identity: Auth, competency_id: UUID, body: SaveCompetency):
    async with transaction(request, identity) as connection:
        return await service.change(
            connection, identity.user_id, competency_id, body, identity=identity
        )


@router.post(
    "/me/competencies/{competency_id}/remove",
    response_model=CompetencyState,
    operation_id="remove_my_competency",
)
async def remove(request: Request, identity: Auth, competency_id: UUID, body: VersionedChange):
    async with transaction(request, identity) as connection:
        return await service.change(
            connection, identity.user_id, competency_id, body, remove=True, identity=identity
        )


@router.get(
    "/me/careers/{career_id}/competency-comparison",
    response_model=CompetencyComparison,
    operation_id="compare_my_competencies",
)
async def compare(request: Request, identity: Auth, career_id: UUID):
    async with transaction(request, identity) as connection:
        data = await service.compare(connection, identity.user_id, career_id)
        from app.modules.storage import one

        available = await one(
            connection,
            "SELECT to_regclass('asgard_catalog.occupational_active_release') IS NOT NULL AS ready",
        )
        if available["ready"]:
            release = await one(
                connection,
                "SELECT release_id FROM asgard_catalog.occupational_active_release WHERE singleton",
            )
            data["occupational_release_id"] = release["release_id"] if release else None
        return data


@router.get(
    "/careers/{career_id}/evidence",
    response_model=CareerEvidence,
    operation_id="get_career_evidence",
)
async def evidence(
    request: Request,
    identity: Auth,
    career_id: UUID,
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    offset: Annotated[int, Query(ge=0)] = 0,
    source_role: UUID | None = None,
    expected_release_id: UUID | None = None,
):
    async with transaction(request, identity) as connection:
        return await read_evidence(
            connection, career_id, limit, offset, source_role, expected_release_id
        )
