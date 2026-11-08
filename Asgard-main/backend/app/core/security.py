import asyncio
from dataclasses import dataclass
from time import monotonic
from typing import Annotated
from uuid import UUID

import httpx
import jwt
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import Settings
from app.core.errors import APIError

bearer = HTTPBearer(auto_error=False)


def unauthorized() -> APIError:
    return APIError(401, "invalid_session", "Sign in again to continue.")


@dataclass(frozen=True)
class Identity:
    user_id: UUID
    session_id: UUID
    aal: str


class TokenVerifier:
    def __init__(self, settings: Settings, client: httpx.AsyncClient):
        self.settings = settings
        self.client = client
        self.keys: dict = {}
        self.fetched_at = float("-inf")
        self.lock = asyncio.Lock()

    async def verify(self, token: str) -> Identity:
        try:
            if len(token) > 16384:
                raise unauthorized()
            header = jwt.get_unverified_header(token)
            if header.get("alg") != "ES256" or not isinstance(header.get("kid"), str):
                raise unauthorized()
            async with self.lock:
                age = monotonic() - self.fetched_at
                if age >= 300 or (header["kid"] not in self.keys and age >= 30):
                    try:
                        response = await self.client.get(
                            self.settings.supabase_url.rstrip("/")
                            + "/auth/v1/.well-known/jwks.json",
                            timeout=5,
                        )
                        response.raise_for_status()
                        if len(response.content) > 65536:
                            raise ValueError("Oversized key set")
                        keys = response.json()["keys"]
                        if (
                            not isinstance(keys, list) or len(keys) > 20
                            or not all(isinstance(key, dict) for key in keys)
                        ):
                            raise ValueError("Invalid key set")
                        self.keys = {
                            key["kid"]: jwt.PyJWK.from_dict(key, algorithm="ES256").key
                            for key in keys
                            if key.get("kty") == "EC"
                            and key.get("crv") == "P-256"
                            and key.get("alg") == "ES256"
                            and key.get("use", "sig") == "sig"
                            and isinstance(key.get("kid"), str)
                        }
                        self.fetched_at = monotonic()
                    except (httpx.HTTPError, KeyError, ValueError, TypeError) as exc:
                        raise APIError(
                            503, "auth_unavailable", "Authentication is temporarily unavailable."
                        ) from exc
            key = self.keys.get(header["kid"])
            if key is None:
                raise unauthorized()
            claims = jwt.decode(
                token,
                key,
                algorithms=["ES256"],
                audience="authenticated",
                issuer=self.settings.auth_issuer,
                leeway=5,
                options={"require": ["exp", "iat", "iss", "aud", "sub", "session_id", "role"]},
            )
            if claims["role"] != "authenticated" or claims.get("aal") not in ("aal1", "aal2"):
                raise unauthorized()
            return Identity(UUID(claims["sub"]), UUID(claims["session_id"]), claims["aal"])
        except (jwt.PyJWTError, ValueError, TypeError, KeyError) as exc:
            raise unauthorized() from exc


async def current_identity(
    request: Request,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
) -> Identity:
    if not request.app.state.settings.auth_enabled:
        raise APIError(
            503, "auth_not_configured", "Account access is awaiting local setup approval."
        )
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise unauthorized()
    return await request.app.state.token_verifier.verify(credentials.credentials)
