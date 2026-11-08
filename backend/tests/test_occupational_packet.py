import copy
import importlib
import sys
from pathlib import Path
from unittest.mock import patch

import pytest


@pytest.fixture
def packet():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        return importlib.import_module("prepare_occupational_release")


def test_frozen_packet_is_inactive_and_resolves_current_ids(packet):
    result = packet.check()
    assert result["reference_integrity"] == "passed"
    assert result["activation_eligible"] is False


def test_broken_source_reference_is_rejected(packet):
    tables = copy.deepcopy(packet.read_tables(packet.DESTINATION))
    tables["expectations"][0]["source_id"] = "missing"
    with pytest.raises(ValueError, match="Unresolved"):
        packet.audit(tables)


def test_changed_application_identity_is_rejected(packet):
    tables = copy.deepcopy(packet.read_tables(packet.DESTINATION))
    tables["careers"][0]["career_id"] = "wrong"
    with pytest.raises(ValueError, match="current application careers"):
        packet.audit(tables)


def test_wrong_career_topic_is_rejected(packet):
    tables = copy.deepcopy(packet.read_tables(packet.DESTINATION))
    tables["learning_associations"][0]["topic_id"] = "wrong"
    with pytest.raises(ValueError, match="unsupported current topic"):
        packet.audit(tables)


def test_artifact_tampering_is_rejected(packet, tmp_path):
    import json
    import shutil

    manifest = packet.DESTINATION / "manifest.json"
    shutil.copyfile(manifest, tmp_path / manifest.name)
    data = json.loads(manifest.read_text(encoding="utf-8"))
    filename = next(iter(data["files"]))
    (tmp_path / filename).write_text("tampered", encoding="utf-8")
    with (
        patch.object(packet, "DESTINATION", tmp_path),
        pytest.raises(ValueError, match="frozen manifest"),
    ):
        packet.check()


def test_original_hash_verification_does_not_require_fixed_local_path(packet, tmp_path):
    import hashlib

    raw = b"synthetic source bytes"
    (tmp_path / "example.zip").write_bytes(raw)
    source = {
        "source_id": "example",
        "filename": "example.zip",
        "sha256": hashlib.sha256(raw).hexdigest(),
        "bytes": str(len(raw)),
    }
    verified = packet.inspect_originals(tmp_path, [source])
    assert verified[0]["original_hash_verified"] is True
    assert str(tmp_path) not in str(verified)
    (tmp_path / "example.zip").write_bytes(b"changed")
    with pytest.raises(ValueError, match="differs from source registry"):
        packet.inspect_originals(tmp_path, [source])


def test_missing_original_is_not_treated_as_verified(packet, tmp_path):
    with pytest.raises(ValueError, match="Missing original"):
        packet.inspect_originals(tmp_path, [{"filename": "missing.zip"}])
