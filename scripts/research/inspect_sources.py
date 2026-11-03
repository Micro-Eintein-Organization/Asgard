"""Cache source text for curation; originals are read-only and cache is ignored."""

import argparse
import hashlib
import json
from pathlib import Path

from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "docs/plans/post-mvp/evidence/2026-11-03/source-manifest.json"


def inspect(source_dir, cache):
    cache.mkdir(parents=True, exist_ok=True)
    sources = json.loads(MANIFEST.read_text(encoding="utf-8"))["sources"]
    for source in sources:
        path = source_dir / source["original_filename"]
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != source["sha256"]:
            raise ValueError(f"Source hash mismatch: {source['source_id']}")
        if path.suffix.lower() != ".pdf":
            continue
        dest = cache / (source["source_id"] + ".json")
        if dest.exists() and json.loads(dest.read_text(encoding="utf-8"))["sha256"] == digest:
            print(f"Cached {source['source_id']}", flush=True)
            continue
        reader = PdfReader(path)
        pages = [{"page": i + 1, "text": page.extract_text() or ""}
                 for i, page in enumerate(reader.pages)]
        dest.write_text(json.dumps({"sha256": digest, "pages": pages}, ensure_ascii=False), encoding="utf-8")
        print(f"Extracted {source['source_id']}: {len(pages)} pages", flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path, required=True)
    parser.add_argument("--cache-dir", type=Path, default=ROOT / ".cache/curation")
    args = parser.parse_args()
    inspect(args.source_dir, args.cache_dir)
