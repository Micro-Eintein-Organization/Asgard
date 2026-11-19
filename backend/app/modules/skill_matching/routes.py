"""Authenticated read-only skill matching endpoint."""

from typing import Annotated

from fastapi import APIRouter, Depends, Request

from app.core.errors import ErrorBody
from app.core.security import Identity, current_identity
from app.modules.skill_matching.schemas import CareerSkillMatchResponse
from app.modules.skill_matching.service import get_career_skill_matches
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
async def career_skill_matches(request: Request, identity: Auth):
    async with transaction(request, identity) as connection:
        return await get_career_skill_matches(connection, identity.user_id)
