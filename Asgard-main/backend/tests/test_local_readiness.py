import asyncio
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from pydantic import SecretStr

from scripts import check_local_readiness as readiness


@pytest.mark.parametrize("url", [
    "",
    "postgresql+psycopg://asgard_app:synthetic@unrelated-host:5432/postgres",
    "postgresql+psycopg://postgres:synthetic@supabase_db_test:5432/postgres",
])
def test_local_probe_never_connects_to_missing_remote_or_admin_target(monkeypatch, url):
    settings = SimpleNamespace(
        auth_enabled=True, groq_enabled=False, groq_api_key=SecretStr(""),
        deployment_environment="local", database_url=SecretStr(url),
    )
    monkeypatch.setenv("ASGARD_PROJECT_ID", "test")
    monkeypatch.setattr(readiness, "Settings", lambda: settings)
    connect = Mock(side_effect=AssertionError("Unexpected database access"))
    monkeypatch.setattr(readiness.ProfileRepository, "connect", connect)
    report = asyncio.run(readiness.inspect())
    assert not report["database_ready"] and not report["content_ready"]
    connect.assert_not_called()
    assert "synthetic" not in str(report)
