"""Seed the database with demo data that mirrors the Aula design mockups.

Run with:  python -m app.db.seed
Idempotent: it does nothing if users already exist.
"""

from __future__ import annotations

from datetime import UTC, datetime, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models import (
    ClassSession,
    Language,
    Level,
    StudentProfile,
    TeacherProfile,
    TeacherReview,
    User,
)

DEMO_PASSWORD = "password123"

LANGUAGES = [
    ("en", "English"),
    ("fr", "Français"),
    ("lb", "Lëtzebuergesch"),
    ("de", "German"),
    ("es", "Spanish"),
]

LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"]

TEACHERS = [
    {
        "email": "sophie@aula.lu",
        "full_name": "Sophie K.",
        "headline": "Conversational French & exam prep",
        "short_bio": "Conversational French & exam prep. 8 years teaching in Luxembourg.",
        "specialization": "Exam preparation",
        "languages": ["fr", "en"],
        "hourly_rate": 18,
        "rating": 4.9,
        "reviews_count": 320,
        "lessons_count": 320,
        "is_pro": True,
        "avatar_color": "#4B47E8",
        "available_mornings": True,
        "available_evenings": True,
    },
    {
        "email": "marc@aula.lu",
        "full_name": "Marc L.",
        "headline": "Patient with beginners, focuses on real conversation",
        "short_bio": "Patient with beginners. Focuses on speaking from lesson one.",
        "specialization": "Beginner conversation",
        "languages": ["lb", "en", "fr"],
        "hourly_rate": 24,
        "rating": 5.0,
        "reviews_count": 540,
        "lessons_count": 540,
        "is_pro": True,
        "avatar_color": "#0E9F6E",
        "available_mornings": False,
        "available_evenings": True,
    },
    {
        "email": "amal@aula.lu",
        "full_name": "Amal D.",
        "headline": "Business & everyday French for professionals",
        "short_bio": "Business & everyday French for working professionals.",
        "specialization": "Business French",
        "languages": ["en", "fr"],
        "hourly_rate": 20,
        "rating": 4.8,
        "reviews_count": 210,
        "lessons_count": 210,
        "is_pro": False,
        "avatar_color": "#C77700",
        "available_mornings": True,
        "available_evenings": True,
    },
    {
        "email": "julie@aula.lu",
        "full_name": "Julie T.",
        "headline": "Friendly tutor for kids and teens",
        "short_bio": "Friendly tutor for kids and teens. Games-based lessons.",
        "specialization": "Young learners",
        "languages": ["fr", "lb"],
        "hourly_rate": 15,
        "rating": 4.7,
        "reviews_count": 44,
        "lessons_count": 44,
        "is_pro": False,
        "avatar_color": "#B0455A",
        "available_mornings": True,
        "available_evenings": False,
    },
]


def _make_teacher(db: Session, langs: dict[str, Language], data: dict) -> TeacherProfile:
    user = User(
        email=data["email"],
        hashed_password=hash_password(DEMO_PASSWORD),
        is_teacher=True,
        is_email_verified=True,
    )
    profile = TeacherProfile(
        full_name=data["full_name"],
        headline=data["headline"],
        short_bio=data["short_bio"],
        specialization=data["specialization"],
        hourly_rate=data["hourly_rate"],
        rating=data["rating"],
        reviews_count=data["reviews_count"],
        lessons_count=data["lessons_count"],
        is_pro=data["is_pro"],
        avatar_color=data["avatar_color"],
        available_mornings=data["available_mornings"],
        available_evenings=data["available_evenings"],
        languages=[langs[code] for code in data["languages"]],
    )
    user.teacher_profile = profile
    db.add(user)
    return profile


def seed(db: Session) -> None:
    if db.scalar(select(User).limit(1)) is not None:
        print("Database already seeded — skipping.")
        return

    languages = {code: Language(code=code, name=name) for code, name in LANGUAGES}
    db.add_all(languages.values())
    levels = {name: Level(name=name) for name in LEVELS}
    db.add_all(levels.values())
    db.flush()

    teachers = {data["email"]: _make_teacher(db, languages, data) for data in TEACHERS}
    db.flush()

    # Demo student — intentionally left unverified so the dashboard shows the soft
    # "verify your email" banner from the design.
    anne_user = User(
        email="anne@school.lu",
        hashed_password=hash_password(DEMO_PASSWORD),
        is_student=True,
        is_email_verified=False,
    )
    anne = StudentProfile(
        full_name="Anne S.",
        preferred_language="en",
        current_level=levels["A2"],
        assigned_teacher=teachers["marc@aula.lu"],
        profile_completion=50,
        streak_days=4,
        unread_messages=3,
        avatar_color="#0E9F6E",
    )
    anne_user.student_profile = anne
    db.add(anne_user)
    db.flush()

    now = datetime.now(UTC)
    marc = teachers["marc@aula.lu"]

    # One upcoming class tomorrow at 10:00 with Marc.
    upcoming = ClassSession(
        title="French conversation · A2",
        session_type="one_on_one",
        status="scheduled",
        start_time=(now + timedelta(days=1)).replace(hour=10, minute=0, second=0, microsecond=0),
        duration_minutes=45,
        level_label="A2",
        language_code="fr",
        teacher=marc,
        students=[anne],
    )
    db.add(upcoming)

    # Twelve completed lessons over the past month so "Lessons done" reads 12.
    past_teachers = list(teachers.values())
    for i in range(12):
        db.add(
            ClassSession(
                title="French conversation · A2",
                session_type="one_on_one",
                status="completed",
                start_time=now - timedelta(days=2 + i * 2, hours=1),
                duration_minutes=45,
                level_label="A2",
                language_code="fr",
                teacher=past_teachers[i % len(past_teachers)],
                students=[anne],
            )
        )

    # A couple of reviews so ratings have backing rows.
    db.add(TeacherReview(teacher=marc, student_id=anne.id, rating=5, comment="Fantastic teacher."))

    db.commit()
    print("Seeded demo data: 4 teachers, 1 student (anne@school.lu), 13 sessions.")
    print(f"All demo accounts use the password: {DEMO_PASSWORD}")


def main() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed(db)


if __name__ == "__main__":
    main()
