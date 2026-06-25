from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.profile import StudentProfile, TeacherProfile


def _utcnow() -> datetime:
    return datetime.now(UTC)


class User(Base):
    """Account record. Email is the login identifier; roles separate students and teachers."""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    phone_number: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)

    is_student: Mapped[bool] = mapped_column(Boolean, default=False)
    is_teacher: Mapped[bool] = mapped_column(Boolean, default=False)
    is_email_verified: Mapped[bool] = mapped_column(Boolean, default=False)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    teacher_profile: Mapped["TeacherProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    student_profile: Mapped["StudentProfile | None"] = relationship(
        back_populates="user", uselist=False, cascade="all, delete-orphan"
    )

    @property
    def role(self) -> str:
        if self.is_teacher:
            return "teacher"
        if self.is_student:
            return "student"
        return "user"
