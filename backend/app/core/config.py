from functools import lru_cache
from typing import Literal
from urllib.parse import parse_qs, urlsplit

from pydantic import Field, SecretStr, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_prefix="ASGARD_", extra="ignore", hide_input_in_errors=True,
    )
    deployment_environment: Literal["local", "staging", "production"] = "local"

    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    supabase_url: str = "http://supabase_kong_asgard-foundation:8000"
    supabase_anon_key: SecretStr = SecretStr("")
    readiness_timeout_seconds: float = Field(default=2.0, gt=0, le=10)
    account_deletion_enabled: bool = False
    auth_enabled: bool = False
    auth_issuer: str = "http://127.0.0.1:55321/auth/v1"
    database_url: SecretStr = SecretStr("")
    ai_guidance_enabled: bool = False
    exa_api_key: SecretStr = SecretStr("")
    ai_search_domains: str = ""
    groq_enabled: bool = False
    groq_api_key: SecretStr = SecretStr("")
    groq_model: str = Field(default="openai/gpt-oss-120b", min_length=1, max_length=120)
    groq_max_completion_tokens: int = Field(default=4096, ge=1024, le=8192)
    documents_enabled: bool = False
    documents_processing_enabled: bool = False
    resume_skill_review_enabled: bool = False
    profile_photos_enabled: bool = False
    documents_real_data_approved: bool = False
    storage_service_key: SecretStr = SecretStr("")

    @model_validator(mode="after")
    def hosted_configuration(self):
        if self.deployment_environment == "local":
            return self

        endpoint = urlsplit(self.supabase_url)
        if endpoint.scheme != "https" or not endpoint.hostname or endpoint.hostname in (
            "localhost", "127.0.0.1", "::1",
        ) or endpoint.path not in ("", "/") or endpoint.username or endpoint.query:
            raise ValueError("Hosted Supabase requires its HTTPS project origin.")
        if not self.auth_enabled or not self.supabase_anon_key.get_secret_value():
            raise ValueError("Hosted account access requires explicit Auth configuration.")
        if self.auth_issuer != self.supabase_url.rstrip("/") + "/auth/v1":
            raise ValueError("Hosted Auth issuer must match the configured project.")
        if not self.cors_origins:
            raise ValueError("Configure explicit hosted frontend origins.")
        for origin in self.cors_origins:
            parsed = urlsplit(origin)
            if parsed.scheme != "https" or not parsed.hostname or "*" in origin or (
                parsed.path or parsed.query or parsed.fragment or parsed.username
            ) or parsed.hostname in ("localhost", "127.0.0.1", "::1"):
                raise ValueError("Hosted CORS requires exact HTTPS frontend origins.")
        database = urlsplit(self.database_url.get_secret_value())
        if database.scheme != "postgresql+psycopg" or not (
            database.username == "asgard_app"
            or (database.username or "").startswith("asgard_app.")
        ):
            raise ValueError("Hosted storage requires the restricted psycopg database role.")
        if not database.hostname or database.hostname.startswith("supabase_db_") or (
            parse_qs(database.query).get("sslmode") != ["verify-full"]
        ):
            raise ValueError("Hosted database requires a remote host and verified TLS.")
        if (self.profile_photos_enabled or self.documents_enabled) and not self.storage_service_key.get_secret_value():
            raise ValueError("Enabled private file features require the backend Storage credential.")
        if self.documents_processing_enabled and not (
            self.documents_enabled and self.documents_real_data_approved
            and self.groq_enabled and self.groq_api_key.get_secret_value()
        ):
            raise ValueError("PDF processing requires document storage, owner approval and Groq configuration.")
        if self.resume_skill_review_enabled and not self.documents_processing_enabled:
            raise ValueError("Resume skill review requires enabled PDF processing.")
        if self.ai_guidance_enabled and not (self.groq_enabled and self.groq_api_key.get_secret_value()):
            raise ValueError("AI guidance requires Groq configuration.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
