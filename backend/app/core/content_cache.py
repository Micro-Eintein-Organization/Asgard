"""Bounded presentation-content cache; callers must retain live authorization."""
import asyncio
import json
from collections import OrderedDict
from datetime import date, datetime
from functools import wraps
from time import monotonic
from uuid import UUID
from weakref import WeakKeyDictionary

from app.core.database_metrics import current_metrics

_caches = WeakKeyDictionary()
_LIMIT = 32 * 1024 * 1024


def encode(value):
    if isinstance(value, (UUID, datetime, date)):
        return {"__asgard_type__": type(value).__name__, "value": str(value)}
    raise TypeError(f"Unsupported published content type: {type(value).__name__}")


def decode(value):
    if set(value) == {"__asgard_type__", "value"}:
        constructors = {"UUID": UUID, "datetime": datetime.fromisoformat, "date": date.fromisoformat}
        constructor = constructors.get(value["__asgard_type__"])
        if constructor:
            return constructor(value["value"])
    return value


def metric(name, amount=1):
    metrics = current_metrics.get()
    if metrics is not None:
        metrics[name] = metrics.get(name, 0) + amount


class ContentCache:
    def __init__(self):
        self.entries = OrderedDict()
        self.pending = {}
        self.size = 0

    async def get(self, key, load, *, waited=False):
        now = monotonic()
        for expired in [k for k, v in self.entries.items() if v[0] <= now]:
            self.size -= self.entries.pop(expired)[1]
        if key in self.entries:
            self.entries.move_to_end(key)
            metric("content_cache_hits")
            return json.loads(self.entries[key][2], object_hook=decode)
        if key in self.pending and not waited:
            metric("content_cache_waits")
            await asyncio.shield(self.pending[key])
            return await self.get(key, load, waited=True)
        if key in self.pending:
            # A replacement leader is already loading; bound recovery to this caller's load.
            return await load()
        metric("content_cache_misses")
        future = asyncio.get_running_loop().create_future()
        self.pending[key] = future
        try:
            value = await load()
            payload = json.dumps(value, default=encode).encode("utf-8")
            size = len(payload)
            metric("content_cache_loaded_bytes", size)
            if size <= _LIMIT:
                while self.entries and self.size + size > _LIMIT:
                    _, entry = self.entries.popitem(last=False)
                    self.size -= entry[1]
                    metric("content_cache_evictions")
                self.entries[key] = (monotonic() + 30, size, payload)
                self.size += size
            return value
        finally:
            self.pending.pop(key, None)
            future.set_result(None)


def published_content(function):
    @wraps(function)
    async def cached(connection, *args, **kwargs):
        if not connection.info.get("asgard_content_cache", False):
            return await function(connection, *args, **kwargs)
        cache = _caches.setdefault(connection.engine, ContentCache())
        key = (function.__module__, function.__name__, tuple(map(str, args)),
               tuple(sorted((k, str(v)) for k, v in kwargs.items())))
        return await cache.get(key, lambda: function(connection, *args, **kwargs))
    return cached
