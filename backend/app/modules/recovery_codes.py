"""One-use backup credentials authorize TOTP replacement, never application AAL2."""

import hashlib
import hmac
import secrets
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from time import time
from typing import Annotated
from uuid import UUID, uuid4

import httpx
import jwt
from fastapi import APIRouter, Depends, Request
from pydantic import Field, SecretStr, field_validator
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.contracts import Contract
from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity, unauthorized
from app.modules.storage import one, transaction

router = APIRouter(
    prefix="/me/recovery-codes",
    tags=["account"],
    responses={status: {"model": ErrorBody} for status in (401, 403, 409, 422, 429, 503)},
)
Account = Annotated[Identity, Depends(current_identity)]


class RecoveryState(Contract):
    enabled: bool
    pending: bool
    remaining: int | None


class IssuedCodes(Contract):
    codes: list[str]
    total: int


class IssueCodes(Contract):
    replace: bool = False


class BeginRecovery(Contract):
    password: Annotated[SecretStr, Field(min_length=1, max_length=1024)]
    code: Annotated[SecretStr, Field(min_length=1, max_length=100)]


class ContinueRecovery(Contract):
    password: Annotated[SecretStr, Field(min_length=1, max_length=1024)]
    token: Annotated[SecretStr, Field(min_length=40, max_length=100)]


class FinishRecovery(ContinueRecovery):
    code: Annotated[SecretStr, Field(min_length=6, max_length=6)]

    @field_validator("code")
    @classmethod
    def totp_code(cls, value):
        if not value.get_secret_value().isascii() or not value.get_secret_value().isdigit():
            raise ValueError("Enter six digits.")
        return value


class RecoveryCapability(Contract):
    token: str


class ReplacementSetup(Contract):
    secret: str
    qr: str


class RecoveredSession(IssuedCodes):
    access_token: str
    refresh_token: str


def digest(user_id: UUID, value: str) -> str:
    return hashlib.sha256(f"asgard-recovery-v1:{user_id}:{value}".encode()).hexdigest()


def canonical_code(value: str) -> str:
    return value.strip().lower().replace("-", "").replace(" ", "")


def new_codes() -> list[str]:
    return [
        "-".join(value[i : i + 4] for i in range(0, 32, 4))
        for value in (secrets.token_hex(16) for _ in range(10))
    ]


def enabled(request):
    settings = request.app.state.settings
    if (
        not settings.recovery_codes_enabled
        or not settings.recovery_auth_admin_key.get_secret_value()
    ):
        raise APIError(503, "recovery_unavailable", "Backup-code recovery is not enabled yet.")


def recent_mfa(token: str, identity: Identity):
    # current_identity has already verified this exact JWT's signature and claims.
    claims = jwt.decode(token, options={"verify_signature": False})
    methods = claims.get("amr", [])
    recent = {
        item.get("method")
        for item in methods
        if isinstance(item, dict)
        and type(item.get("timestamp")) in (int, float)
        and time() - 300 <= item["timestamp"] <= time() + 5
    }
    if (
        identity.aal != "aal2"
        or "password" not in recent
        or not recent.intersection({"totp", "mfa/totp"})
    ):
        raise APIError(403, "fresh_mfa_required", "Confirm your password and authenticator again.")


@asynccontextmanager
async def recovery_transaction(request, identity, *, live=False):
    repo = request.app.state.profiles
    if repo is None:
        raise APIError(503, "recovery_unavailable", "Account recovery storage is unavailable.")
    try:
        async with repo.engine.begin() as connection:
            safe = await connection.scalar(
                text(
                    "SELECT current_user='asgard_app' AND NOT rolsuper AND NOT rolbypassrls "
                    "AND NOT rolcreaterole AND NOT rolcreatedb "
                    "FROM pg_roles WHERE rolname=current_user"
                )
            )
            if not safe:
                raise APIError(
                    503, "unsafe_database_role", "Account access is not configured safely."
                )
            params = {"uid": str(identity.user_id), "sid": str(identity.session_id), "live": live}
            await connection.execute(
                text("SELECT pg_advisory_xact_lock(hashtextextended(CAST(:uid AS text),481516))"),
                params,
            )
            allowed = await connection.scalar(
                text(
                    "SELECT asgard_private.recovery_identity_allowed("
                    "CAST(:uid AS uuid),CAST(:sid AS uuid),:live)"
                ),
                params,
            )
            if not allowed:
                raise unauthorized()
            await connection.execute(text("SELECT set_config('asgard.user_id',:uid,true)"), params)
            yield connection
    except SQLAlchemyError as error:
        raise APIError(
            503, "recovery_storage_unavailable", "Recovery was not confirmed. Try later."
        ) from error


