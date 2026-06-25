from pydantic import BaseModel


class TeacherOut(BaseModel):
    id: int
    full_name: str
    headline: str
    short_bio: str
    specialization: str | None
    languages: list[str]
    rating: float
    reviews_count: int
    lessons_count: int
    hourly_rate: float
    is_pro: bool
    avatar_color: str
