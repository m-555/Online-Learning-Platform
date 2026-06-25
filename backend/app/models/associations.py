from sqlalchemy import Column, ForeignKey, Table

from app.db.base_class import Base

# Languages a teacher can teach (many-to-many).
teacher_languages = Table(
    "teacher_languages",
    Base.metadata,
    Column(
        "teacher_profile_id",
        ForeignKey("teacher_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column("language_id", ForeignKey("languages.id", ondelete="CASCADE"), primary_key=True),
)

# Students enrolled in a class session (many-to-many).
session_students = Table(
    "session_students",
    Base.metadata,
    Column(
        "class_session_id", ForeignKey("class_sessions.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "student_profile_id",
        ForeignKey("student_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)