async def attempt(request, identity, action, *, token=None):
    async with recovery_transaction(request, identity, live=action == "begin") as connection:
        if token is not None:
            await pending(connection, identity, token)
        params = {"uid": str(identity.user_id), "action": action, "id": str(uuid4())}
        await connection.execute(
            text(
                "DELETE FROM asgard_private.recovery_attempts WHERE user_id=CAST(:uid AS uuid) "
                "AND created_at<statement_timestamp()-interval '1 day'"
            ),
            params,
        )
        count = await connection.scalar(
            text(
                "SELECT count(*) FROM asgard_private.recovery_attempts "
                "WHERE user_id=CAST(:uid AS uuid) "
                "AND action=:action AND created_at>statement_timestamp()-interval '15 minutes'"
            ),
            params,
        )
        if count >= 5:
            raise APIError(
                429, "recovery_throttled", "Too many attempts. Wait 15 minutes.", retry_after=900
            )
        await connection.execute(
            text(
                "INSERT INTO asgard_private.recovery_attempts(user_id,id,action) "
                "VALUES(CAST(:uid AS uuid),CAST(:id AS uuid),:action)"
            ),
            params,
        )


async def pending(connection, identity, token):
    state = await one(
        connection,
        "SELECT * FROM asgard_private.recovery_pending WHERE user_id=CAST(:uid AS uuid)",
        {"uid": str(identity.user_id)},
    )
    if (
        not state
        or state["expires_at"] <= datetime.now(UTC)
        or not hmac.compare_digest(state["token_digest"], digest(identity.user_id, token))
    ):
        raise APIError(403, "recovery_expired", "Start again with another unused backup code.")
    return state


class Provider:
    def __init__(self, request, identity):
        self.request = request
        self.identity = identity
        self.settings = request.app.state.settings
        self.temporary = None

    async def call(self, method, path, *, token=None, data=None, admin=False):
        key = (
            self.settings.recovery_auth_admin_key if admin else self.settings.supabase_anon_key
        ).get_secret_value()
        headers = {"apikey": key}
        if token or admin:
            headers["Authorization"] = "Bearer " + (key if admin else token)
        try:
            response = await self.request.app.state.http.request(
                method,
                self.settings.supabase_url.rstrip("/") + "/auth/v1" + path,
                headers=headers,
                json=data,
                timeout=10,
            )
            if response.status_code == 429:
                raise APIError(
                    429, "recovery_throttled", "Too many attempts. Try later.", retry_after=900
                )
            if not response.is_success:
                raise APIError(
                    503 if admin or response.status_code >= 500 else 403,
                    "recovery_provider_failed",
                    "Recovery was not confirmed. Try again.",
                )
            return response.json() if response.content else {}
        except (httpx.HTTPError, ValueError) as error:
            raise APIError(
                503,
                "recovery_provider_unavailable",
                "Recovery was not confirmed. Your account stays protected.",
            ) from error

    async def user(self, *, admin=False):
        user = await self.call(
            "GET",
            f"/admin/users/{self.identity.user_id}" if admin else "/user",
            token=None if admin else bearer_token(self.request),
            admin=admin,
        )
        if user.get("id") != str(self.identity.user_id) or not user.get("email"):
            raise APIError(
                403, "recovery_identity_failed", "Sign in again to recover this account."
            )
        return user

    async def password(self, user, password):
        result = await self.call(
            "POST",
            "/token?grant_type=password",
            data={"email": user["email"], "password": password},
        )
        self.temporary = result["access_token"]
        verified = await self.request.app.state.token_verifier.verify(self.temporary)
        if verified.user_id != self.identity.user_id or result.get("user", {}).get("id") != str(
            self.identity.user_id
        ):
            raise APIError(403, "recovery_identity_failed", "Password verification failed.")
        return result

    async def remove_factors(self, *, keep=None):
        user = await self.user(admin=True)
        for factor in user.get("factors", []):
            fid = str(UUID(factor["id"]))
            if fid != keep:
                await self.call(
                    "DELETE", f"/admin/users/{self.identity.user_id}/factors/{fid}", admin=True
                )

    async def close(self):
        if self.temporary:
            try:
                await self.call("POST", "/logout?scope=local", token=self.temporary)
            except APIError:
                pass
            self.temporary = None


def bearer_token(request):
    return request.headers.get("authorization", "").removeprefix("Bearer ")


