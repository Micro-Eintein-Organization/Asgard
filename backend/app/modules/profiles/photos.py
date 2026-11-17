import asyncio
import base64
import binascii
import io

import httpx
from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy import text

from app.core.errors import APIError

MAX_BYTES = 2_000_000
BUCKET = "asgard-profile-photos"


def enabled(settings):
    return (
        settings.profile_photos_enabled
        and bool(settings.storage_service_key.get_secret_value())
    )


def normalize(encoded: str) -> bytes:
    try:
        raw = base64.b64decode(encoded, validate=True)
        if len(raw) > MAX_BYTES:
            raise APIError(413, "photo_too_large", "Choose a photo no larger than 2 MB.")
        with Image.open(io.BytesIO(raw), formats=["JPEG", "PNG", "WEBP"]) as original:
            if max(original.size) > 4096 or getattr(original, "n_frames", 1) != 1:
                raise ValueError("Unsupported dimensions or animation")
            image = ImageOps.exif_transpose(original)
            image.thumbnail((512, 512))
            rgba = image.convert("RGBA")
            clean = Image.new("RGB", rgba.size, "white")
            clean.paste(rgba, mask=rgba.getchannel("A"))
            output = io.BytesIO()
            clean.save(output, format="JPEG", quality=85)
            return output.getvalue()
    except (binascii.Error, UnidentifiedImageError, Image.DecompressionBombError,
            OSError, ValueError, SyntaxError) as exc:
        raise APIError(
            422, "invalid_photo",
            "Choose a still JPEG, PNG, or WebP up to 2 MB and 4096 pixels per side.",
        ) from exc


async def object_request(request, identity, photo_id, method, content=None):
    settings = request.app.state.settings
    key = settings.storage_service_key.get_secret_value()
    origin = settings.supabase_url.rstrip("/")
    url = f"{origin}/storage/v1/object/{BUCKET}/{identity.user_id}/{photo_id}.jpg"
    try:
        async with asyncio.timeout(15):
            response = await request.app.state.http.request(
                method, url, content=content, timeout=12,
                headers={"Authorization": f"Bearer {key}", "Content-Type": "image/jpeg"},
            )
    except (TimeoutError, httpx.HTTPError) as exc:
        raise APIError(
            503, "photo_storage_unavailable", "Photo storage is temporarily unavailable."
        ) from exc
    if response.is_success or (method == "DELETE" and response.status_code == 404):
        return response.content
    raise APIError(503, "photo_storage_unavailable", "Photo storage is temporarily unavailable.")


async def active_id(repo, identity):
    async with repo.transaction(identity) as connection:
        return await connection.scalar(text(
            "SELECT photo_id FROM asgard_private.profiles WHERE user_id=:uid"
        ), {"uid": identity.user_id})


async def reserve(repo, identity, photo_id):
    async with repo.transaction(identity) as connection:
        await connection.execute(text(
            "INSERT INTO asgard_private.profile_photo_cleanup (user_id, photo_id, ready_at) "
            "VALUES (:uid, :photo_id, clock_timestamp() + interval '10 minutes')"
        ), {"uid": identity.user_id, "photo_id": photo_id})


async def cleanup(request, repo, identity):
    async with repo.transaction(identity) as connection:
        ids = (await connection.scalars(text(
            "SELECT photo_id FROM asgard_private.profile_photo_cleanup "
            "WHERE user_id=:uid AND ready_at <= clock_timestamp() ORDER BY ready_at LIMIT 4"
        ), {"uid": identity.user_id})).all()
    for photo_id in ids:
        try:
            await object_request(request, identity, photo_id, "DELETE")
        except APIError:
            continue
        async with repo.transaction(identity) as connection:
            await connection.execute(text(
                "DELETE FROM asgard_private.profile_photo_cleanup "
                "WHERE user_id=:uid AND photo_id=:photo_id"
            ), {"uid": identity.user_id, "photo_id": photo_id})
