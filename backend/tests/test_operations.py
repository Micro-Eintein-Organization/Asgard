import json
import logging
from io import StringIO
from unittest.mock import AsyncMock

import httpx
import pytest
from fastapi.testclient import TestClient
from pydantic import SecretStr

from app.core.config import Settings
from app.core.logging import JsonFormatter
from app.main import create_app


@pytest.fixture
def client():
    settings = Settings(
        cors_origins=["http://localhost:5173"],
        supabase_url="http://supabase.invalid",
        supabase_anon_key=SecretStr("fixture-public-key"),
        readiness_timeout_seconds=2,
    )
    with TestClient(create_app(settings)) as client:
        yield client


def test_liveness_does_not_require_supabase():
    with TestClient(create_app(Settings(supabase_anon_key=SecretStr("")))) as client:
        assert client.get("/health").json() == {"status": "ok"}
        assert client.get("/ready").status_code == 503
        assert client.get("/ready").json()["supabase_api"] == "not_configured"


@pytest.mark.parametrize("status_code", [200, 401, 503])
def test_readiness_reports_upstream_failure(client, status_code):
    client.app.state.http.get = AsyncMock(return_value=httpx.Response(status_code))
    response = client.get("/api/v1/ready")
    assert response.status_code == (200 if status_code == 200 else 503)
    assert response.json()["status"] == ("ready" if status_code == 200 else "not_ready")
    call = client.app.state.http.get.call_args
    assert call.args[0] == "http://supabase.invalid/auth/v1/settings"
    assert call.kwargs["headers"] == {"apikey": "fixture-public-key"}


def test_readiness_timeout_is_bounded_and_sanitized(client):
    client.app.state.http.get = AsyncMock(side_effect=httpx.ReadTimeout("sensitive upstream"))
    response = client.get("/ready")
    assert response.status_code == 503
    assert "sensitive" not in response.text
    assert client.app.state.http.get.call_args.kwargs["timeout"] == 2


def test_request_id_and_explicit_cors(client):
    response = client.get("/api/v1/health", headers={"Origin": "http://localhost:5173"})
    assert response.headers["x-request-id"]
    assert response.headers["access-control-allow-origin"] == "http://localhost:5173"
    forbidden = client.get("/health", headers={"Origin": "https://untrusted.invalid"})
    assert "access-control-allow-origin" not in forbidden.headers


def test_request_logs_omit_untrusted_paths_queries_and_credentials(client):
    stream = StringIO()
    handler = logging.StreamHandler(stream)
    handler.setFormatter(JsonFormatter())
    logger = logging.getLogger("asgard")
    logger.addHandler(handler)
    try:
        response = client.get(
            "/private-user-input?token=secret", headers={"Authorization": "Bearer secret"}
        )
    finally:
        logger.removeHandler(handler)
    records = [json.loads(line) for line in stream.getvalue().splitlines()]
    record = next(
        item for item in records if item.get("request_id") == response.headers["x-request-id"]
    )
    assert record["route"] == "unmatched"
    assert "secret" not in json.dumps(records)
    assert "private-user-input" not in json.dumps(records)


def test_formatter_outputs_valid_json():
    record = logging.LogRecord("asgard", logging.INFO, "", 0, "event", (), None)
    assert json.loads(JsonFormatter().format(record))["event"] == "event"
