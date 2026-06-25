from datetime import UTC, datetime

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_student
from app.api.serializers import teacher_to_out
from app.db.session import get_db
from app.models import ClassSession, TeacherProfile, User
from app.models.associations import session_students
from app.schemas.dashboard import (
    DashboardOut,
    DashboardStats,
    Recommendation,
    UpcomingClassOut,
)

router = APIRouter(prefix="/me", tags=["dashboard"])


def _next_class_label(start: datetime, now: datetime) -> str:
    days = (start.date() - now.date()).days
    if days <= 0:
        return "Today"
    if days == 1:
        return "Tomorrow"
    return start.strftime("%a %d %b")


@router.get("/dashboard", response_model=DashboardOut)
def get_dashboard(
    user: User = Depends(get_current_student), db: Session = Depends(get_db)
) -> DashboardOut:
    student = user.student_profile
    now = datetime.now(UTC)

    student_session_ids = (
        select(session_students.c.class_session_id)
        .where(session_students.c.student_profile_id == student.id)
        .scalar_subquery()
    )

    upcoming = db.scalars(
        select(ClassSession)
        .where(ClassSession.id.in_(student_session_ids), ClassSession.start_time >= now)
        .order_by(ClassSession.start_time.asc())
        .limit(5)
    ).all()

    lessons_done_count = len(
        db.scalars(
            select(ClassSession.id).where(
                ClassSession.id.in_(student_session_ids), ClassSession.start_time < now
            )
        ).all()
    )

    upcoming_out = [
        UpcomingClassOut(
            id=s.id,
            title=s.title,
            start_time=s.start_time,
            duration_minutes=s.duration_minutes,
            level_label=s.level_label,
            teacher_name=s.teacher.full_name,
            teacher_avatar_color=s.teacher.avatar_color,
        )
        for s in upcoming
    ]

    stats = DashboardStats(
        profile_completion=student.profile_completion,
        streak_days=student.streak_days,
        lessons_done=lessons_done_count,
        next_class_label=_next_class_label(upcoming[0].start_time, now) if upcoming else "—",
        messages_count=student.unread_messages,
    )

    # AI recommendation — placeholder content seeded from the student's level until the
    # recommendation engine is wired up.
    recommendation = Recommendation(
        title="Ready to review past tense?",
        body="Based on your last lesson, we built a 10-minute exercise set on passé composé.",
    )

    matched = student.assigned_teacher
    if matched is None:
        matched = db.scalar(
            select(TeacherProfile).order_by(
                TeacherProfile.rating.desc(), TeacherProfile.reviews_count.desc()
            )
        )

    return DashboardOut(
        student_name=student.full_name,
        stats=stats,
        upcoming_classes=upcoming_out,
        recommendation=recommendation,
        matched_teacher=teacher_to_out(matched) if matched else None,
    )
