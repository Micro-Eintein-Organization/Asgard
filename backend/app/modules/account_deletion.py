"""Verified self-service acceptance; external purges belong to the maintenance worker."""

from datetime import datetime
from typing import Annotated, Literal
from uuid import UUID, uuid4

import httpx
from fastapi import APIRouter, Depends, Request
from pydantic import Field, SecretStr
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from app.api.contracts import Contract
from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.storage import one

router = APIRouter(
    prefix="/me/account-deletion",
    tags=["account"],
    responses={status: {"model": ErrorBody} for status in (401, 403, 409, 429, 503)},
)


class DeleteAccount(Contract):
    confirmation: Literal["DELETE"]
    password: Annotated[SecretStr, Field(min_length=1, max_length=1024)]
    mfa_code: Annotated[SecretStr, Field(min_length=1, max_length=100)] | None = None
    recovery: bool = False
    idempotency_key: UUID


class DeletionReceipt(Contract):
    request_id: UUID
    accepted_at: datetime
    deadline_at: datetime
    status: Literal["accepted"] = "accepted"


async def verify_fresh(request, identity, body):
    settings = request.app.state.settings
    root = settings.supabase_url.rstrip("/") + "/auth/v1"
    http = request.app.state.http
    public = {"apikey": settings.supabase_anon_key.get_secret_value()}
    temporary = None

    async def call(method, path, *, token=None, data=None):
        response = await http.request(
            method,
            root + path,
            timeout=10,
            headers=public | ({"Authorization": "Bearer " + token} if token else {}),
            json=data,
        )
        if response.status_code == 429:
            raise APIError(
                429,
                "reauth_throttled",
                "Too many verification attempts. Try later.",
                retry_after=900,
            )
        if not response.is_success:
            raise APIError(403, "reauth_failed", "Password or second-factor verification failed.")
        return response.json()

    try:
        current = await call(
            "GET", "/user", token=request.headers.get("authorization", "").removeprefix("Bearer ")
        )
        if current.get("id") != str(identity.user_id) or not current.get("email"):
            raise APIError(403, "reauth_failed", "Sign in again before deleting your account.")
        verified = await call(
            "POST",
            "/token?grant_type=password",
            data={"email": current["email"], "password": body.password.get_secret_value()},
        )
        temporary = verified["access_token"]
        fresh = await request.app.state.token_verifier.verify(temporary)
        if fresh.user_id != identity.user_id:
            raise APIError(403, "reauth_failed", "Account verification failed.")
        factors = [f for f in current.get("factors", []) if f.get("status") == "verified"]
        if factors:
            if body.mfa_code is None:
                raise APIError(
                    403, "second_factor_required", "Enter your authenticator or recovery code."
                )
            if body.recovery:
                verified = await call(
                    "POST",
                    "/factors/recovery-codes/verify",
                    token=temporary,
                    data={"code": body.mfa_code.get_secret_value()},
                )
            else:
                factor = next((f for f in factors if f.get("factor_type") == "totp"), None)
                if not factor:
                    raise APIError(403, "second_factor_required", "Use an available recovery code.")
                fid = str(UUID(factor["id"]))
                challenge = await call(
                    "POST", f"/factors/{fid}/challenge", token=temporary, data={}
                )
                verified = await call(
                    "POST",
                    f"/factors/{fid}/verify",
                    token=temporary,
                    data={
                        "challenge_id": challenge["id"],
                        "code": body.mfa_code.get_secret_value(),
                    },
                )
            temporary = verified["access_token"]
            fresh = await request.app.state.token_verifier.verify(temporary)
            if fresh.user_id != identity.user_id or fresh.aal != "aal2":
                raise APIError(403, "reauth_failed", "Second-factor verification failed.")
    except (httpx.HTTPError, KeyError, ValueError, TypeError) as error:
        raise APIError(
            503, "reauth_unavailable", "Verification is unavailable. Your account was not deleted."
        ) from error
    finally:
        if temporary:
            try:
                await http.post(
                    root + "/logout?scope=local",
                    headers=public | {"Authorization": "Bearer " + temporary},
                    timeout=5,
                )
            except httpx.HTTPError:
                pass


