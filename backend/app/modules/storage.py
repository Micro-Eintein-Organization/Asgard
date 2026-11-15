"""Reuse the established session-checked, restricted-role database boundary."""

from contextlib import asynccontextmanager

from fastapi import Request
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.core.errors import APIError


@asynccontextmanager
async def transaction(request: Request, identity):
    repository = request.app.state.profiles
    if repository is None:
        raise APIError(503, "database_not_configured", "Account storage is unavailable.")
    try:
        async with repository.transaction(identity) as connection:
            connection.info["asgard_content_cache"] = request.method == "GET"
            try:
                yield connection
            finally:
                connection.info.pop("asgard_content_cache", None)
    except IntegrityError as exc:
        raise APIError(
            409,
            "state_conflict",
            "The saved state changed or needs resolving. Reload before retrying.",
        ) from exc
    except SQLAlchemyError as exc:
        raise APIError(
            503,
            "database_unavailable",
            "Storage is temporarily unavailable. Your operation was not confirmed.",
        ) from exc


async def rows(connection, statement, parameters=None):
    return [
        dict(row)
        for row in (await connection.execute(text(statement), parameters or {})).mappings()
    ]


async def one(connection, statement, parameters=None):
    result = await rows(connection, statement, parameters)
    return result[0] if result else None


def required(value):
    if value is None:
        raise APIError(404, "not_found", "This item is unavailable.")
    return value


async def lock_account(connection, user_id):
    parameters = {"uid": str(user_id)}
    created = await one(
        connection,
        (
            "INSERT INTO asgard_private.learning_state (user_id) VALUES (CAST(:uid "
            "AS uuid)) ON CONFLICT (user_id) DO NOTHING RETURNING user_id"
        ),
        parameters,
    )
    state = required(
        await one(
            connection,
            (
                "SELECT * FROM asgard_private.learning_state WHERE user_id = CAST(:uid "
                "AS uuid) FOR UPDATE"
            ),
            parameters,
        )
    )
    state["_created"] = created is not None
    return state
