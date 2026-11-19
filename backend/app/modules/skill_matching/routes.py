"""Authenticated read-only skill matching endpoint."""

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Request

from app.core.errors import ErrorBody
from app.core.security import Identity, current_identity
from app.modules.skill_matching.interpretation import interpret
from app.modules.skill_matching.schemas import CareerSkillMatchResponse, InterpretationState
from app.modules.skill_matching.service import get_career_skill_matches
from app.modules.skill_matching.sources import SnapshotSource
from app.modules.storage import transaction

Auth = Annotated[Identity, Depends(current_identity)]
router = APIRouter(
    tags=["skill matching"],
    responses={code: {"model": ErrorBody} for code in (401, 503)},
)


@router.get(
    "/me/career-skill-matches",
    response_model=CareerSkillMatchResponse,
    operation_id="get_my_career_skill_matches",
)
async def career_skill_matches(
    request: Request, identity: Auth,
    basis: Literal["benchmark", "learning_path"] = "learning_path",
):
    settings = request.app.state.settings
    source = SnapshotSource(
        settings.skill_matching_benchmark_source, settings.skill_matching_benchmark_version,
    ) if basis == "benchmark" else None
    async with transaction(request, identity) as connection:
        return await get_career_skill_matches(connection, identity.user_id, source)


@router.post(
    "/me/documents/{document_id}/skill-interpretation", response_model=InterpretationState,
    responses={code: {"model": ErrorBody} for code in (401, 404, 409, 422, 429, 503)},
    operation_id="interpret_resume_skills",
)
async def interpret_resume_skills(document_id: UUID, request: Request, identity: Auth):
    return await interpret(request, identity, document_id)
