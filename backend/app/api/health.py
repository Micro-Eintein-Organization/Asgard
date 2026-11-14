import asyncio
import logging
from typing import Literal

import httpx
from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import text

router = APIRouter(tags=["operations"])
logger = logging.getLogger("asgard")


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
    api_status = None
    database_failure = None
    if api_key:
        try:
            response = await request.app.state.http.get(
                f"{settings.supabase_url.rstrip('/')}/rest/v1/",
                headers={"apikey": api_key},
                timeout=settings.readiness_timeout_seconds,
            )
            state = "available" if response.is_success else "unavailable"
            api_status = response.status_code
        except httpx.HTTPError:
            state = "unavailable"
    database_ready = True
    if settings.deployment_environment != "local":
        repository = request.app.state.profiles
        database_ready = False
        database_failure = "repository_not_configured"
        if repository is not None:
            try:
                async with asyncio.timeout(settings.readiness_timeout_seconds):
                    async with repository.engine.connect() as connection:
                        database_ready = bool(await connection.scalar(text(
                            "SELECT current_user = 'asgard_app' AND NOT rolsuper "
                            "AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb "
                            "AND EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=2) "
                            "FROM pg_roles WHERE rolname=current_user"
                        )))
                        database_failure = None if database_ready else "role_or_release_check"
            except Exception as error:
                database_ready = False
                database_failure = "connection_or_query"
                detail = str(error).lower()
                for needle, category in (
                    ("certificate", "tls_certificate"),
                    ("password authentication failed", "database_password"),
                    ("permission denied", "database_permission"),
                    ("could not translate host", "database_dns"),
                ):
                    if needle in detail:
                        database_failure = category
                        break
                if isinstance(error, TimeoutError):
                    database_failure = "database_timeout"
    result = ReadinessResponse(
        status="ready" if state == "available" and database_ready else "not_ready",
        supabase_api=state,
    )
    if result.status == "not_ready":
        logger.warning("readiness_failed", extra={"fields": {
            "supabase_api": state,
            "supabase_http_status": api_status,
            "database_failure": database_failure,
        }})
        return JSONResponse(status_code=503, content=result.model_dump())
    return result
