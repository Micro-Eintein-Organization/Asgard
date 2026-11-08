"""Explicit isolated acceptance entrypoint; never used by normal application startup."""

import os

from pydantic import SecretStr

from app.core.config import get_settings
from app.main import create_app
from app.modules.recommendations import service
from app.modules.recommendations.selection import SelectionOutput

project = os.environ.get("ASGARD_PROJECT_ID", "")
if not project.startswith("asgard-stage3-test-core-"):
    raise RuntimeError("Mock provider entrypoint requires an isolated acceptance project")
settings = get_settings()
if f"supabase_db_{project}" not in settings.database_url.get_secret_value():
    raise RuntimeError("Mock provider database is outside the isolated project")


async def synthetic_generate(client, settings, payload, reserve_retry, remaining_seconds, **kwargs):
    candidate = next(
        (c for c in payload["candidates"] if c.get("source_reference_keys")),
        payload["candidates"][0],
    )
    return SelectionOutput.model_validate(
        {
            "items": [
                {
                    "candidate_key": candidate["key"],
                    "reason": (
                        "Synthetic acceptance suggestion using supplied experience and references."
                    ),
                    "evidence_keys": [payload["facts"][0]["key"]],
                    "source_reference_keys": candidate.get("source_reference_keys", [])[:1],
                    "caveat": "Synthetic provider fixture; no live model quality is established.",
                    "weak_connection": True,
                }
            ]
        }
    )


service.generate = synthetic_generate
app = create_app(
    settings.model_copy(
        update={
            "groq_enabled": True,
            "groq_api_key": SecretStr("synthetic-acceptance-only"),
        }
    )
)
