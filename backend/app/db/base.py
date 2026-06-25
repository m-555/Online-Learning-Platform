"""Aggregates ``Base.metadata`` with every model imported, for Alembic autogenerate."""

from app.db.base_class import Base  # noqa: F401
from app.models import (  # noqa: F401
    ClassSession,
    Language,
    Level,
    StudentProfile,
    TeacherProfile,
    TeacherReview,
    User,
)
