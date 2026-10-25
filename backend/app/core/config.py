from functools import lru_cache

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ASGARD_", extra="ignore")

    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    supabase_url: str = "http://supabase_kong_asgard-foundation:8000"
    supabase_anon_key: SecretStr = SecretStr("")
    readiness_timeout_seconds: float = Field(default=2.0, gt=0, le=10)
    auth_enabled: bool = False
    auth_issuer: str = "http://127.0.0.1:55321/auth/v1"
    database_url: SecretStr = SecretStr("")


@lru_cache
def get_settings() -> Settings:
    return Settings()
