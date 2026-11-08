"""Focused real-role acceptance; requires an explicitly disposable database."""

import asyncio
import os
from uuid import UUID

import pytest
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.ext.asyncio import create_async_engine

from app.api.contracts import VersionedChange
from app.core.errors import APIError
from app.modules.careers.comparison import SaveCareer, mutate, shortlist


def test_shortlist_persistence_isolation_and_stale_writes():
    database = os.getenv("ASGARD_SHORTLIST_TEST_DB", "")
    if not database.startswith("shortlist_check_"):
        pytest.skip("Set an explicitly isolated shortlist_check_ database")
    url = make_url(os.environ["ASGARD_DATABASE_URL"]).set(database=database)
    owner = UUID("00000000-0000-4000-8000-000000000001")
    other = UUID("00000000-0000-4000-8000-000000000002")
    career = UUID("00000000-0000-4000-8000-000000000003")

    async def check():
        engine = create_async_engine(url)

        async def context(connection, uid):
            await connection.execute(
                text("SELECT set_config('asgard.user_id',:uid,true)"), {"uid": str(uid)}
            )
            assert (await connection.execute(text("SELECT current_user"))).scalar() == "asgard_app"

        try:
            async with engine.begin() as connection:
                await context(connection, owner)
                saved = await mutate(
                    connection, owner, career, SaveCareer(expected_version=0, note="Consider work")
                )
                assert saved["version"] == 1
                assert saved["items"][0]["note"] == "Consider work"
            async with engine.begin() as connection:
                await context(connection, other)
                assert (await shortlist(connection, other))["items"] == []
                assert (
                    await connection.execute(
                        text("SELECT count(*) FROM asgard_private.career_shortlist")
                    )
                ).scalar() == 0
                with pytest.raises(APIError) as error:
                    await mutate(
                        connection, other, career, VersionedChange(expected_version=0), True
                    )
                assert error.value.status == 404
            async with engine.begin() as connection:
                await context(connection, owner)
                assert (await shortlist(connection, owner))["items"][0]["note"] == "Consider work"
                with pytest.raises(APIError) as error:
                    await mutate(
                        connection, owner, career, SaveCareer(expected_version=0, note="Old")
                    )
                assert error.value.status == 409
                assert (await shortlist(connection, owner))["version"] == 1
                updated = await mutate(
                    connection, owner, career, SaveCareer(expected_version=1, note="Updated")
                )
                assert updated["version"] == 2
                assert updated["items"][0]["note"] == "Updated"
                removed = await mutate(
                    connection, owner, career, VersionedChange(expected_version=2), True
                )
                assert removed["items"] == [] and removed["version"] == 3
            async with engine.begin() as connection:
                await context(connection, owner)
                assert (await shortlist(connection, owner)) == {
                    "available": True,
                    "version": 3,
                    "items": [],
                }
        finally:
            await engine.dispose()

    asyncio.run(check())
