import json
import sys
from pathlib import Path

from app.main import create_app

schema = json.dumps(create_app().openapi(), indent=2, sort_keys=True) + "\n"
target = Path(__file__).resolve().parents[1] / "openapi.json"
if "--stdout" in sys.argv:
    sys.stdout.write(schema)
elif "--check" in sys.argv:
    if not target.exists() or target.read_text(encoding="utf-8") != schema:
        raise SystemExit("OpenAPI schema is stale; regenerate it before review.")
else:
    target.write_text(schema, encoding="utf-8")
