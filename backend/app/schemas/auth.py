from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class SignupIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=100)
    role: Literal["student", "teacher"] = "student"


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class VerifyEmailIn(BaseModel):
    token: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    full_name: str
    is_email_verified: bool


class SignupOut(BaseModel):
    user: UserOut
    token: Token
    # Returned only in development so the flow can be exercised without a real mailbox.
    verification_token: str | None = None
