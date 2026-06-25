from app.models import TeacherProfile, User
from app.schemas.auth import UserOut
from app.schemas.teacher import TeacherOut


def teacher_to_out(teacher: TeacherProfile) -> TeacherOut:
    return TeacherOut(
        id=teacher.id,
        full_name=teacher.full_name,
        headline=teacher.headline,
        short_bio=teacher.short_bio,
        specialization=teacher.specialization,
        languages=[lang.code for lang in teacher.languages],
        rating=float(teacher.rating),
        reviews_count=teacher.reviews_count,
        lessons_count=teacher.lessons_count,
        hourly_rate=float(teacher.hourly_rate),
        is_pro=teacher.is_pro,
        avatar_color=teacher.avatar_color,
    )


def user_to_out(user: User) -> UserOut:
    if user.is_teacher and user.teacher_profile is not None:
        full_name = user.teacher_profile.full_name
    elif user.student_profile is not None:
        full_name = user.student_profile.full_name
    else:
        full_name = ""
    return UserOut(
        id=user.id,
        email=user.email,
        role=user.role,
        full_name=full_name,
        is_email_verified=user.is_email_verified,
    )
