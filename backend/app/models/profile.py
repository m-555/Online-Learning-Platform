from datetime import UTC, datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base
from app.models.associations import teacher_languages

if TYPE_CHECKING:
    from app.models.user import User


def _utcnow() -> datetime:
    return datetime.now(UTC)


class Language(Base):
    __tablename__ = "languages"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(10), unique=True)
    name: Mapped[str] = mapped_column(String(50))


class Level(Base):
    """CEFR-style level, e.g. A1–C2."""

    __tablename__ = "levels"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(Text, default="")


class TeacherProfile(Base):
    __tablename__ = "teacher_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    full_name: Mapped[str] = mapped_column(String(100))
    headline: Mapped[str] = mapped_column(String(160), default="")
    short_bio: Mapped[str] = mapped_column(Text, default="")
    specialization: Mapped[str | None] = mapped_column(String(200), nullable=True)

    hourly_rate: Mapped[float] = mapped_column(Numeric(6, 2), default=0)
    rating: Mapped[float] = mapped_column(Numeric(2, 1), default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    lessons_count: Mapped[int] = mapped_column(Integer, default=0)

    is_pro: Mapped[bool] = mapped_column(default=False)
    available_mornings: Mapped[bool] = mapped_column(default=True)
    available_evenings: Mapped[bool] = mapped_column(default=True)

    # Hex color used to render the initials avatar in the UI.
    avatar_color: Mapped[str] = mapped_column(String(7), default="#4B47E8")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    user: Mapped["User"] = relationship(back_populates="teacher_profile")
    languages: Mapped[list[Language]] = relationship(secondary=teacher_languages)
    reviews: Mapped[list["TeacherReview"]] = relationship(
        back_populates="teacher", cascade="all, delete-orphan"
    )


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)

    full_name: Mapped[str] = mapped_column(String(100))
    preferred_language: Mapped[str] = mapped_column(String(10), default="en")
    current_level_id: Mapped[int | None] = mapped_column(
        ForeignKey("levels.id", ondelete="SET NULL"), nullable=True
    )
    assigned_teacher_id: Mapped[int | None] = mapped_column(
        ForeignKey("teacher_profiles.id", ondelete="SET NULL"), nullable=True
    )

    profile_completion: Mapped[int] = mapped_column(Integer, default=0)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    unread_messages: Mapped[int] = mapped_column(Integer, default=0)
    avatar_color: Mapped[str] = mapped_column(String(7), default="#0E9F6E")

    user: Mapped["User"] = relationship(back_populates="student_profile")
    current_level: Mapped[Level | None] = relationship()
    assigned_teacher: Mapped[TeacherProfile | None] = relationship()


class TeacherReview(Base):
    __tablename__ = "teacher_reviews"

    id: Mapped[int] = mapped_column(primary_key=True)
    teacher_id: Mapped[int] = mapped_column(ForeignKey("teacher_profiles.id", ondelete="CASCADE"))
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"))
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    teacher: Mapped[TeacherProfile] = relationship(back_populates="reviews")
