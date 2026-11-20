"""Owner-approved technology support for explicitly named roadmap tasks."""

_SQL = ("SQL", "MySQL", "PostgreSQL")
_TERMS = {
    "pandas loading and typing": ("pandas",),
    "python data science stack (numpy, pandas)": ("Python", "pandas"),
    "python notebooks setup": ("Python",),
    "terminal git and python setup": ("Python",),
    "python transformations": ("Python",),
    "python notebooks and environments": ("Python",),
    "numerical python basics": ("Python",),
    "sql filtering and sorting": _SQL,
    "sql joins": _SQL,
    "sql foundations": _SQL,
    "relational database schemas and sql queries": _SQL,
    "advanced sql queries and window functions": _SQL,
    "relational data modeling and sql": _SQL,
    "postgresql tables and indexes": ("PostgreSQL",),
}


def technology_terms(label: str) -> tuple[str, ...]:
    return _TERMS.get(" ".join(label.split()).casefold(), ())
