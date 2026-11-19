"""Render the preserved 2026-11-08 reference releases; never connect to a database."""

import argparse
import gzip
import hashlib
import json
import re
from collections import Counter
from pathlib import Path

from render_esco_release import render_catalog

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "supabase/content/reference-data/20261108"


def quote(value):
    tag = "$asgard_data$"
    while tag in value:
        tag = tag[:-1] + "_$"
    return tag + value + tag


def pack(value):
    """Losslessly replace repeated JSON string literals; PostgreSQL restores once."""
    if re.search(r"~A[0-9]+~", value):
        raise ValueError("Reference payload contains reserved encoding tokens")
    pattern = r'"(?:[^"\\]|\\.)*"'
    counts = Counter(re.findall(pattern, value))
    repeated = sorted(
        (key for key, n in counts.items() if n > 1 and (len(key) - 8) * (n - 1) > 64),
        key=lambda key: (-(len(key) - 8) * (counts[key] - 1), key),
    )
    dictionary = {f"~A{i}~": key for i, key in enumerate(repeated)}
    reverse = {v: k for k, v in dictionary.items()}
    encoded = re.sub(pattern, lambda match: reverse.get(match[0], match[0]), value)
    restored = "".join(dictionary.get(m[0], m[0])
                       for m in re.finditer(r"~A[0-9]+~|[^~]+|~", encoded))
    if restored != value:
        raise ValueError("Lossless reference encoding failed")
    return encoded, dictionary


def render(directory=ASSETS):
    manifest = json.loads((directory / "manifest.json").read_text())
    for name, expected in manifest["files"].items():
        if hashlib.sha256((directory / name).read_bytes()).hexdigest() != expected:
            raise ValueError(f"Reference asset hash mismatch: {name}")
    body = gzip.decompress((directory / "occupational.json.gz").read_bytes()).decode()
    if hashlib.sha256(body.encode()).hexdigest() != manifest["occupational_sha256"]:
        raise ValueError("Canonical occupational payload hash mismatch")
    esco = json.loads((directory / "esco.json").read_text())
    concepts = esco["concepts"]
    links = {tuple(key): locator for key, locator in esco["links"]}
    mappings = {tuple(item) for item in esco["mappings"]}
    esco_sql = render_catalog(manifest["esco_id"], esco["sha256"], concepts, links, mappings)
    esco_sql = esco_sql.strip().removeprefix("BEGIN;").removesuffix("COMMIT;")
    packed, dictionary = pack(body)
    payload_load = f"""DECLARE
 packed text := {quote(packed)};
 dictionary jsonb := {quote(json.dumps(dictionary, separators=(',', ':')))}::jsonb;
 body text;
BEGIN
 SELECT string_agg(coalesce(dictionary->>piece[1],piece[1]),'' ORDER BY ord)
 INTO body FROM regexp_matches(packed,'~A[0-9]+~|[^~]+|~','g')
 WITH ORDINALITY AS fragments(piece,ord);
 IF encode(sha256(convert_to(body,'UTF8')),'hex') <> '{manifest['occupational_sha256']}' THEN
  RAISE EXCEPTION 'Reference payload reconstruction failed hash verification';
 END IF;
 INSERT INTO asgard_catalog.occupational_releases(id,sha256,canonical_payload,payload)
 VALUES ('{manifest['occupational_id']}','{manifest['occupational_sha256']}',body,body::jsonb)
 ON CONFLICT(id) DO NOTHING;
 IF NOT EXISTS (SELECT 1 FROM asgard_catalog.occupational_releases
   WHERE id='{manifest['occupational_id']}' AND canonical_payload=body
   AND sha256='{manifest['occupational_sha256']}') THEN
  RAISE EXCEPTION 'Conflicting existing occupational release';
 END IF;
END"""
    return f"""-- Preserves the exact historical local reference IDs and canonical payload.
-- Prepared for owner review; hosted publication approval is required.
-- Imports reference data only. No user data, schema, role or Auth settings change.
BEGIN;
SELECT pg_advisory_xact_lock(411,2);
SELECT pg_advisory_xact_lock(411,3);
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM asgard_catalog.esco_active_release
   WHERE release_id<>'{manifest['esco_id']}')
 OR EXISTS (SELECT 1 FROM asgard_catalog.occupational_active_release
   WHERE release_id<>'{manifest['occupational_id']}') THEN
  RAISE EXCEPTION 'A different reference release is active; review before replacing it';
 END IF;
END $$;
{esco_sql}
DO $$ BEGIN
 IF (SELECT count(*) FROM asgard_catalog.esco_concepts
   WHERE release_id='{manifest['esco_id']}')<>{len(concepts)}
 OR (SELECT count(*) FROM asgard_catalog.esco_links
   WHERE release_id='{manifest['esco_id']}')<>{len(links)}
 OR (SELECT count(*) FROM asgard_catalog.esco_career_links
   WHERE release_id='{manifest['esco_id']}')<>{len(mappings)} THEN
  RAISE EXCEPTION 'ESCO import does not match the preserved reference manifest';
 END IF;
END $$;
DO {quote(payload_load)};
SELECT asgard_catalog.activate_esco_release('{manifest['esco_id']}');
SELECT asgard_catalog.activate_occupational_release('{manifest['occupational_id']}');
COMMIT;
"""


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    sql = render()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    with args.output.open("x", encoding="utf-8", newline="\n") as stream:
        stream.write(sql)
    print(f"Rendered {len(sql.encode())} bytes to {args.output}; no database accessed")
