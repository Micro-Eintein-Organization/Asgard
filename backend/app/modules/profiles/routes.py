from typing import Annotated
from uuid import uuid4

from fastapi import APIRouter, Depends, Request, Response
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from starlette.concurrency import run_in_threadpool

from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.profiles import photos
from app.modules.profiles.schemas import (
    ProfileEnvelope,
    ProfilePhotoUpdate,
    ProfileUpdate,
    SavedProfileEnvelope,
)

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
        return ProfileEnvelope(
            profile=await repository(request).get(identity),
            photo_enabled=photos.enabled(request.app.state.settings),
        )
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


@router.get(
    "/photo", response_class=Response, operation_id="get_my_profile_photo",
    responses=errors | {
        200: {"content": {"image/jpeg": {"schema": {"type": "string", "format": "binary"}}}},
        404: {"model": ErrorBody},
    },
)
async def get_photo(request: Request, identity: Annotated[Identity, Depends(current_identity)]):
    if not photos.enabled(request.app.state.settings):
        raise APIError(404, "photo_unavailable", "No profile photo is available.")
    repo = repository(request)
    try:
        photo_id = await photos.active_id(repo, identity)
        if photo_id is None:
            raise APIError(404, "photo_unavailable", "No profile photo is available.")
        content = await photos.object_request(request, identity, photo_id, "GET")
        if await photos.active_id(repo, identity) != photo_id:
            raise APIError(404, "photo_changed", "The profile photo changed. Reload to see it.")
    except SQLAlchemyError as exc:
        raise APIError(
            503, "database_unavailable", "Profile storage is temporarily unavailable."
        ) from exc
    return Response(content, media_type="image/jpeg", headers={"X-Content-Type-Options": "nosniff"})


@router.patch(
    "/photo", response_model=SavedProfileEnvelope, operation_id="update_my_profile_photo",
    responses=errors | {413: {"model": ErrorBody}},
    openapi_extra={"requestBody": {"required": True, "content": {
        "application/json": {"schema": ProfilePhotoUpdate.model_json_schema()},
    }}},
)
async def update_photo(request: Request, identity: Annotated[Identity, Depends(current_identity)]):
    if not photos.enabled(request.app.state.settings):
        raise APIError(503, "photos_disabled", "Profile photos are unavailable.")
    data = bytearray()
    async for chunk in request.stream():
        if len(data) + len(chunk) > 2_670_000:
            raise APIError(413, "photo_too_large", "Choose a photo no larger than 2 MB.")
        data.extend(chunk)
    try:
        body = ProfilePhotoUpdate.model_validate_json(data)
    except ValidationError as exc:
        raise APIError(
            422, "invalid_input", "Check your name and choose a photo up to 2 MB."
        ) from exc
    repo = repository(request)
    photo_id = None
    try:
        saved = await repo.get(identity)
        if body.expected_version != (saved.version if saved else 0):
            raise APIError(409, "profile_conflict", "Your profile changed. Reload before saving.")
        if body.photo is not None:
            content = await run_in_threadpool(photos.normalize, body.photo)
            photo_id = uuid4()
            await photos.reserve(repo, identity, photo_id)
            await photos.object_request(request, identity, photo_id, "POST", content)
        update = ProfileUpdate.model_validate(body.model_dump(exclude={"photo"}))
        saved = await repo.update(identity, update, change_photo=True, photo_id=photo_id)
    except SQLAlchemyError as exc:
        raise APIError(
            503, "database_unavailable", "Profile storage is temporarily unavailable."
        ) from exc
    try:
        await photos.cleanup(request, repo, identity)
    except (APIError, SQLAlchemyError):
        # The photo change has committed. The cleanup queue preserves the retry.
        pass
    return SavedProfileEnvelope(profile=saved)
