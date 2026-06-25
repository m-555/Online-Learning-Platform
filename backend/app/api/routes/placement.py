from fastapi import APIRouter

from app.schemas.placement import (
    PlacementOption,
    PlacementQuestion,
    PlacementResult,
    PlacementSubmission,
)
from app.services.placement import estimate_theta, load_questions, theta_to_cefr

router = APIRouter(prefix="/placement", tags=["placement"])

_OPTION_KEYS = ("A", "B", "C", "D")


@router.get("/questions", response_model=list[PlacementQuestion])
def get_questions() -> list[PlacementQuestion]:
    """Return the question bank without the correct answers (scoring stays server-side)."""
    questions = load_questions()
    return [
        PlacementQuestion(
            id=q["id"],
            text=q["text"],
            skill=q["skill"],
            difficulty=q["difficulty"],
            options=[
                PlacementOption(key=key, text=q[f"option_{key.lower()}"]) for key in _OPTION_KEYS
            ],
        )
        for q in questions
    ]


@router.post("/submit", response_model=PlacementResult)
def submit(submission: PlacementSubmission) -> PlacementResult:
    by_id = {q["id"]: q for q in load_questions()}

    responses: list[tuple[float, bool]] = []
    correct = 0
    for answer in submission.answers:
        question = by_id.get(answer.question_id)
        if question is None:
            continue
        is_correct = answer.choice.upper() == question["correct_option"].upper()
        correct += int(is_correct)
        responses.append((float(question["difficulty"]), is_correct))

    theta = estimate_theta(responses)
    return PlacementResult(
        level=theta_to_cefr(theta),
        theta=round(theta, 3),
        correct=correct,
        total=len(responses),
    )
