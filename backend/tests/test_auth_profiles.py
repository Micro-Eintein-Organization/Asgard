import asyncio
import json
from datetime import UTC, datetime
from time import time
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import ec
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.core.config import Settings
from app.core.errors import APIError
from app.core.security import Identity, TokenVerifier, current_identity
from app.main import create_app
from app.modules.profiles.schemas import Profile, ProfileUpdate


def settings():
    return Settings(auth_enabled=True, auth_issuer="http://auth.test/auth/v1", database_url="")


@pytest.fixture
def signer():
    key = ec.generate_private_key(ec.SECP256R1())
    jwk = json.loads(jwt.algorithms.ECAlgorithm.to_jwk(key.public_key()))
    jwk.update(kid="test-key", alg="ES256", use="sig")
    claims = {
        "iss": settings().auth_issuer,
        "aud": "authenticated",
        "role": "authenticated",
        "exp": int(time()) + 900,
        "iat": int(time()),
        "sub": str(uuid4()),
        "session_id": str(uuid4()),
        "aal": "aal1",
    }
    return key, jwk, claims


def token(signer, **overrides):
    key, _, claims = signer
    return jwt.encode(claims | overrides, key, algorithm="ES256", headers={"kid": "test-key"})


def verify(signer, encoded, status=200):
    async def exercise():
        transport = httpx.MockTransport(
            lambda _: httpx.Response(status, json={"keys": [signer[1]]})
        )
        async with httpx.AsyncClient(transport=transport) as client:
            return await TokenVerifier(settings(), client).verify(encoded)

    return asyncio.run(exercise())


def test_signed_identity_requires_valid_issuer_and_session(signer):
    identity = verify(signer, token(signer))
    assert str(identity.user_id) == signer[2]["sub"]
    assert str(identity.session_id) == signer[2]["session_id"]


@pytest.mark.parametrize(
    "override",
    [
        {"iss": "http://attacker.invalid"},
        {"aud": "other"},
        {"exp": int(time()) - 60},
        {"role": "service_role"},
        {"sub": "not-a-uuid"},
        {"session_id": "not-a-uuid"},
        {"aal": "untrusted"},
        {"iat": int(time()) + 3600},
    ],
)
def test_reject_claim_confusion(signer, override):
    with pytest.raises(APIError) as error:
        verify(signer, token(signer, **override))
    assert error.value.status == 401


def test_reject_wrong_key_and_unsigned_or_symmetric_tokens(signer):
    other = ec.generate_private_key(ec.SECP256R1())
    for encoded in [
        jwt.encode(signer[2], other, algorithm="ES256", headers={"kid": "test-key"}),
        jwt.encode(
            signer[2], "not-a-server-secret-but-long-enough-for-a-fixture", algorithm="HS256"
        ),
        jwt.encode(signer[2], None, algorithm="none"),
        "malformed",
    ]:
        with pytest.raises(APIError) as error:
            verify(signer, encoded)
        assert error.value.status == 401


def test_key_service_failure_is_recoverable_without_token_details(signer):
    with pytest.raises(APIError) as error:
        verify(signer, token(signer), 503)
    assert error.value.status == 503
    assert token(signer) not in error.value.message


def test_profile_api_is_disabled_until_approval():
    with TestClient(create_app(Settings(auth_enabled=False))) as client:
        response = client.get("/api/v1/me/profile")
        assert response.status_code == 503
        assert response.json()["code"] == "auth_not_configured"
        assert response.headers["cache-control"] == "no-store"


def test_missing_bearer_is_unauthorized():
    with TestClient(create_app(settings())) as client:
        response = client.get("/api/v1/me/profile")
        assert response.status_code == 401
        assert response.headers["www-authenticate"] == "Bearer"


def test_profile_http_contract_and_conflict_without_live_database():
    identity = Identity(uuid4(), uuid4(), "aal1")
    app = create_app(settings())
    app.dependency_overrides[current_identity] = lambda: identity
    with TestClient(app) as client:
        saved = Profile(
            first_name="Ada",
            surname="",
            version=1,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
        )
        repository = AsyncMock()
        repository.get.return_value = None
        repository.update.return_value = saved
        app.state.profiles = repository
        assert client.get("/api/v1/me/profile").json() == {
            "profile": None, "photo_enabled": False,
        }
        response = client.patch(
            "/api/v1/me/profile", json={"first_name": "Ada", "expected_version": 0}
        )
        assert response.status_code == 200
        assert response.json()["profile"]["version"] == 1
        assert repository.update.call_args.args[0] == identity
        response = client.patch(
            "/api/v1/me/profile",
            json={
                "first_name": "Ada",
                "expected_version": 1,
                "user_id": str(uuid4()),
            },
        )
        assert response.status_code == 422
        assert "input" not in response.json()
        repository.update.side_effect = APIError(409, "profile_conflict", "Reload before saving.")
        assert (
            client.patch(
                "/api/v1/me/profile",
                json={
                    "first_name": "Ada",
                    "expected_version": 1,
                },
            ).status_code
            == 409
        )
        app.state.profiles = None


def test_unicode_names_and_version_validation():
    assert ProfileUpdate(first_name="  李  ", expected_version=0).first_name == "李"
    assert ProfileUpdate(first_name="😀" * 100, expected_version=0).first_name
    for fields in [
        {"first_name": " "},
        {"first_name": "x" * 101},
        {"first_name": "A\u0085B"},
        {"first_name": "Ada", "expected_version": True},
        {"first_name": "Ada", "expected_version": -1},
    ]:
        with pytest.raises(ValidationError):
            ProfileUpdate.model_validate({"expected_version": 0} | fields)
