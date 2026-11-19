import re
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
from render_reference_restore import pack, quote, render  # noqa: E402


def test_lossless_pack_preserves_source_text_and_escapes():
    body = '["same long source text","same long source text", "x\\\"y", "~z"]' * 30
    encoded, dictionary = pack(body)
    assert "".join(dictionary.get(m[0], m[0])
                   for m in re.finditer(r"~A[0-9]+~|[^~]+|~", encoded)) == body


def test_reserved_tokens_and_dollar_quoting_are_guarded():
    with pytest.raises(ValueError, match="reserved"):
        pack('"~A12~"')
    assert quote("$asgard_data$").startswith("$asgard_data_$")


def test_release_assets_are_required_and_not_silently_replaced(tmp_path):
    (tmp_path / "manifest.json").write_text('{"files":{"esco.json":"wrong"}}')
    (tmp_path / "esco.json").write_text('{}')
    with pytest.raises(ValueError, match="hash mismatch"):
        render(tmp_path)