async def existing(repo, identity, key):
    # The signed subject and idempotency key reveal only this request's receipt.
    async with repo.engine.begin() as connection:
        safe = await connection.scalar(
            text(
                "SELECT current_user='asgard_app' AND NOT rolsuper "
                "AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb FROM "
                "pg_roles WHERE rolname=current_user"
            )
        )
        if not safe:
            raise APIError(
                503, "unsafe_database_role", "Application access is not configured safely."
            )
        await connection.execute(
            text("SELECT set_config('asgard.user_id',:uid,true)"), {"uid": str(identity.user_id)}
        )
        return await one(
            connection,
            "SELECT request_id,accepted_at,deadline_at FROM asgard_private.account_deletions "
            "WHERE user_id=CAST(:uid AS uuid) AND request_id=CAST(:key AS uuid)",
            {"uid": str(identity.user_id), "key": str(key)},
        )


async def worker_ready(connection):
    return bool(
        await connection.scalar(
            text(
                "SELECT COALESCE((SELECT failed=0 AND "
                "finished_at>statement_timestamp()-interval '3 hours' "
                "FROM asgard_private.deletion_maintenance_runs ORDER BY finished_at DESC "
                "LIMIT 1),false)"
            )
        )
    )


@router.get("", response_model=dict[str, bool])
async def available(request: Request, identity: Annotated[Identity, Depends(current_identity)]):
    if request.app.state.profiles is None:
        return {"enabled": False, "mfa_required": False}
    async with request.app.state.profiles.transaction(identity) as connection:
        return {
            "enabled": request.app.state.settings.account_deletion_enabled
            and await worker_ready(connection),
            "mfa_required": identity.aal == "aal2",
        }


@router.post("", response_model=DeletionReceipt, status_code=202)
async def accept(
    request: Request, body: DeleteAccount, identity: Annotated[Identity, Depends(current_identity)]
):
    try:
        return await accept_verified(request, body, identity)
    except APIError as error:
        if error.status != 401:
            raise
        # A concurrent acceptance can block this session between transactions.
        repo = request.app.state.profiles
        receipt = await existing(repo, identity, body.idempotency_key) if repo else None
        if receipt:
            return receipt
        raise
    except SQLAlchemyError as error:
        raise APIError(
            503,
            "deletion_unconfirmed",
            "Deletion could not be confirmed. Try signing in again before retrying.",
        ) from error


async def accept_verified(request, body, identity):
    if not request.app.state.settings.account_deletion_enabled:
        raise APIError(503, "deletion_unavailable", "Account deletion is not enabled yet.")
    repo = request.app.state.profiles
    if repo is None:
        raise APIError(503, "deletion_unavailable", "Account storage is unavailable.")
    receipt = await existing(repo, identity, body.idempotency_key)
    if receipt:
        return receipt
    async with repo.transaction(identity, deletion=True) as connection:
        if not await worker_ready(connection):
            raise APIError(
                503,
                "deletion_unavailable",
                "Deletion maintenance is unavailable. Your account is unchanged.",
            )
        attempts = await connection.scalar(
            text(
                "SELECT count(*) FROM asgard_private.account_deletion_attempts "
                "WHERE user_id=CAST(:uid AS uuid) AND "
                "created_at>statement_timestamp()-interval '15 minutes'"
            ),
            {"uid": str(identity.user_id)},
        )
        if attempts >= 5:
            raise APIError(
                429,
                "reauth_throttled",
                "Too many attempts. Try again in 15 minutes.",
                retry_after=900,
            )
        await connection.execute(
            text(
                "INSERT INTO asgard_private.account_deletion_attempts(user_id,id) "
                "VALUES(CAST(:uid AS uuid),CAST(:id AS uuid))"
            ),
            {"uid": str(identity.user_id), "id": str(uuid4())},
        )
    await verify_fresh(request, identity, body)
    async with repo.transaction(identity, deletion=True) as connection:
        return await one(
            connection,
            "INSERT INTO asgard_private.account_deletions(user_id,request_id) "
            "VALUES(CAST(:uid AS uuid),CAST(:key AS uuid)) RETURNING "
            "request_id,accepted_at,deadline_at",
            {"uid": str(identity.user_id), "key": str(body.idempotency_key)},
        )
