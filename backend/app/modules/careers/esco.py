"""Authenticated reads from the approved ESCO reference release."""

from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request

from app.api.contracts import Contract
from app.core.errors import APIError, ErrorBody
from app.core.security import Identity, current_identity
from app.modules.storage import one, required, rows, transaction

Auth = Annotated[Identity, Depends(current_identity)]
Kind = Literal["occupation", "skill"]
Limit = Annotated[int, Query(ge=1, le=100)]
Offset = Annotated[int, Query(ge=0)]
Uri = Annotated[str, Query(min_length=1, max_length=160)]
router = APIRouter(
    prefix="/esco", tags=["esco"],
    responses={code: {"model": ErrorBody} for code in (401, 404, 409, 422, 503)},
)


class EscoConcept(Contract):
    uri: str
    kind: Kind
    label: str
    relationship: Literal["essential", "optional"] | None = None


class EscoPage(Contract):
    release_id: UUID | None
    version: str | None
    adaptations: str | None
    items: list[EscoConcept]
    total: int


class EscoDetail(EscoPage):
    concept: EscoConcept
    description: str
    careers: list["EscoCareer"]


class EscoCareer(Contract):
    id: UUID
    title: str


async def release(connection, expected):
    current = await one(connection, "SELECT asgard_catalog.lock_esco_release() AS id")
    if expected is not None and expected != current["id"]:
        raise APIError(409, "esco_release_changed", "The ESCO release changed. Reload to continue.")
    return await one(connection, """
        SELECT id AS release_id, version, adaptations
        FROM asgard_catalog.esco_releases WHERE id = :id
    """, current)


@router.get("/concepts", response_model=EscoPage, operation_id="search_esco_concepts")
async def search(
    request: Request, identity: Auth, q: Annotated[str, Query(max_length=160)] = "",
    kind: Kind | None = None, limit: Limit = 20, offset: Offset = 0,
    expected_release_id: UUID | None = None, career_id: UUID | None = None,
):
    async with transaction(request, identity) as connection:
        active = await release(connection, expected_release_id)
        if active is None:
            return dict(release_id=None, version=None, adaptations=None, items=[], total=0)
        params = dict(id=active["release_id"], kind=kind, q=q.strip(), limit=limit,
                      offset=offset, career_id=career_id)
        where = """
            FROM asgard_catalog.esco_concepts c WHERE c.release_id = :id
            AND (CAST(:kind AS text) IS NULL OR c.kind = :kind)
            AND (CAST(:career_id AS uuid) IS NULL OR EXISTS (
                SELECT 1 FROM asgard_catalog.esco_career_links m
                WHERE m.release_id = c.release_id AND m.occupation_uri = c.uri
                AND m.career_id = :career_id
            ))
            AND (strpos(lower(c.label), lower(:q)) > 0 OR EXISTS (
                SELECT 1 FROM unnest(c.alternatives) AS a(label)
                WHERE strpos(lower(a.label), lower(:q)) > 0
            ))
        """
        total = await one(connection, "SELECT count(*) AS total " + where, params)
        items = await rows(connection, "SELECT uri, kind, label " + where + """
            ORDER BY lower(label), uri LIMIT :limit OFFSET :offset
        """, params)
        return {**active, **total, "items": items}


@router.get("/concept", response_model=EscoDetail, operation_id="get_esco_concept")
async def detail(
    request: Request, identity: Auth, uri: Uri, limit: Limit = 20, offset: Offset = 0,
    expected_release_id: UUID | None = None,
):
    async with transaction(request, identity) as connection:
        active = required(await release(connection, expected_release_id))
        params = dict(id=active["release_id"], uri=uri, limit=limit, offset=offset)
        concept = required(await one(connection, """
            SELECT uri, kind, label, description FROM asgard_catalog.esco_concepts
            WHERE release_id = :id AND uri = :uri
        """, params))
        where = """
            FROM asgard_catalog.esco_links e JOIN asgard_catalog.esco_concepts c
            ON c.release_id = e.release_id
            AND c.uri = CASE WHEN e.occupation_uri = :uri THEN e.skill_uri ELSE e.occupation_uri END
            WHERE e.release_id = :id AND :uri IN (e.occupation_uri, e.skill_uri)
        """
        total = await one(connection, "SELECT count(*) AS total " + where, params)
        selection = "SELECT c.uri, c.kind, c.label, e.relationship "
        items = await rows(connection, selection + where + """
            ORDER BY lower(c.label), c.uri, e.relationship LIMIT :limit OFFSET :offset
        """, params)
        description = concept.pop("description")
        careers = await rows(connection, """
            SELECT c.id, c.title FROM asgard_catalog.esco_career_links m
            JOIN asgard_catalog.careers c ON c.id = m.career_id AND c.status = 'published'
            WHERE m.release_id = :id AND m.occupation_uri = :uri
            AND EXISTS (SELECT 1 FROM asgard_catalog.roadmaps r
                        WHERE r.career_id = c.id AND r.status = 'published')
            ORDER BY c.title, c.id
        """, params)
        return {**active, **total, "items": items, "concept": concept,
                "description": description, "careers": careers}
