from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.api.serializers import user_to_out
from app.core.security import (
    VERIFY_TOKEN_TYPE,
    create_access_token,
    create_email_verification_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.db.session import get_db
from app.models import StudentProfile, TeacherProfile, User
from app.schemas.auth import LoginIn, SignupIn, SignupOut, Token, UserOut, VerifyEmailIn
from app.services.email import send_verification_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=SignupOut, status_code=status.HTTP_201_CREATED)
def signup(payload: SignupIn, db: Session = Depends(get_db)) -> SignupOut:
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        is_student=payload.role == "student",
        is_teacher=payload.role == "teacher",
    )
    if payload.role == "teacher":
        user.teacher_profile = TeacherProfile(full_name=payload.full_name)
    else:
        user.student_profile = StudentProfile(full_name=payload.full_name)

    db.add(user)
    db.commit()
    db.refresh(user)

    verification_token = create_email_verification_token(user.id)
    send_verification_email(user.email, verification_token)

    return SignupOut(
        user=user_to_out(user),
        token=Token(access_token=create_access_token(user.id)),
        verification_token=verification_token,
    )


@router.post("/login", response_model=Token)
def login(payload: LoginIn, db: Session = Depends(get_db)) -> Token:
    user = db.scalar(select(User).where(User.email == payload.email))
    if user is None or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
        )
    return Token(access_token=create_access_token(user.id))


@router.post("/verify-email", response_model=UserOut)
def verify_email(payload: VerifyEmailIn, db: Session = Depends(get_db)) -> UserOut:
    user_id = decode_token(payload.token, VERIFY_TOKEN_TYPE)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token"
        )
    user = db.get(User, int(user_id))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user.is_email_verified = True
    db.commit()
    db.refresh(user)
    return user_to_out(user)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> UserOut:
    return user_to_out(user)
