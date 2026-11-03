"""Regression cases for source fidelity and referential failures in the release."""

import copy
import json
import unittest

from curate_dataset import ROOT, DEFAULT_OUTPUT, write_table, bundle
from validate_dataset import validate


class DatasetIntegrityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.original = json.loads((DEFAULT_OUTPUT / "dataset.json").read_text(encoding="utf-8"))["tables"]

    def rejects(self, name, mutate):
        data = copy.deepcopy(self.original)
        mutate(data)
        out = ROOT / ".cache/curation-negative" / name
        out.mkdir(parents=True, exist_ok=True)
        for table, rows in data.items():
            write_table(out, table, rows, list(self.original[table][0]))
        bundle(out)
        with self.assertRaises(AssertionError):
            validate(out, report=False)

    def test_native_level_cannot_be_rescaled(self):
        self.rejects("level", lambda d: d["expectations"][0].update(native_level="0.99"))

    def test_suppression_cannot_be_discarded(self):
        self.rejects("suppression", lambda d: d["expectations"][0].update(suppression="fabricated"))

    def test_crosswalk_cannot_reference_unknown_occupation(self):
        self.rejects("crosswalk", lambda d: d["crosswalks"][0].update(to_id="unknown"))

    def test_duplicates_are_not_accepted(self):
        self.rejects("duplicate", lambda d: d["competencies"].append(copy.deepcopy(d["competencies"][0])))

    def test_spread_contamination_is_rejected(self):
        self.rejects("pdf-label", lambda d: d["competencies"][0].update(label="Competencies Applications Development"))

    def test_topic_association_must_resolve(self):
        self.rejects("topic", lambda d: d["learning_associations"][0].update(topic_id="fabricated"))


if __name__ == "__main__":
    unittest.main()
