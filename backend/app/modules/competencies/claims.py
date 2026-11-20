"""Conservative filtering for claimed skill evidence, independent of persistence."""

import re


def positive_statements(value):
    statements = re.split(r"[!?;\n]+|\.(?:\s|$)|\bbut\b", value, flags=re.I)
    return [part.strip() for part in statements if part.strip() and not re.search(
        r"\b(no|not|never|without|want|wish|hope|plan|intend|learn|would|could)\b|\blearning to\b"
        r"|\b(?:don't|haven't|can't|didn't)\b", part, re.I)]
