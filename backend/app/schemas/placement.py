from pydantic import BaseModel


class PlacementOption(BaseModel):
    key: str  # "A" | "B" | "C" | "D"
    text: str


class PlacementQuestion(BaseModel):
    id: int
    text: str
    skill: str
    difficulty: float
    options: list[PlacementOption]


class PlacementAnswer(BaseModel):
    question_id: int
    choice: str  # "A" | "B" | "C" | "D"


class PlacementSubmission(BaseModel):
    answers: list[PlacementAnswer]


class PlacementResult(BaseModel):
    level: str
    theta: float
    correct: int
    total: int
