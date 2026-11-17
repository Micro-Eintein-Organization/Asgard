import asyncio
from datetime import UTC, datetime, timedelta
from types import SimpleNamespace
from unittest.mock import AsyncMock
from uuid import uuid4

import httpx
import pytest
from pydantic import ValidationError

from app.core.errors import APIError
from app.core.security import Identity
from app.modules import account_deletion as deletion
from scripts import purge_accounts as worker


def body(**changes):
    return deletion.DeleteAccount(
        confirmation="DELETE", password="private-password", idempotency_key=uuid4(), **changes
    )


def test_confirmation_and_forged_owner_rejected():
    for payload in ({"confirmation": "delete"}, {"user_id": str(uuid4())}):
        values = {
            "confirmation": "DELETE",
            "password": "private-password",
            "idempotency_key": uuid4(),
        } | payload
        with pytest.raises(ValidationError):
            deletion.DeleteAccount(**values)
    assert "private-password" not in repr(body())


@pytest.mark.parametrize("failure", ["password", "mfa", "identity"])
def test_server_reauthentication_fails_without_acceptance(failure):
    async def check():
        uid = uuid4()
        identity = Identity(uid, uuid4(), "aal2")
        calls = []

        def handler(request):
            calls.append(request.url.path)
            if request.url.path.endswith("/user"):
                return httpx.Response(
                    200,
                    json={
                        "id": str(uid),
                        "email": "fixture@example.invalid",
                        "factors": [
                            {"id": str(uuid4()), "status": "verified", "factor_type": "totp"}
                        ],
                    },
                )
            if request.url.path.endswith("/token"):
                return httpx.Response(
                    401 if failure == "password" else 200, json={"access_token": "temporary"}
                )
            if request.url.path.endswith("/challenge"):
                return httpx.Response(200, json={"id": "challenge"})
            if request.url.path.endswith("/verify"):
                return httpx.Response(401, json={})
            return httpx.Response(204)

        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as http:
            settings = SimpleNamespace(
                supabase_url="https://project.invalid",
                supabase_anon_key=SimpleNamespace(get_secret_value=lambda: "public"),
            )
            verifier = SimpleNamespace(
                verify=AsyncMock(
                    return_value=Identity(
                        uuid4() if failure == "identity" else uid, uuid4(), "aal1"
                    )
                )
            )
            request = SimpleNamespace(
                headers={"authorization": "Bearer current"},
                app=SimpleNamespace(
                    state=SimpleNamespace(settings=settings, http=http, token_verifier=verifier)
                ),
            )
            with pytest.raises(APIError) as caught:
                await deletion.verify_fresh(request, identity, body(mfa_code="123456"))
            assert caught.value.status == 403
            assert not any("admin/users" in path for path in calls)
            if failure != "password":
                assert any(path.endswith("/logout") for path in calls)

    asyncio.run(check())


def test_idempotent_receipt_does_not_repeat_password_or_provider_work(monkeypatch):
    async def check():
        now = datetime.now(UTC)
        receipt = {
            "request_id": uuid4(),
            "accepted_at": now,
            "deadline_at": now + timedelta(days=7),
        }
        monkeypatch.setattr(deletion, "existing", AsyncMock(return_value=receipt))
        verify = AsyncMock()
        monkeypatch.setattr(deletion, "verify_fresh", verify)
        request = SimpleNamespace(
            app=SimpleNamespace(
                state=SimpleNamespace(
                    settings=SimpleNamespace(account_deletion_enabled=True), profiles=object()
                )
            )
        )
        assert await deletion.accept(request, body(), Identity(uuid4(), uuid4(), "aal1")) == receipt
        verify.assert_not_awaited()

    asyncio.run(check())


def test_concurrent_acceptance_returns_same_receipt(monkeypatch):
    async def check():
        receipt = {"request_id": uuid4()}
        monkeypatch.setattr(
            deletion,
            "accept_verified",
            AsyncMock(side_effect=APIError(401, "invalid_session", "Session unavailable.")),
        )
        monkeypatch.setattr(deletion, "existing", AsyncMock(return_value=receipt))
        request = SimpleNamespace(app=SimpleNamespace(state=SimpleNamespace(profiles=object())))
        assert await deletion.accept(request, body(), Identity(uuid4(), uuid4(), "aal1")) == receipt

    asyncio.run(check())


def test_server_accepts_fresh_password_and_verified_totp():
    async def check():
        uid, factor = uuid4(), uuid4()
        calls = []

        def handler(request):
            calls.append(request.url.path)
            if request.url.path.endswith("/user"):
                return httpx.Response(
                    200,
                    json={
                        "id": str(uid),
                        "email": "fixture@example.invalid",
                        "factors": [
                            {"id": str(factor), "status": "verified", "factor_type": "totp"}
                        ],
                    },
                )
            if request.url.path.endswith("/challenge"):
                return httpx.Response(200, json={"id": "challenge"})
            if request.url.path.endswith("/logout"):
                return httpx.Response(204)
            return httpx.Response(200, json={"access_token": "fresh"})

        verifier = SimpleNamespace(
            verify=AsyncMock(
                side_effect=[Identity(uid, uuid4(), "aal1"), Identity(uid, uuid4(), "aal2")]
            )
        )
        async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as http:
            settings = SimpleNamespace(
                supabase_url="https://project.invalid",
                supabase_anon_key=SimpleNamespace(get_secret_value=lambda: "public"),
            )
            request = SimpleNamespace(
                headers={"authorization": "Bearer current"},
                app=SimpleNamespace(
                    state=SimpleNamespace(settings=settings, http=http, token_verifier=verifier)
                ),
            )
            await deletion.verify_fresh(
                request, Identity(uid, uuid4(), "aal2"), body(mfa_code="123456")
            )
        assert f"/auth/v1/factors/{factor}/verify" in calls
        assert calls[-1] == "/auth/v1/logout"

    asyncio.run(check())


def test_worker_never_deletes_outside_account_prefix():
    async def check():
        def handler(request):
            assert request.method == "POST"
            return httpx.Response(200, json=[{"id": "object", "name": "../other-account/file.pdf"}])

        async with httpx.AsyncClient(
            base_url="https://project.invalid", transport=httpx.MockTransport(handler)
        ) as http:
            with pytest.raises(worker.PurgeFailure, match="storage_structure"):
                await worker.purge_storage(http, str(uuid4()))

    asyncio.run(check())


def test_worker_persists_storage_stage_before_auth_failure(monkeypatch):
    async def check():
        stages = []

        async def update(engine, job, stage=None, failure=None):
            stages.append(stage)
            job["stage"] = stage

        monkeypatch.setattr(worker, "update", update)

        def handler(request):
            if "/storage/" in request.url.path:
                return httpx.Response(200, json=[])
            return httpx.Response(503)

        job = {"user_id": uuid4(), "stage": "storage"}
        async with httpx.AsyncClient(
            base_url="https://project.invalid", transport=httpx.MockTransport(handler)
        ) as http:
            with pytest.raises(worker.PurgeFailure, match="auth_delete"):
                await worker.process(None, http, job)
        assert stages == ["auth"]
        assert job["stage"] == "auth"

    asyncio.run(check())
