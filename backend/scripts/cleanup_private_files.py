"""Clean due private objects for the authenticated account; never enumerate accounts."""
import asyncio
import os
from types import SimpleNamespace

import httpx

from app.core.config import Settings
from app.core.security import TokenVerifier
from app.modules.documents import service as documents
from app.modules.profiles import photos
from app.modules.profiles.repository import ProfileRepository


async def main():
    token = os.environ.get("ASGARD_MAINTENANCE_ACCESS_TOKEN")
    if not token:
        raise SystemExit("Set ASGARD_MAINTENANCE_ACCESS_TOKEN privately for the target account.")
    settings = Settings()
    repository = ProfileRepository.connect(settings.database_url.get_secret_value())
    try:
        async with httpx.AsyncClient(follow_redirects=False) as http:
            identity = await TokenVerifier(settings, http).verify(token)
            request = SimpleNamespace(method="POST", app=SimpleNamespace(state=SimpleNamespace(
                settings=settings, profiles=repository, http=http)))
            if documents.configured(settings):
                await documents.cleanup(request, identity)
            if photos.enabled(settings):
                await photos.cleanup(request, repository, identity)
            print("Cleanup pass completed for the authenticated account; failed objects remain queued.")
    finally:
        await repository.engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
