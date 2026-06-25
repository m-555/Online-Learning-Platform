from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.api.serializers import teacher_to_out
from app.db.session import get_db
from app.models import Language, TeacherProfile
from app.schemas.teacher import TeacherOut

router = APIRouter(prefix="/teachers", tags=["teachers"])

SortOption = Literal["top_rated", "price_low", "price_high"]


@router.get("", response_model=list[TeacherOut])
def list_teachers(
    db: Session = Depends(get_db),
    language: str | None = Query(default=None, description="Language code, e.g. 'fr'"),
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    availability: Literal["mornings", "evenings"] | None = Query(default=None),
    q: str | None = Query(default=None, description="Free-text search"),
    sort: SortOption = "top_rated",
    limit: int = Query(default=24, ge=1, le=100),
) -> list[TeacherOut]:
    stmt = select(TeacherProfile)

    if language:
        stmt = stmt.join(TeacherProfile.languages).where(Language.code == language)
    if min_price is not None:
        stmt = stmt.where(TeacherProfile.hourly_rate >= min_price)
    if max_price is not None:
        stmt = stmt.where(TeacherProfile.hourly_rate <= max_price)
    if availability == "mornings":
        stmt = stmt.where(TeacherProfile.available_mornings.is_(True))
    elif availability == "evenings":
        stmt = stmt.where(TeacherProfile.available_evenings.is_(True))
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                TeacherProfile.full_name.ilike(like),
                TeacherProfile.headline.ilike(like),
                TeacherProfile.short_bio.ilike(like),
            )
        )

    if sort == "price_low":
        stmt = stmt.order_by(TeacherProfile.hourly_rate.asc())
    elif sort == "price_high":
        stmt = stmt.order_by(TeacherProfile.hourly_rate.desc())
    else:
        stmt = stmt.order_by(TeacherProfile.rating.desc(), TeacherProfile.reviews_count.desc())

    teachers = db.scalars(stmt.distinct().limit(limit)).unique().all()
    return [teacher_to_out(t) for t in teachers]


@router.get("/{teacher_id}", response_model=TeacherOut)
def get_teacher(teacher_id: int, db: Session = Depends(get_db)) -> TeacherOut:
    teacher = db.get(TeacherProfile, teacher_id)
    if teacher is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teacher not found")
    return teacher_to_out(teacher)
