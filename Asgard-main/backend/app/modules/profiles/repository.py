from contextlib import asynccontextmanager

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.errors import APIError
from app.core.security import Identity, unauthorized
from app.modules.profiles.schemas import Profile, ProfileUpdate

FIELDS = "first_name, surname, version, created_at, updated_at"


class ProfileRepository:
    def __init__(self, engine: AsyncEngine):
        self.engine = engine

    @classmethod
    def connect(cls, url: str):
        return cls(
            create_async_engine(
                url,
                pool_size=3,
                max_overflow=0,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args={
                    "connect_timeout": 5,
                    "options": "-c statement_timeout=5000 -c lock_timeout=2000",
                },
                hide_parameters=True,
            )
        )

    @asynccontextmanager
    async def transaction(self, identity: Identity):
        async with self.engine.begin() as connection:
            role = (
                (
                    await connection.execute(
                        text(
                            "SELECT current_user AS name, rolsuper, rolbypassrls, "
                            "rolcreaterole, rolcreatedb "
                            "FROM pg_roles WHERE rolname = current_user"
                        )
                    )
                )
                .mappings()
                .one()
            )
            if role["name"] != "asgard_app" or any(
                role[name] for name in ("rolsuper", "rolbypassrls", "rolcreaterole", "rolcreatedb")
            ):
                raise APIError(
                    503,
                    "unsafe_database_role",
                    "Application database access is not configured safely.",
                )
            params = {
                "uid": str(identity.user_id),
                "sid": str(identity.session_id),
                "aal": identity.aal,
            }
            allowed = await connection.scalar(
                text(
                    "SELECT asgard_private.session_allowed("
                    "CAST(:uid AS uuid), CAST(:sid AS uuid), :aal)"
                ),
                params,
            )
            if not allowed:
                raise unauthorized()
            await connection.execute(
                text("SELECT set_config('asgard.user_id', :uid, true)"), params
            )
            yield connection

    async def get(self, identity: Identity) -> Profile | None:
        async with self.transaction(identity) as connection:
            row = (
                (
                    await connection.execute(
                        text(
                            f"SELECT {FIELDS} FROM asgard_private.profiles "
                            "WHERE user_id = CAST(:uid AS uuid)"
                        ),
                        {"uid": str(identity.user_id)},
                    )
                )
                .mappings()
                .one_or_none()
            )
            return Profile.model_validate(row) if row else None

    async def update(self, identity: Identity, update: ProfileUpdate) -> Profile:
        params = update.model_dump() | {"uid": str(identity.user_id)}
        async with self.transaction(identity) as connection:
            if update.expected_version == 0:
                statement = (
                    "INSERT INTO asgard_private.profiles (user_id, first_name, surname) "
                    "VALUES (CAST(:uid AS uuid), :first_name, :surname) "
                    f"ON CONFLICT (user_id) DO NOTHING RETURNING {FIELDS}"
                )
            else:
                statement = (
                    "UPDATE asgard_private.profiles SET first_name = :first_name, "
                    "surname = :surname, "
                    "version = version + 1, updated_at = statement_timestamp() "
                    "WHERE user_id = CAST(:uid AS uuid) AND version = :expected_version "
                    f"RETURNING {FIELDS}"
                )
            row = (await connection.execute(text(statement), params)).mappings().one_or_none()
            if row is None:
                raise APIError(
                    409, "profile_conflict", "Your profile changed. Reload it before saving again."
                )
            return Profile.model_validate(row)
