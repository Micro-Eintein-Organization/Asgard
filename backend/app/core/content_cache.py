"""Bounded presentation-content cache; callers must retain live authorization."""
import asyncio
import json
from collections import OrderedDict
from copy import deepcopy
from functools import wraps
from time import monotonic
from weakref import WeakKeyDictionary

_caches = WeakKeyDictionary()
_LIMIT = 32 * 1024 * 1024


class ContentCache:
    def __init__(self):
        self.entries = OrderedDict()
        self.pending = {}
        self.size = 0

    async def get(self, key, load):
        now = monotonic()
        for expired in [k for k, v in self.entries.items() if v[0] <= now]:
            self.size -= self.entries.pop(expired)[1]
        if key in self.entries:
            self.entries.move_to_end(key)
            return deepcopy(self.entries[key][2])
        if key in self.pending:
            await asyncio.shield(self.pending[key])
            return await self.get(key, load)
        future = asyncio.get_running_loop().create_future()
        self.pending[key] = future
        try:
            value = await load()
            size = len(json.dumps(value, default=str).encode())
            if size <= _LIMIT:
                while self.entries and self.size + size > _LIMIT:
                    _, entry = self.entries.popitem(last=False)
                    self.size -= entry[1]
                self.entries[key] = (monotonic() + 30, size, deepcopy(value))
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
