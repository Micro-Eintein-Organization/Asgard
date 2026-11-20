"""Conservative filtering for claimed skill evidence, independent of persistence."""

import re


def positive_statements(value):
    statements = re.split(r"[!?;\n]+|\.(?:\s|$)|\bbut\b", value, flags=re.I)
    positive = []
    for statement in statements:
        blocked = False
        for part in statement.split(","):
            part = part.strip()
            if re.search(r"\bI\s+(?:use|used|have|built|know|work|worked)\b", part, re.I):
                blocked = False
            if re.search(
                r"(?<![\w-])(?:no|not|never|without|want|wish|hope|intend|learn|would|could)"
                r"(?![\w-])|\b(?:plan|planning|learning)\s+to\b"
                r"|\b(?:don't|haven't|can't|didn't)\b", part, re.I,
            ):
                blocked = True
            if part and not blocked:
                positive.append(part)
    return positive
