"""Focused acceptance in a disposable PostgreSQL container, never a shared database."""

import asyncio
import os
from contextlib import asynccontextmanager
from pathlib import Path
from types import SimpleNamespace
from uuid import UUID, uuid4

import httpx
import pytest
from sqlalchemy import text
from sqlalchemy.exc import DBAPIError
from sqlalchemy.ext.asyncio import create_async_engine
from test_recovery_codes import token

from app.core.errors import APIError
from app.core.security import Identity
from app.modules import recovery_codes as recovery
from app.modules.profiles.repository import ProfileRepository

URL = os.getenv("ASGARD_TEST_RECOVERY_DATABASE_URL", "")
pytestmark = pytest.mark.skipif(not URL, reason="Requires isolated recovery acceptance database.")


@asynccontextmanager
async def fixture():
    assert URL == "postgresql+psycopg://postgres@recovery-db/recovery"
    admin = create_async_engine(URL)
    app_engine = create_async_engine(URL.replace("postgres@", "asgard_app@"))
    async with admin.begin() as c:
        initialized = await c.scalar(text("SELECT to_regclass('asgard_private.recovery_codes')"))
        if not initialized:
            bootstrap = """
            CREATE ROLE asgard_app LOGIN NOSUPERUSER NOBYPASSRLS NOCREATEROLE NOCREATEDB;
            CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE asgard_maintenance;
            CREATE SCHEMA auth; CREATE SCHEMA asgard_private;
            GRANT USAGE ON SCHEMA asgard_private TO asgard_app,asgard_maintenance;
            CREATE TABLE auth.users(id uuid PRIMARY KEY,email text,email_confirmed_at timestamptz,
              deleted_at timestamptz,banned_until timestamptz);
            CREATE TABLE auth.sessions(id uuid PRIMARY KEY,user_id uuid REFERENCES auth.users(id)
              ON DELETE CASCADE);
            CREATE TABLE auth.mfa_factors(id uuid PRIMARY KEY,user_id uuid REFERENCES auth.users(id)
              ON DELETE CASCADE,status text,factor_type text);
            CREATE TABLE asgard_private.account_deletions(user_id uuid PRIMARY KEY);
            """
            migration = Path(
                "/migrations/20261119000100_application_recovery_codes.sql"
            ).read_text()
            raw = await c.get_raw_connection()
            await raw.driver_connection.execute(bootstrap + migration, prepare=False)
        uid, other, sid, fid = uuid4(), uuid4(), uuid4(), uuid4()
        for user_id in (uid, other):
            await c.execute(
                text(
                    "INSERT INTO auth.users(id,email,email_confirmed_at) "
                    "VALUES(:uid,'fixture@example.invalid',now())"
                ),
                {"uid": user_id},
            )
        await c.execute(
            text("INSERT INTO auth.sessions VALUES(:sid,:uid)"), {"sid": sid, "uid": uid}
        )
        await c.execute(
            text("INSERT INTO auth.mfa_factors VALUES(:fid,:uid,'verified','totp')"),
            {"fid": fid, "uid": uid},
        )
    identity = Identity(uid, sid, "aal2")
    sessions = {"current": identity}
    jwt_token = token()
    sessions[jwt_token] = identity
    log = []

    async def handler(request):
        path = request.url.path.removeprefix("/auth/v1")
        log.append((request.method, path))
        async with admin.begin() as c:
            if path == "/token":
                import json

                if json.loads(request.content)["password"] != "password":
                    return httpx.Response(400, json={"private": "wrong password"})
                session_id = uuid4()
                await c.execute(
                    text("INSERT INTO auth.sessions VALUES(:sid,:uid)"),
                    {"sid": session_id, "uid": uid},
                )
                access = str(uuid4())
                sessions[access] = Identity(uid, session_id, "aal1")
                return httpx.Response(
                    200,
                    json={
                        "access_token": access,
                        "refresh_token": "refresh",
                        "user": {"id": str(uid)},
                    },
                )
            if path.endswith("/user") or path == f"/admin/users/{uid}":
                factors = (
                    (
                        await c.execute(
                            text("SELECT * FROM auth.mfa_factors WHERE user_id=:uid"), {"uid": uid}
                        )
                    )
                    .mappings()
                    .all()
                )
                return httpx.Response(
                    200,
                    json={
                        "id": str(uid),
                        "email": "fixture@example.invalid",
                        "factors": [
                            {
                                "id": str(f["id"]),
                                "status": f["status"],
                                "factor_type": f["factor_type"],
                            }
                            for f in factors
                        ],
                    },
                )
            if request.method == "DELETE" and "/factors/" in path:
                factor = UUID(path.split("/")[-1])
                status = await c.scalar(
                    text(
                        "DELETE FROM auth.mfa_factors WHERE id=:fid "
                        "AND user_id=:uid RETURNING status"
                    ),
                    {"fid": factor, "uid": uid},
                )
                if status == "verified":
                    await c.execute(
                        text("DELETE FROM auth.sessions WHERE user_id=:uid"), {"uid": uid}
                    )
                return httpx.Response(200, json={})
            if path == "/factors":
                new_factor = uuid4()
                await c.execute(
                    text("INSERT INTO auth.mfa_factors VALUES(:fid,:uid,'unverified','totp')"),
                    {"fid": new_factor, "uid": uid},
                )
                return httpx.Response(
                    200,
                    json={
                        "id": str(new_factor),
                        "totp": {"secret": "private-seed", "qr_code": "private-qr"},
                    },
                )
            if path.endswith("/challenge"):
                return httpx.Response(200, json={"id": "challenge"})
            if path.endswith("/verify"):
                import json

                if json.loads(request.content)["code"] != "123456":
                    return httpx.Response(400, json={})
                factor = UUID(path.split("/")[-2])
                await c.execute(
                    text("UPDATE auth.mfa_factors SET status='verified' WHERE id=:fid"),
                    {"fid": factor},
                )
                old = request.headers["authorization"].removeprefix("Bearer ")
                verified = "verified-" + old
                sessions[verified] = Identity(uid, sessions[old].session_id, "aal2")
                return httpx.Response(
                    200, json={"access_token": verified, "refresh_token": "refresh"}
                )
            if path == "/logout":
                current = sessions.get(request.headers["authorization"].removeprefix("Bearer "))
                if current:
                    op = "<>" if request.url.params.get("scope") == "others" else "="
                    await c.execute(
                        text("DELETE FROM auth.sessions WHERE user_id=:uid AND id " + op + " :sid"),
                        {"uid": uid, "sid": current.session_id},
                    )
                return httpx.Response(204)
        raise AssertionError((request.method, path))

    async def verify(access):
        return sessions[access]

    async with httpx.AsyncClient(transport=httpx.MockTransport(handler)) as http:
        request = SimpleNamespace(
            method="POST",
            headers={"authorization": "Bearer " + jwt_token},
            app=SimpleNamespace(
                state=SimpleNamespace(
                    profiles=ProfileRepository(app_engine),
                    http=http,
                    token_verifier=SimpleNamespace(verify=verify),
                    settings=SimpleNamespace(
                        recovery_codes_enabled=True,
                        recovery_auth_admin_key=SimpleNamespace(get_secret_value=lambda: "admin"),
                        supabase_anon_key=SimpleNamespace(get_secret_value=lambda: "public"),
                        supabase_url="https://fixture.invalid",
                    ),
                )
            ),
        )
        try:
            yield request, identity, other, admin, log, sessions
        finally:
            async with admin.begin() as c:
                await c.execute(
                    text("DELETE FROM auth.users WHERE id IN (:uid,:other)"),
                    {"uid": uid, "other": other},
                )
            await admin.dispose()
            await app_engine.dispose()


