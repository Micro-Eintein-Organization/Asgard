import logging
from contextlib import asynccontextmanager
from time import perf_counter
from uuid import uuid4

import httpx
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.foundation import router as foundation_router
from app.api.health import router
from app.core.config import Settings, get_settings
from app.core.database_metrics import current_metrics
from app.core.errors import APIError, api_error
from app.core.logging import configure_logging
from app.core.security import TokenVerifier
from app.modules.profiles.repository import ProfileRepository
from app.modules.profiles.routes import router as profile_router


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with httpx.AsyncClient(follow_redirects=False) as client:
            app.state.http = client
            app.state.token_verifier = TokenVerifier(settings, client)
            url = settings.database_url.get_secret_value()
            app.state.profiles = (
                ProfileRepository.connect(url) if settings.auth_enabled and url else None
            )
            try:
                yield
            finally:
                await app.state.comparison_insights.close()
                if app.state.profiles is not None:
                    await app.state.profiles.engine.dispose()

    app = FastAPI(title="Asgard API", version="0.1.0", lifespan=lifespan)
    app.state.settings = settings
    app.add_exception_handler(APIError, api_error)

    @app.exception_handler(RequestValidationError)
    async def invalid_input(request: Request, error: RequestValidationError):
        return await api_error(
            request, APIError(422, "invalid_input", "Check the submitted fields and try again.")
        )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET", "PATCH", "POST"],
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["X-Request-ID", "Retry-After"],
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request_id = str(uuid4())
        request.state.request_id = request_id
        metrics = {"database_query_count": 0, "database_execution_ms": 0.0,
                   "database_acquisition_ms": 0.0}
        metrics_token = current_metrics.set(metrics)
        started = perf_counter()
        try:
            response = await call_next(request)
        except Exception:
            response = JSONResponse(
                status_code=500,
                content={
                    "code": "internal_error",
                    "message": "An unexpected error occurred.",
                    "request_id": request_id,
                },
            )
        response.headers["X-Request-ID"] = request_id
        if request.url.path.startswith("/api/v1/me/"):
            response.headers["Cache-Control"] = "no-store"
        route = request.scope.get("route")
        logging.getLogger("asgard.request").info(
            "http_request",
            extra={
                "fields": {
                    **{key: round(value, 2) for key, value in metrics.items()},
                    "request_id": request_id,
                    "method": request.method,
                    "route": getattr(route, "path", "unmatched"),
                    "status": response.status_code,
                    "duration_ms": round((perf_counter() - started) * 1000, 2),
                }
            },
        )
        current_metrics.reset(metrics_token)
        return response

    app.include_router(router, prefix="/api/v1")
    from app.modules.competencies.routes import router as competency_router

    app.include_router(competency_router, prefix="/api/v1")
    from app.modules.careers.esco import router as esco_router

    app.include_router(esco_router, prefix="/api/v1")
    from app.modules.progress.guidance import router as guidance_router

    app.include_router(guidance_router, prefix="/api/v1")
    from app.modules.careers.comparison import router as comparison_router

    app.include_router(comparison_router, prefix="/api/v1")
    from app.modules.ai_guidance import ComparisonInsights
    from app.modules.ai_guidance import router as ai_guidance_router

    app.state.comparison_insights = ComparisonInsights()
    app.include_router(ai_guidance_router, prefix="/api/v1")
    from app.modules.account_deletion import router as deletion_router
    app.include_router(deletion_router, prefix="/api/v1")
    app.include_router(profile_router, prefix="/api/v1")
    app.include_router(foundation_router, prefix="/api/v1")
    from app.modules.documents.routes import router as document_router

    app.include_router(document_router, prefix="/api/v1")
    app.include_router(router, include_in_schema=False)
    return app


app = create_app()