async def save_codes(connection, identity, factor_ids):
    codes = new_codes()
    await connection.execute(
        text("DELETE FROM asgard_private.recovery_codes WHERE user_id=CAST(:uid AS uuid)"),
        {"uid": str(identity.user_id)},
    )
    batch = uuid4()
    await connection.execute(
        text(
            "INSERT INTO asgard_private.recovery_codes(user_id,digest,set_id,factor_ids) "
            "VALUES(CAST(:uid AS uuid),:digest,CAST(:batch AS uuid),CAST(:factors AS uuid[]))"
        ),
        [
            {
                "uid": str(identity.user_id),
                "digest": digest(identity.user_id, canonical_code(code)),
                "batch": str(batch),
                "factors": factor_ids,
            }
            for code in codes
        ],
    )
    return {"codes": codes, "total": len(codes)}


@router.get("", response_model=RecoveryState)
async def state(request: Request, identity: Account):
    if request.app.state.profiles is None:
        if request.app.state.settings.recovery_codes_enabled:
            raise APIError(503, "recovery_unavailable", "Account storage is unavailable.")
        return {"enabled": False, "pending": False, "remaining": None}
    async with recovery_transaction(request, identity) as connection:
        params = {"uid": str(identity.user_id)}
        blocked = await connection.scalar(
            text(
                "SELECT EXISTS(SELECT 1 FROM asgard_private.recovery_pending "
                "WHERE user_id=CAST(:uid AS uuid))"
            ),
            params,
        )
        counts = await one(
            connection,
            "SELECT count(*) AS total,count(*) FILTER(WHERE used_at IS NULL) AS remaining "
            "FROM asgard_private.recovery_codes WHERE user_id=CAST(:uid AS uuid) "
            "AND (:blocked OR factor_ids=asgard_private.recovery_factor_ids(CAST(:uid AS uuid)))",
            params | {"blocked": blocked},
        )
    settings = request.app.state.settings
    return {
        "enabled": settings.recovery_codes_enabled
        and bool(settings.recovery_auth_admin_key.get_secret_value()),
        "pending": blocked,
        "remaining": counts["remaining"] if counts["total"] else None,
    }


@router.post("", response_model=IssuedCodes)
async def issue(request: Request, body: IssueCodes, identity: Account):
    enabled(request)
    recent_mfa(bearer_token(request), identity)
    async with transaction(request, identity) as connection:
        factor_ids = await connection.scalar(
            text("SELECT asgard_private.recovery_factor_ids(CAST(:uid AS uuid))"),
            {"uid": str(identity.user_id)},
        )
        if not factor_ids:
            raise APIError(403, "authenticator_required", "Verify an authenticator first.")
        await connection.execute(
            text("SELECT pg_advisory_xact_lock(hashtextextended(CAST(:uid AS text),92831))"),
            {"uid": str(identity.user_id)},
        )
        exists = await connection.scalar(
            text(
                "SELECT EXISTS(SELECT 1 FROM asgard_private.recovery_codes "
                "WHERE user_id=CAST(:uid AS uuid) AND factor_ids="
                "asgard_private.recovery_factor_ids(CAST(:uid AS uuid)))"
            ),
            {"uid": str(identity.user_id)},
        )
        if exists and not body.replace:
            raise APIError(
                409, "recovery_codes_exist", "Replace your existing backup codes instead."
            )
        return await save_codes(connection, identity, factor_ids)


@router.post("/remove", response_model=dict[str, bool])
async def remove(request: Request, identity: Account):
    enabled(request)
    recent_mfa(bearer_token(request), identity)
    async with transaction(request, identity) as connection:
        await connection.execute(
            text("DELETE FROM asgard_private.recovery_codes WHERE user_id=CAST(:uid AS uuid)"),
            {"uid": str(identity.user_id)},
        )
    return {"removed": True}