async def allowed(admin, identity):
    async with admin.begin() as c:
        return await c.scalar(
            text("SELECT asgard_private.session_allowed(:uid,:sid,:aal)"),
            {"uid": identity.user_id, "sid": identity.session_id, "aal": identity.aal},
        )


def test_full_replacement_blocks_data_revokes_sessions_and_rotates_all_codes():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            codes = await recovery.issue(request, recovery.IssueCodes(), identity)
            assert await allowed(admin, identity)
            a1 = Identity(identity.user_id, identity.session_id, "aal1")
            assert not await allowed(admin, a1)
            capability = await recovery.begin(
                request, recovery.BeginRecovery(password="password", code=codes["codes"][0]), a1
            )
            assert not await allowed(admin, identity)
            setup = await recovery.prepare(
                request,
                recovery.ContinueRecovery(password="password", token=capability["token"]),
                a1,
            )
            assert setup["secret"] == "private-seed"
            assert not await allowed(admin, a1)
            finished = await recovery.finish(
                request,
                recovery.FinishRecovery(
                    password="password", token=capability["token"], code="123456"
                ),
                a1,
            )
            assert await allowed(admin, sessions[finished["access_token"]])
            assert not await allowed(admin, identity)
            assert not set(codes["codes"]).intersection(finished["codes"])
            assert log[-1] == ("POST", "/logout")

    asyncio.run(check())


