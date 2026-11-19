"""Split a reviewed reference script for manual SQL Editor execution; never connect."""

import argparse
import base64
import hashlib
from pathlib import Path


def split(source: Path, destination: Path, chunk_size=600_000):
    original = source.read_text(encoding="utf-8")
    # The final DO block supplies the transaction for all original commands.
    start = original.index("\nBEGIN;") + len("\nBEGIN;")
    end = original.rfind("\nCOMMIT;")
    if end <= start or original[end:].strip() != "COMMIT;":
        raise ValueError("Expected the reviewed script's single outer transaction")
    data = original[start:end].encode("utf-8")
    digest = hashlib.sha256(data).hexdigest()
    tag = "asgard-reference-import:" + digest
    lookup = ("SELECT m.oid FROM pg_largeobject_metadata m WHERE "
              f"obj_description(m.oid,'pg_largeobject')='{tag}' "
              "AND m.lomowner=(SELECT oid FROM pg_roles WHERE rolname=current_user)")
    destination.mkdir(parents=True, exist_ok=False)
    files = []

    def write(name, text):
        (destination / name).write_text(text + "\n", encoding="utf-8")
        files.append(name)

    write("00-initialize.sql", f"""-- Temporary upload only; no application tables are changed.
DO $$ DECLARE target oid; BEGIN
 target:=({lookup});
 IF target IS NULL THEN
  target:=lo_create(0);
  EXECUTE format('COMMENT ON LARGE OBJECT %s IS %L',target,'{tag}');
 END IF;
 EXECUTE format('REVOKE ALL ON LARGE OBJECT %s '
   'FROM PUBLIC,anon,authenticated,asgard_app,asgard_maintenance',target);
END $$;""")
    for index, offset in enumerate(range(0, len(data), chunk_size), 1):
        encoded = base64.b64encode(data[offset:offset + chunk_size]).decode()
        write(f"{index:02d}-upload.sql", f"""-- Upload chunk {index}; owner-only temporary object.
DO $$ DECLARE target oid; BEGIN
 target:=({lookup});
 IF target IS NULL THEN
  RAISE EXCEPTION 'Run 00-initialize.sql as the same database role first';
 END IF;
 PERFORM lo_put(target,{offset},decode('{encoded}','base64'));
END $$;""")
    write("99-publish.sql", f"""-- Verify the upload and atomically apply the reviewed release.
DO $$ DECLARE target oid; body bytea; BEGIN
 target:=({lookup});
 IF target IS NULL THEN RAISE EXCEPTION 'Reference upload is missing'; END IF;
 body:=lo_get(target);
 IF encode(sha256(body),'hex')<>'{digest}' THEN
  RAISE EXCEPTION 'Reference upload is incomplete or changed; rerun the upload chunks';
 END IF;
 EXECUTE convert_from(body,'UTF8');
 PERFORM lo_unlink(target);
END $$;""")
    instructions = """# Manual reference import

Use the same Supabase project and database role (postgres) for every file.
Run each entire SQL file separately in the order below. Stop on an error.
The upload files store only the public reference SQL in an owner-only PostgreSQL
large object, not application tables. No new application schema or functions are
created. Only 99-publish.sql imports/activates reference data; it verifies the
complete upload hash, applies all original commands in one transaction, and
removes the temporary upload on success. Existing RLS is unchanged.

""" + "\n".join(f"{i}. {name}" for i, name in enumerate(files, 1))
    (destination / "README.md").write_text(instructions + "\n", encoding="utf-8")
    (destination / "cleanup-only-if-abandoning.sql").write_text(
        f"-- Deletes only this owner's temporary upload, not imported reference data.\n"
        f"SELECT lo_unlink(oid) FROM ({lookup}) owned;\n", encoding="utf-8",
    )
    return files, digest


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    files, digest = split(args.source, args.destination)
    print(f"Prepared {len(files)} ordered files; SHA-256 {digest}; no database accessed")
