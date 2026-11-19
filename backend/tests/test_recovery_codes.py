import asyncio
import time
from types import SimpleNamespace
from uuid import uuid4

import jwt
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.errors import APIError
from app.core.security import Identity
from app.main import create_app
from app.modules import account_deletion as deletion
from app.modules import recovery_codes as recovery


def token(methods=None):
    return jwt.encode(
        {
            "amr": methods
            if methods is not None
            else [
                {"method": "password", "timestamp": time.time()},
                {"method": "totp", "timestamp": time.time()},
            ]
        },
        "",
        algorithm="none",
    )


def test_codes_have_128_bits_and_account_bound_nonplaintext_digests():
    codes = recovery.new_codes()
    assert len(codes) == len(set(codes)) == 10
    owner, other = uuid4(), uuid4()
    for code in codes:
        canonical = recovery.canonical_code(code.upper())
        assert len(bytes.fromhex(canonical)) == 16
        assert len(recovery.digest(owner, canonical)) == 64
        assert canonical not in recovery.digest(owner, canonical)
        assert recovery.digest(owner, canonical) != recovery.digest(other, canonical)


@pytest.mark.parametrize(
    "methods,aal",
    [
        ([], "aal2"),
        ([{"method": "password", "timestamp": time.time()}], "aal2"),
        (
            [
                {"method": "password", "timestamp": time.time() - 301},
                {"method": "totp", "timestamp": time.time()},
            ],
            "aal2",
        ),
        (
            [
                {"method": "password", "timestamp": time.time()},
                {"method": "totp", "timestamp": time.time() + 60},
            ],
            "aal2",
        ),
        ([{"method": "password", "timestamp": "invalid"}], "aal2"),
        (None, "aal1"),
    ],
)
def test_issuance_requires_recent_primary_and_totp(methods, aal):
    with pytest.raises(APIError, match="Confirm your password"):
        recovery.recent_mfa(token(methods), Identity(uuid4(), uuid4(), aal))


def test_recent_aal2_accepts_signed_claim_formats():
    identity = Identity(uuid4(), uuid4(), "aal2")
    recovery.recent_mfa(token(), identity)
    recovery.recent_mfa(
        token(
            [
                {"method": "password", "timestamp": time.time()},
                {"method": "mfa/totp", "timestamp": time.time()},
            ]
        ),
        identity,
    )


def test_request_secrets_are_redacted_and_forged_account_rejected():
    body = recovery.BeginRecovery(password="private-password", code="private-code")
    assert "private-password" not in repr(body) and "private-code" not in repr(body)
    with pytest.raises(ValidationError):
        recovery.BeginRecovery(password="password", code="code", user_id=str(uuid4()))
    with pytest.raises(ValidationError):
        recovery.FinishRecovery(password="password", token="a" * 43, code="abcdef")


def test_configuration_fails_closed_without_admin_credential():
    with pytest.raises(ValidationError):
        Settings(recovery_codes_enabled=True)
    request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(settings=Settings())))
    with pytest.raises(APIError) as error:
        recovery.enabled(request)
    assert error.value.status == 503


def test_anonymous_recovery_is_denied_and_invalid_input_not_echoed(caplog):
    app = create_app(Settings(auth_enabled=True))
    with TestClient(app) as client:
        for path in ("", "/begin", "/prepare", "/finish", "/remove"):
            response = client.post(
                "/api/v1/me/recovery-codes" + path,
                json={
                    "password": "never-log-this-password",
                    "code": "never-log-this-code",
                },
            )
            assert response.status_code == 401
            assert response.headers["cache-control"] == "no-store"
            assert "never-log" not in response.text
    assert "never-log" not in caplog.text


def test_backup_code_cannot_directly_authorize_account_deletion():
    body = deletion.DeleteAccount(
        confirmation="DELETE",
        password="password",
        mfa_code="backup",
        recovery=True,
        idempotency_key=uuid4(),
    )
    with pytest.raises(APIError) as error:
        asyncio.run(deletion.verify_fresh(None, None, body))
    assert error.value.status == 403
    assert error.value.code == "authenticator_recovery_required"
