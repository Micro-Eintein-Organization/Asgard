import re
from collections import defaultdict


def suggest(pages, skills):
    phrases = defaultdict(dict)
    for skill in skills:
        for label in [skill["label"], *(skill["aliases"] or [])]:
            phrase = " ".join(label.split()).lower()
            if phrase:
                phrases[phrase][skill["id"]] = skill

    patterns = [
        (
            re.compile(r"(?<!\w)" + r"\s+".join(map(re.escape, phrase.split())) + r"(?!\w)", re.I),
            next(iter(matches.values())) if len(matches) == 1 else None,
        )
        for phrase, matches in phrases.items()
    ]
    suggestions = {}
    for page_number, page in enumerate(pages, 1):
        hits = sorted(
            ((match.start(), match.end(), skill) for pattern, skill in patterns
             for match in pattern.finditer(page)),
            key=lambda hit: (hit[0], -hit[1]),
        )
        covered = 0
        for start, end, skill in hits:
            if start < covered:
                continue
            covered = end
            if skill is None or skill["id"] in suggestions:
                continue
            suggestions[skill["id"]] = {
                "skill_id": skill["id"],
                "label": skill["label"],
                "page": page_number,
                "passage": page[max(0, start - 90):end + 90].strip(),
            }
            if len(suggestions) == 30:
                return list(suggestions.values())
    return list(suggestions.values())
