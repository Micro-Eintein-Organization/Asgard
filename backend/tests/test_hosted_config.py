from contextlib import asynccontextmanager
from types import SimpleNamespace
from unittest.mock import AsyncMock, patch

import httpx
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.main import create_app
from app.start import runtime_arguments


def configuration(**changes):
    return dict(
        deployment_environment="staging",
        supabase_url="https://project.example.test",
        auth_issuer="https://project.example.test/auth/v1",
        auth_enabled=True,
        supabase_anon_key="synthetic-public-key",
        cors_origins=["https://frontend.example.test"],
        database_url=(
            "postgresql+psycopg://asgard_app.project:synthetic@pool.example.test:5432/"
            "postgres?sslmode=verify-full"
        ),
    ) | changes


def test_valid_hosted_configuration():
    Settings(**configuration())


@pytest.mark.parametrize("changes", [
    {"cors_origins": ["*"]}, {"cors_origins": ["http://localhost:5173"]},
    {"database_url": "postgresql+psycopg://postgres:x@pool.test/postgres"},
    {"documents_processing_enabled": True}, {"auth_enabled": False},
    {"auth_issuer": "https://wrong.test/auth/v1"},
    {"supabase_url": "http://supabase_kong_asgard-foundation:8000"},
])
def test_hosted_configuration_fails_closed(changes):
    with pytest.raises(ValidationError):
        Settings(**configuration(**changes))


@pytest.mark.parametrize("port", ["0", "80", "65536", "8000;evil", "-1"])
def test_invalid_runtime_port(port):
    with pytest.raises(ValueError):
        runtime_arguments(port)


def test_platform_port_used():
    arguments = runtime_arguments("10000")
    assert arguments[5] == "10000"
    shutdown_budget = int(arguments[arguments.index("--timeout-graceful-shutdown") + 1])
    assert 0 < shutdown_budget < 30


@pytest.mark.parametrize("database_ready", [True, False])
def test_hosted_readiness_requires_database(database_ready):
    class Engine:
        @asynccontextmanager
        async def connect(self):
            yield SimpleNamespace(scalar=AsyncMock(return_value=database_ready))

    with TestClient(create_app(Settings(**configuration()))) as client:
        original = client.app.state.profiles
        try:
            client.app.state.profiles = SimpleNamespace(engine=Engine())
            client.app.state.http.get = AsyncMock(return_value=httpx.Response(200))
            response = client.get("/ready")
            assert response.status_code == (200 if database_ready else 503)
            assert response.json()["supabase_api"] == "available"
        finally:
            client.app.state.profiles = original


@pytest.mark.parametrize("detail, category", [
    ("certificate verify failed: secret", "tls_certificate"),
    ("password authentication failed: secret", "database_password"),
    ("permission denied: secret", "database_permission"),
    ("unexpected secret", "connection_or_query"),
])
def test_readiness_logs_sanitized_failure(detail, category):
    class Engine:
        @asynccontextmanager
        async def connect(self):
            raise RuntimeError(detail)
            yield

    with TestClient(create_app(Settings(**configuration()))) as client:
        original = client.app.state.profiles
        try:
            client.app.state.profiles = SimpleNamespace(engine=Engine())
            client.app.state.http.get = AsyncMock(return_value=httpx.Response(200))
            with patch("app.api.health.logger.warning") as warning:
                response = client.get("/ready")
            assert response.status_code == 503
            fields = warning.call_args.kwargs["extra"]["fields"]
            assert fields["database_failure"] == category
            assert fields["supabase_http_status"] == 200
            assert "secret" not in str(warning.call_args)
            assert "secret" not in response.text
        finally:
            client.app.state.profiles = original