def test_concurrent_code_reuse_has_one_winner_and_no_destructive_provider_call():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            issued = await recovery.issue(request, recovery.IssueCodes(), identity)
            body = recovery.BeginRecovery(password="password", code=issued["codes"][0])
            outcomes = await asyncio.gather(
                recovery.begin(request, body, identity),
                recovery.begin(request, body, identity),
                return_exceptions=True,
            )
            assert sum(isinstance(result, dict) for result in outcomes) == 1
            assert sum(isinstance(result, APIError) for result in outcomes) == 1
            assert not any(method == "DELETE" for method, _ in log)
            assert not await allowed(admin, identity)

    asyncio.run(check())


def test_wrong_password_code_and_cross_account_never_remove_factors_and_are_throttled():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            issued = await recovery.issue(request, recovery.IssueCodes(), identity)
            for password, code in [("wrong", issued["codes"][0])] + [("password", "wrong")] * 4:
                with pytest.raises(APIError):
                    await recovery.begin(
                        request, recovery.BeginRecovery(password=password, code=code), identity
                    )
            with pytest.raises(APIError) as error:
                await recovery.begin(
                    request,
                    recovery.BeginRecovery(password="password", code=issued["codes"][0]),
                    identity,
                )
            assert error.value.status == 429
            async with recovery.recovery_transaction(request, identity, live=True) as c:
                await c.execute(
                    text("SELECT set_config('asgard.user_id',:uid,true)"), {"uid": str(other)}
                )
                assert not (
                    await c.execute(text("SELECT * FROM asgard_private.recovery_codes"))
                ).all()
            assert await allowed(admin, identity)
            assert not any(method == "DELETE" for method, _ in log)

    asyncio.run(check())


def test_rotation_expiry_and_failed_replacement_stay_fail_closed():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            issued = await recovery.issue(request, recovery.IssueCodes(), identity)
            rotated = await recovery.issue(request, recovery.IssueCodes(replace=True), identity)
            with pytest.raises(APIError):
                await recovery.begin(
                    request,
                    recovery.BeginRecovery(password="password", code=issued["codes"][0]),
                    identity,
                )
            capability = await recovery.begin(
                request,
                recovery.BeginRecovery(password="password", code=rotated["codes"][0]),
                identity,
            )
            await recovery.prepare(
                request,
                recovery.ContinueRecovery(password="password", token=capability["token"]),
                identity,
            )
            with pytest.raises(APIError):
                await recovery.finish(
                    request,
                    recovery.FinishRecovery(
                        password="password", token=capability["token"], code="000000"
                    ),
                    identity,
                )
            assert not await allowed(admin, identity)
            async with admin.begin() as c:
                await c.execute(
                    text(
                        "UPDATE asgard_private.recovery_pending SET expires_at=now() "
                        "-interval '1 minute' WHERE user_id=:uid"
                    ),
                    {"uid": identity.user_id},
                )
            with pytest.raises(APIError):
                await recovery.prepare(
                    request,
                    recovery.ContinueRecovery(password="password", token=capability["token"]),
                    identity,
                )
            assert not await allowed(admin, identity)

    asyncio.run(check())


