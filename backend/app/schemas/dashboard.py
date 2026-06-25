from datetime import datetime

from pydantic import BaseModel

from app.schemas.teacher import TeacherOut


class UpcomingClassOut(BaseModel):
    id: int
    title: str
    start_time: datetime
    duration_minutes: int
    level_label: str
    teacher_name: str
    teacher_avatar_color: str


class DashboardStats(BaseModel):
    profile_completion: int
    streak_days: int
    lessons_done: int
    next_class_label: str
    messages_count: int


class Recommendation(BaseModel):
    title: str
    body: str


class DashboardOut(BaseModel):
    student_name: str
    stats: DashboardStats
    upcoming_classes: list[UpcomingClassOut]
    recommendation: Recommendation | None
    matched_teacher: TeacherOut | None
