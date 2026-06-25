from typing import Literal

from pydantic import BaseModel

# Supported UI locales: English, French, Luxembourgish.
LocaleCode = Literal["en", "fr", "lb"]


class UpdateMeIn(BaseModel):
    preferred_language: LocaleCode
