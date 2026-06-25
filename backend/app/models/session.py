from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.associations import session_students

if TYPE_CHECKING:
    from app.models.profile import StudentProfile, TeacherProfile


def _utcnow() -> datetime:
    return datetime.now(UTC)


class ClassSession(Base):
    """A scheduled live class between a teacher and one or more students."""

    __tablename__ = "class_sessions"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(150))
    session_type: Mapped[str] = mapped_column(String(20), default="one_on_one")
    status: Mapped[str] = mapped_column(String(20), default="scheduled")

    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=45)

    # Denormalized labels for quick display (e.g. "A2", "fr").
    level_label: Mapped[str] = mapped_column(String(20), default="")
    language_code: Mapped[str] = mapped_column(String(10), default="")

    teacher_id: Mapped[int] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"))

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    teacher: Mapped["TeacherProfile"] = relationship()
    students: Mapped[list["StudentProfile"]] = relationship(secondary=session_students)
