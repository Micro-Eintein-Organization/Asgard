import asyncio
from unittest.mock import AsyncMock

import pytest

from app.core import content_cache


def test_expiry_copy_safety_and_failed_load(monkeypatch):
    async def check():
        clock = [0]
        monkeypatch.setattr(content_cache, "monotonic", lambda: clock[0])
        cache = content_cache.ContentCache()
        load = AsyncMock(return_value={"revision": 1, "topics": []})
        first = await cache.get("roadmap", load)
        first["topics"].append("private mutation")
        assert (await cache.get("roadmap", load))["topics"] == []
        assert load.await_count == 1
        clock[0] = 31
        load.side_effect = ValueError("unavailable")
        with pytest.raises(ValueError):
            await cache.get("roadmap", load)
        assert not cache.entries and not cache.pending
    asyncio.run(check())


def test_coalescing_and_size_bound(monkeypatch):
    async def check():
        monkeypatch.setattr(content_cache, "_LIMIT", 100)
        cache = content_cache.ContentCache()
        async def load():
            await asyncio.sleep(0)
            return "published"
        counted = AsyncMock(side_effect=load)
        await asyncio.gather(cache.get("same", counted), cache.get("same", counted))
        assert counted.await_count == 1
        for key in range(30):
            await cache.get(key, counted)
        assert cache.size <= 100
    asyncio.run(check())
