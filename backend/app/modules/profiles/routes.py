from typing import Annotated

from fastapi import APIRouter, Depends, Request
from sqlalchemy.exc import SQLAlchemyError

from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.profiles.schemas import ProfileEnvelope, ProfileUpdate, SavedProfileEnvelope

router = APIRouter(prefix="/me/profile", tags=["profiles"])
errors = {status: {"model": ErrorBody} for status in (401, 409, 422, 503)}


def repository(request: Request):
    result = request.app.state.profiles
    if result is None:
        raise APIError(
            503, "database_not_configured", "Profile storage is awaiting local setup approval."
        )
    return result


@router.get("", response_model=ProfileEnvelope, responses=errors, operation_id="get_my_profile")
async def get_profile(request: Request, identity: Annotated[Identity, Depends(current_identity)]):
    try:
        return ProfileEnvelope(profile=await repository(request).get(identity))
    except SQLAlchemyError as exc:
        raise APIError(
            503, "database_unavailable", "Profile storage is temporarily unavailable."
        ) from exc


@router.patch(
    "", response_model=SavedProfileEnvelope, responses=errors, operation_id="update_my_profile"
)
async def update_profile(
    update: ProfileUpdate,
    request: Request,
    identity: Annotated[Identity, Depends(current_identity)],
):
    try:
        return SavedProfileEnvelope(profile=await repository(request).update(identity, update))
    except SQLAlchemyError as exc:
        raise APIError(
            503, "database_unavailable", "Profile storage is temporarily unavailable."
        ) from exc
