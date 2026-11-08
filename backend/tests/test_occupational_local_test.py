import importlib
import sys
from pathlib import Path
from unittest.mock import patch

import pytest


@pytest.fixture
def overlay():
    scripts = Path(__file__).resolve().parents[1] / "scripts"
    with patch.object(sys, "path", [str(scripts), *sys.path]):
        module = importlib.import_module("prepare_occupational_local_test")
    return module, module.proposal()


def test_twelve_careers_without_activation(overlay):
    module, data = overlay
    assert module.verify(data)["careers"] == 12
    assert not data["runtime_activation"]


def test_unreviewed_record_injection_rejected(overlay):
    module, data = overlay
    data["eligible_record_proposals"][0]["record_id"] = "unsupported"
    with pytest.raises(ValueError, match="differs"):
        module.verify(data)


def test_partial_rating_transfer_rejected(overlay):
    module, data = overlay
    assert data["partial_topic_proposals"]
    data["partial_topic_proposals"][0]["transfers_proficiency"] = True
    with pytest.raises(ValueError, match="differs"):
        module.verify(data)


def test_source_hash_change_rejected(overlay):
    module, data = overlay
    data["input_sha256"]["agent-review.json"] = "changed"
    with pytest.raises(ValueError, match="differs"):
        module.verify(data)


def test_activation_or_approval_cannot_be_inferred(overlay):
    module, data = overlay
    data["runtime_activation"] = True
    with pytest.raises(ValueError, match="differs"):
        module.verify(data)
