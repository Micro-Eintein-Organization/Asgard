"""Read-only local application checks; output only non-sensitive readiness flags."""

import asyncio
import json
import os

from sqlalchemy import text
from sqlalchemy.engine import make_url

from app.core.config import Settings
from app.modules.profiles.repository import ProfileRepository


async def inspect():
    settings = Settings()
    report = {
        "auth_enabled": settings.auth_enabled,
        "database_ready": False,
        "content_ready": False,
        "groq_configured": settings.groq_enabled
        and bool(settings.groq_api_key.get_secret_value()),
    }
    if settings.deployment_environment != "local":
        return report
    url = settings.database_url.get_secret_value()
    if not url:
        return report
    repository = None
    try:
        target = make_url(url)
        if target.host != "supabase_db_" + os.environ.get("ASGARD_PROJECT_ID", "") or (
            target.username != "asgard_app"
        ):
            return report
        repository = ProfileRepository.connect(url)
        async with asyncio.timeout(10), repository.engine.connect() as connection:
            await connection.execute(text("SET TRANSACTION READ ONLY"))
            report["database_ready"] = bool(await connection.scalar(text(
                "SELECT current_user = 'asgard_app' AND rolcanlogin AND NOT rolsuper "
                "AND NOT rolbypassrls AND NOT rolcreaterole AND NOT rolcreatedb "
                "AND NOT rolinherit AND NOT rolreplication "
                "FROM pg_roles WHERE rolname=current_user"
            )))
            if not report["database_ready"]:
                return report
            await connection.execute(text("SELECT user_id FROM asgard_private.profiles LIMIT 0"))
            await connection.execute(text(
                "SELECT user_id FROM asgard_private.learning_state LIMIT 0"
            ))
            # These catalog reads also verify actual application-role grants.
            report["content_ready"] = bool(await connection.scalar(text(
                "SELECT EXISTS(SELECT 1 FROM asgard_catalog.releases WHERE version=4 "
                "AND id='7918d1fe-d121-5c74-8516-6cc10b9a988c'::uuid) "
                "AND EXISTS(SELECT 1 FROM asgard_catalog.careers c JOIN "
                "asgard_catalog.roadmaps r ON r.career_id=c.id JOIN "
                "asgard_catalog.milestones m ON m.roadmap_id=r.id JOIN "
                "asgard_catalog.topics t ON t.milestone_id=m.id "
                "WHERE c.status='published' AND r.status='published' "
                "AND m.retired_at IS NULL AND t.retired_at IS NULL)"
            )))
    except Exception:
        report["database_ready"] = False
    finally:
        if repository is not None:
            await repository.engine.dispose()
    return report


if __name__ == "__main__":
    print(json.dumps(asyncio.run(inspect())))