@router.post("/begin", response_model=RecoveryCapability)
async def begin(request: Request, body: BeginRecovery, identity: Account):
    enabled(request)
    await attempt(request, identity, "begin")
    provider = Provider(request, identity)
    try:
        user = await provider.user()
        await provider.password(user, body.password.get_secret_value())
        async with recovery_transaction(request, identity, live=True) as connection:
            params = {
                "uid": str(identity.user_id),
                "digest": digest(identity.user_id, canonical_code(body.code.get_secret_value())),
            }
            record = await one(
                connection,
                "SELECT * FROM asgard_private.recovery_codes WHERE user_id=CAST(:uid AS uuid) "
                "AND digest=:digest AND used_at IS NULL FOR UPDATE",
                params,
            )
            prior = await one(
                connection,
                "SELECT set_id FROM asgard_private.recovery_pending "
                "WHERE user_id=CAST(:uid AS uuid)",
                params,
            )
            current = set(
                await connection.scalar(
                    text("SELECT asgard_private.recovery_factor_ids(CAST(:uid AS uuid))"), params
                )
            )
            valid = record and (
                (prior and prior["set_id"] == record["set_id"])
                or (not prior and current and set(record["factor_ids"]) == current)
            )
            if not valid:
                raise APIError(
                    403, "recovery_failed", "Password or backup code verification failed."
                )
            token = secrets.token_urlsafe(32)
            params |= {"token": digest(identity.user_id, token), "batch": str(record["set_id"])}
            await connection.execute(
                text(
                    "UPDATE asgard_private.recovery_codes SET used_at=statement_timestamp() "
                    "WHERE user_id=CAST(:uid AS uuid) AND digest=:digest"
                ),
                params,
            )
            await connection.execute(
                text(
                    "INSERT INTO asgard_private.recovery_pending"
                    "(user_id,token_digest,set_id,expires_at) "
                    "VALUES(CAST(:uid AS uuid),:token,CAST(:batch AS uuid),"
                    "statement_timestamp()+interval '10 minutes') ON CONFLICT(user_id) DO UPDATE "
                    "SET token_digest=excluded.token_digest,expires_at=excluded.expires_at"
                ),
                params,
            )
        return {"token": token}
    finally:
        await provider.close()


@router.post("/prepare", response_model=ReplacementSetup)
async def prepare(request: Request, body: ContinueRecovery, identity: Account):
    enabled(request)
    capability = body.token.get_secret_value()
    await attempt(request, identity, "prepare", token=capability)
    provider = Provider(request, identity)
    try:
        user = await provider.user(admin=True)
        await provider.password(user, body.password.get_secret_value())
        await provider.close()
        async with recovery_transaction(request, identity) as connection:
            await pending(connection, identity, capability)
            await provider.remove_factors()
            await provider.password(user, body.password.get_secret_value())
            result = await provider.call(
                "POST",
                "/factors",
                token=provider.temporary,
                data={"factor_type": "totp", "friendly_name": "Asgard"},
            )
            fid = str(UUID(result["id"]))
            await connection.execute(
                text(
                    "UPDATE asgard_private.recovery_pending SET factor_id=CAST(:fid AS uuid) "
                    "WHERE user_id=CAST(:uid AS uuid)"
                ),
                {"uid": str(identity.user_id), "fid": fid},
            )
            return {"secret": result["totp"]["secret"], "qr": result["totp"]["qr_code"]}
    finally:
        await provider.close()


@router.post("/finish", response_model=RecoveredSession)
async def finish(request: Request, body: FinishRecovery, identity: Account):
    enabled(request)
    capability = body.token.get_secret_value()
    await attempt(request, identity, "finish", token=capability)
    provider = Provider(request, identity)
    try:
        user = await provider.user(admin=True)
        await provider.password(user, body.password.get_secret_value())
        await provider.close()
        async with recovery_transaction(request, identity) as connection:
            recovery = await pending(connection, identity, capability)
            if not recovery["factor_id"]:
                raise APIError(
                    409, "replacement_required", "Set up your replacement authenticator."
                )
            fid = str(recovery["factor_id"])
            # Deleting a verified factor revokes every provider session. Authenticate afterward.
            await provider.remove_factors(keep=fid)
            await provider.password(user, body.password.get_secret_value())
            challenge = await provider.call(
                "POST", f"/factors/{fid}/challenge", token=provider.temporary, data={}
            )
            session = await provider.call(
                "POST",
                f"/factors/{fid}/verify",
                token=provider.temporary,
                data={"challenge_id": challenge["id"], "code": body.code.get_secret_value()},
            )
            provider.temporary = session["access_token"]
            fresh = await request.app.state.token_verifier.verify(provider.temporary)
            if fresh.user_id != identity.user_id or fresh.aal != "aal2":
                raise APIError(403, "recovery_failed", "Replacement verification failed.")
            confirmed = await provider.user(admin=True)
            verified = [f for f in confirmed.get("factors", []) if f.get("status") == "verified"]
            if len(verified) != 1 or verified[0]["id"] != fid:
                raise APIError(409, "factor_changed", "Authenticator setup changed. Restart setup.")
            await provider.call("POST", "/logout?scope=others", token=provider.temporary)
            codes = await save_codes(connection, identity, [fid])
            await connection.execute(
                text(
                    "DELETE FROM asgard_private.recovery_pending WHERE user_id=CAST(:uid AS uuid)"
                ),
                {"uid": str(identity.user_id)},
            )
        result = codes | {
            "access_token": session["access_token"],
            "refresh_token": session["refresh_token"],
        }
        provider.temporary = None
        return result
    finally:
        await provider.close()
