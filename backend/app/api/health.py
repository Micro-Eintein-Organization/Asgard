from typing import Literal

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter(tags=["operations"])


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"


class ReadinessResponse(BaseModel):
    status: Literal["ready", "not_ready"]
    supabase_api: Literal["available", "unavailable", "not_configured"]


@router.get("/health", response_model=HealthResponse, operation_id="get_health")
async def health() -> HealthResponse:
    return HealthResponse()


@router.get(
    "/ready",
    response_model=ReadinessResponse,
    responses={503: {"model": ReadinessResponse}},
    operation_id="get_readiness",
)
async def ready(request: Request) -> ReadinessResponse | JSONResponse:
    settings = request.app.state.settings
    api_key = settings.supabase_anon_key.get_secret_value()
    state = "not_configured"
    if api_key:
        try:
            response = await request.app.state.http.get(
                f"{settings.supabase_url.rstrip('/')}/rest/v1/",
                headers={"apikey": api_key},
                timeout=settings.readiness_timeout_seconds,
            )
            state = "available" if response.is_success else "unavailable"
        except httpx.HTTPError:
            state = "unavailable"
    result = ReadinessResponse(
        status="ready" if state == "available" else "not_ready",
        supabase_api=state,
    )
    if result.status == "not_ready":
        return JSONResponse(status_code=503, content=result.model_dump())
    return result
