"""Run existing opt-in Auth/RLS tests with synthetic accounts on the explicit local stack."""

import json
import os
import sys

import pytest

from app.core.config import Settings

settings = Settings()
private = json.load(sys.stdin)
if "supabase_db_asgard-foundation" not in settings.database_url.get_secret_value():
    raise SystemExit("Explicit asgard-foundation local stack required.")
os.environ.update(
    {
        "ASGARD_RUN_LOCAL_AUTH_TESTS": "1",
        "ASGARD_ALLOW_FOUNDATION_AUTH_TESTS": "1",
        "ASGARD_TEST_PROJECT_ID": "asgard-foundation",
        "ASGARD_TEST_AUTH_URL": settings.supabase_url,
        "ASGARD_TEST_DATABASE_URL": settings.database_url.get_secret_value(),
        "ASGARD_TEST_PUBLIC_KEY": settings.supabase_anon_key.get_secret_value(),
        "ASGARD_TEST_SERVICE_KEY": private["service_key"],
    }
)
raise SystemExit(pytest.main(["-q", "tests/integration/test_local_auth.py"]))
