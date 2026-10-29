from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request, Response

from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.documents import service
from app.modules.documents.schemas import AnalyzeDocument, DocumentCommand, DocumentState
from app.modules.storage import one, required, transaction

router = APIRouter(prefix="/me/documents", tags=["documents"])
Owner = Annotated[Identity, Depends(current_identity)]
errors = {status: {"model": ErrorBody} for status in (401, 404, 409, 413, 422, 429, 503)}


@router.get("", response_model=DocumentState, responses=errors, operation_id="get_my_documents")
async def get_documents(request: Request, identity: Owner):
    async with transaction(request, identity) as connection:
        return await service.state(connection, identity.user_id, request.app.state.settings)


@router.post(
    "/upload",
    response_model=DocumentState,
    responses=errors,
    operation_id="upload_my_document",
    openapi_extra={
        "requestBody": {
            "required": True,
            "content": {"application/pdf": {"schema": {"type": "string", "format": "binary"}}},
        }
    },
)
async def upload(request: Request, identity: Owner, expected_revision: Annotated[int, Query(ge=1)]):
    if not request.app.state.settings.documents_processing_enabled:
        raise APIError(503, "documents_deferred", "PDF processing is coming later.")
    if request.headers.get("content-type", "").split(";")[0] != "application/pdf":
        raise APIError(422, "invalid_type", "Choose a PDF file.")
    data = bytearray()
    async for chunk in request.stream():
        data.extend(chunk)
        if len(data) > 10_000_000:
            raise APIError(413, "file_too_large", "Choose a PDF no larger than 10 MB.")
    return await service.upload(request, identity, expected_revision, bytes(data))


@router.post(
    "/{document_id}/analyze",
    response_model=DocumentState,
    responses=errors,
    operation_id="analyze_my_document",
)
async def analyze(document_id: UUID, body: AnalyzeDocument, request: Request, identity: Owner):
    if not request.app.state.settings.documents_processing_enabled:
        raise APIError(503, "documents_deferred", "PDF processing is coming later.")
    return await service.analyze(request, identity, document_id, body)


@router.post(
    "/remove", response_model=DocumentState, responses=errors, operation_id="remove_my_documents"
)
async def remove(body: DocumentCommand, request: Request, identity: Owner):
    return await service.remove(request, identity, body.expected_revision)


@router.post(
    "/cleanup", response_model=DocumentState, responses=errors, operation_id="cleanup_my_documents"
)
async def cleanup(request: Request, identity: Owner):
    await service.cleanup(request, identity)
    return await get_documents(request, identity)


@router.get(
    "/{document_id}/download",
    responses=errors,
    operation_id="download_my_document",
    response_class=Response,
)
async def download(document_id: UUID, request: Request, identity: Owner):
    async with transaction(request, identity) as connection:
        item = required(
            await one(
                connection,
                (
                    "SELECT object_key FROM asgard_private.documents WHERE "
                    "user_id=CAST(:uid AS uuid) AND id=CAST(:id AS uuid) AND status IN "
                    "('active','uploaded')"
                ),
                {"uid": str(identity.user_id), "id": str(document_id)},
            )
        )
    result = await service.object_request(request, "GET", item["object_key"])
    # Recheck removal after the external read before releasing any bytes.
    async with transaction(request, identity) as connection:
        await service.head(connection, identity.user_id)
        required(
            await one(
                connection,
                (
                    "SELECT id FROM asgard_private.documents WHERE user_id=CAST(:uid AS "
                    "uuid) AND id=CAST(:id AS uuid) AND status IN ('active','uploaded')"
                ),
                {"uid": str(identity.user_id), "id": str(document_id)},
            )
        )
    return Response(
        result.content,
        media_type="application/pdf",
        headers={
            "Content-Disposition": 'attachment; filename="document.pdf"',
            "Cache-Control": "no-store",
        },
    )
