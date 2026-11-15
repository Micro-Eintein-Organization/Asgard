"""Run inside the backend container; prints timings, never connection credentials."""
import asyncio
from time import perf_counter

from sqlalchemy import text

from app.core.config import Settings
from app.modules.profiles.repository import ProfileRepository


async def main():
    repository = ProfileRepository.connect(Settings().database_url.get_secret_value())
    try:
        for sample in range(10):
            started = perf_counter()
            async with repository.engine.connect() as connection:
                acquired = perf_counter()
                await connection.execute(text("SELECT 1"))
                executed = perf_counter()
            print({"sample": sample, "acquisition_ms": round((acquired-started)*1000, 2),
                   "select_ms": round((executed-acquired)*1000, 2),
                   "total_ms": round((perf_counter()-started)*1000, 2)})
    finally:
        await repository.engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
