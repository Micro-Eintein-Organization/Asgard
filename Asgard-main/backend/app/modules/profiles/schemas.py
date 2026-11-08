import unicodedata
from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StrictInt, field_validator


class Profile(BaseModel):
    first_name: str
    surname: str
    version: int
    created_at: datetime
    updated_at: datetime


class ProfileEnvelope(BaseModel):
    profile: Profile | None


class SavedProfileEnvelope(BaseModel):
    profile: Profile


class ProfileUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")
    first_name: str
    surname: str = ""
    expected_version: Annotated[StrictInt, Field(ge=0)]

    @field_validator("first_name", "surname")
    @classmethod
    def validate_name(cls, value: str, info):
        if any(unicodedata.category(character) == "Cc" for character in value):
            raise ValueError("Remove control characters from your name.")
        value = value.strip()
        if len(value) > 100:
            raise ValueError("Use 100 characters or fewer.")
        if info.field_name == "first_name" and not value:
            raise ValueError("Enter your first name.")
        return value
