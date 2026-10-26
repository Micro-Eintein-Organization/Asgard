"""Shared wire conventions. SQL migrations remain persistence authority."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StrictInt

Revision = Annotated[StrictInt, Field(ge=1)]
ExpectedVersion = Annotated[StrictInt, Field(ge=0)]
Identifier = Annotated[str, Field(min_length=1, max_length=100)]


class Contract(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class VersionedChange(Contract):
    # Zero means create only if absent; positive values require compare-and-swap.
    expected_version: ExpectedVersion


class Page[T](Contract):
    items: list[T]
    offset: Annotated[int, Field(ge=0)]
    limit: Annotated[int, Field(ge=1, le=100)]
    total: Annotated[int, Field(ge=0)]
