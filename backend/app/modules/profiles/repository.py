from contextlib import asynccontextmanager
from time import perf_counter

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.database_metrics import current_metrics, instrument
from app.core.errors import APIError
from app.core.security import Identity, unauthorized
from app.modules.profiles.schemas import Profile, ProfileUpdate

FIELDS = "first_name, surname, version, created_at, updated_at, photo_id IS NOT NULL AS has_photo"


class ProfileRepository:
    def __init__(self, engine: AsyncEngine):
        self.engine = engine
        instrument(engine)

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
        started = perf_counter()
        async with self.engine.begin() as connection:
            metrics = current_metrics.get()
            if metrics is not None:
                metrics["database_acquisition_ms"] += (perf_counter() - started) * 1000
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

    async def update(
        self, identity: Identity, update: ProfileUpdate, *, change_photo=False, photo_id=None
    ) -> Profile:
        params = update.model_dump() | {
            "uid": str(identity.user_id), "change_photo": change_photo, "photo_id": photo_id,
        }
        async with self.transaction(identity) as connection:
            previous = None
            if change_photo:
                previous = await connection.scalar(text(
                    "SELECT photo_id FROM asgard_private.profiles "
                    "WHERE user_id=CAST(:uid AS uuid) FOR UPDATE"
                ), params)
                if photo_id is not None:
                    reserved = await connection.scalar(text(
                        "DELETE FROM asgard_private.profile_photo_cleanup "
                        "WHERE user_id=CAST(:uid AS uuid) AND photo_id=:photo_id "
                        "AND ready_at > clock_timestamp() RETURNING photo_id"
                    ), params)
                    if reserved is None:
                        raise APIError(
                            409, "photo_expired", "Choose the photo again before saving."
                        )
            if update.expected_version == 0:
                statement = (
                    "INSERT INTO asgard_private.profiles (user_id, first_name, surname, photo_id) "
                    "VALUES (CAST(:uid AS uuid), :first_name, :surname, :photo_id) "
                    f"ON CONFLICT (user_id) DO NOTHING RETURNING {FIELDS}"
                )
            else:
                statement = (
                    "UPDATE asgard_private.profiles SET first_name = :first_name, "
                    "surname = :surname, "
                    "photo_id = CASE WHEN :change_photo THEN CAST(:photo_id AS uuid) "
                    "ELSE photo_id END, "
                    "version = version + 1, updated_at = statement_timestamp() "
                    "WHERE user_id = CAST(:uid AS uuid) AND version = :expected_version "
                    f"RETURNING {FIELDS}"
                )
            row = (await connection.execute(text(statement), params)).mappings().one_or_none()
            if row is None:
                raise APIError(
                    409, "profile_conflict", "Your profile changed. Reload it before saving again."
                )
            if previous is not None:
                await connection.execute(text(
                    "INSERT INTO asgard_private.profile_photo_cleanup (user_id, photo_id) "
                    "VALUES (CAST(:uid AS uuid), :previous) ON CONFLICT DO NOTHING"
                ), params | {"previous": previous})
            return Profile.model_validate(row)
