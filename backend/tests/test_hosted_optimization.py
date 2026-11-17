import asyncio
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from types import SimpleNamespace
from uuid import uuid4

import pytest

from app.core.content_cache import ContentCache
from app.core.errors import APIError
from app.core.security import Identity
from app.modules.profiles.repository import ProfileRepository


@pytest.mark.parametrize("safe,allowed,code", [(False, False, "unsafe_database_role"),
                                              (True, False, "unauthorized"),
                                              (True, True, None)])
def test_combined_guard_fails_closed(safe, allowed, code):
    calls = []

    class Result:
        def mappings(self):
            return self

        def one_or_none(self):
            return {"safe": safe, "allowed": allowed}

    class Connection:
        info = {}

        async def execute(self, statement, params):
            calls.append(str(statement))
            return Result()

    connection = Connection()

    @asynccontextmanager
    async def begin():
        yield connection

    async def check():
        repository = object.__new__(ProfileRepository)
        repository.engine = SimpleNamespace(begin=begin)
        reached = False
        try:
            async with repository.transaction(Identity(uuid4(), uuid4(), "aal1")):
                reached = True
        except APIError as error:
            assert code is not None
            assert error.status in (401, 503)
        assert reached == (code is None)
        assert len(calls) == 2
        assert "pg_advisory_xact_lock_shared" in calls[0]
        assert "session_allowed" in calls[-1] and "set_config" in calls[-1]
    asyncio.run(check())


def test_cache_preserves_types_and_recovers_cancelled_leader():
    async def check():
        cache = ContentCache()
        started = asyncio.Event()
        value = {"id": uuid4(), "time": datetime.now(UTC)}

        async def blocked():
            started.set()
            await asyncio.Future()

        async def load():
            return value

        leader = asyncio.create_task(cache.get("key", blocked))
        await started.wait()
        follower = asyncio.create_task(cache.get("key", load))
        await asyncio.sleep(0)
        leader.cancel()
        with pytest.raises(asyncio.CancelledError):
            await leader
        assert await follower == value
        assert await cache.get("key", load) == value
    asyncio.run(check())


@pytest.mark.skipif(__import__("os").environ.get("ASGARD_RUN_DATABASE_REGRESSION") != "1",
                    reason="Requires provisioned local restricted-role database credentials")
def test_real_database_guard_rejects_unknown_session():
    from app.core.config import Settings

    async def check():
        repository = ProfileRepository.connect(Settings().database_url.get_secret_value())
        try:
            for _ in range(2):
                with pytest.raises(APIError) as caught:
                    async with repository.transaction(Identity(uuid4(), uuid4(), "aal1")):
                        pytest.fail("An unknown session reached feature SQL")
                assert caught.value.status == 401
        finally:
            await repository.engine.dispose()
    asyncio.run(check())