@pytest.mark.parametrize("stage", ["prepare", "finish"])
def test_provider_outage_never_clears_the_committed_account_block(monkeypatch, stage):
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            issued = await recovery.issue(request, recovery.IssueCodes(), identity)
            capability = await recovery.begin(
                request,
                recovery.BeginRecovery(password="password", code=issued["codes"][0]),
                identity,
            )
            if stage == "finish":
                await recovery.prepare(
                    request,
                    recovery.ContinueRecovery(password="password", token=capability["token"]),
                    identity,
                )
            original = recovery.Provider.call

            async def fail(self, method, path, **kwargs):
                if path == "/factors" or path.endswith("/verify"):
                    raise APIError(503, "provider_down", "Provider unavailable.")
                return await original(self, method, path, **kwargs)

            monkeypatch.setattr(recovery.Provider, "call", fail)
            with pytest.raises(APIError):
                if stage == "prepare":
                    await recovery.prepare(
                        request,
                        recovery.ContinueRecovery(password="password", token=capability["token"]),
                        identity,
                    )
                else:
                    await recovery.finish(
                        request,
                        recovery.FinishRecovery(
                            password="password", token=capability["token"], code="123456"
                        ),
                        identity,
                    )
            assert not await allowed(admin, identity)
            state = await recovery.state(request, identity)
            assert state["pending"]

    asyncio.run(check())


def test_rls_forbids_cross_account_insert_and_browser_reads():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            await recovery.issue(request, recovery.IssueCodes(), identity)
            async with recovery.recovery_transaction(request, identity) as c:
                with pytest.raises(DBAPIError):
                    async with c.begin_nested():
                        await c.execute(
                            text(
                                "INSERT INTO asgard_private.recovery_codes"
                                "(user_id,digest,set_id,factor_ids) "
                                "VALUES(:uid,:digest,:batch,'{}')"
                            ),
                            {"uid": other, "digest": "a" * 64, "batch": uuid4()},
                        )
            async with admin.begin() as c:
                for role in ("anon", "authenticated"):
                    for name in ("recovery_codes", "recovery_pending", "recovery_attempts"):
                        assert not await c.scalar(
                            text("SELECT has_table_privilege(:role,:table,'SELECT')"),
                            {"role": role, "table": "asgard_private." + name},
                        )

    asyncio.run(check())


def test_factor_change_invalidates_old_codes_and_sessions_of_other_accounts():
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            issued = await recovery.issue(request, recovery.IssueCodes(), identity)
            assert not await allowed(admin, Identity(other, identity.session_id, "aal2"))
            async with admin.begin() as c:
                await c.execute(
                    text("DELETE FROM auth.mfa_factors WHERE user_id=:uid"),
                    {"uid": identity.user_id},
                )
                await c.execute(
                    text("INSERT INTO auth.mfa_factors VALUES(:fid,:uid,'verified','totp')"),
                    {"fid": uuid4(), "uid": identity.user_id},
                )
            with pytest.raises(APIError):
                await recovery.begin(
                    request,
                    recovery.BeginRecovery(password="password", code=issued["codes"][0]),
                    identity,
                )
            assert (await recovery.state(request, identity))["remaining"] is None
            assert await allowed(admin, identity)

    asyncio.run(check())


@pytest.mark.parametrize("restriction", ["unconfirmed", "banned", "deleted", "deletion_pending"])
def test_account_restrictions_apply_to_both_data_and_recovery(restriction):
    async def check():
        async with fixture() as (request, identity, other, admin, log, sessions):
            async with admin.begin() as c:
                if restriction == "deletion_pending":
                    await c.execute(
                        text("INSERT INTO asgard_private.account_deletions VALUES(:uid)"),
                        {"uid": identity.user_id},
                    )
                else:
                    assignment = {
                        "unconfirmed": "email_confirmed_at=NULL",
                        "banned": "banned_until=now()+interval '1 day'",
                        "deleted": "deleted_at=now()",
                    }[restriction]
                    await c.execute(
                        text("UPDATE auth.users SET " + assignment + " WHERE id=:uid"),
                        {"uid": identity.user_id},
                    )
            assert not await allowed(admin, identity)
            with pytest.raises(APIError) as error:
                await recovery.state(request, identity)
            assert error.value.status == 401

    asyncio.run(check())
