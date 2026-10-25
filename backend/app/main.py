import logging
from contextlib import asynccontextmanager
from time import perf_counter
from uuid import uuid4

import httpx
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.health import router
from app.core.config import Settings, get_settings
from app.core.logging import configure_logging


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or get_settings()
    configure_logging()

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        async with httpx.AsyncClient(follow_redirects=False) as client:
            app.state.http = client
            yield

    app = FastAPI(title="Asgard API", version="0.1.0", lifespan=lifespan)
    app.state.settings = settings
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["Content-Type"],
        expose_headers=["X-Request-ID"],
    )

    @app.middleware("http")
    async def request_context(request: Request, call_next):
        request_id = str(uuid4())
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
        route = request.scope.get("route")
        logging.getLogger("asgard.request").info(
            "http_request",
            extra={
                "fields": {
                    "request_id": request_id,
                    "method": request.method,
                    "route": getattr(route, "path", "unmatched"),
                    "status": response.status_code,
                    "duration_ms": round((perf_counter() - started) * 1000, 2),
                }
            },
        )
        return response

    app.include_router(router, prefix="/api/v1")
    app.include_router(router, include_in_schema=False)
    return app


app = create_app()
