from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_student
from app.api.serializers import user_to_out
from app.db.session import get_db
from app.models import User
from app.schemas.auth import UserOut
from app.schemas.me import UpdateMeIn

router = APIRouter(prefix="/me", tags=["me"])


@router.patch("", response_model=UserOut)
def update_me(
    payload: UpdateMeIn,
    user: User = Depends(get_current_student),
    db: Session = Depends(get_db),
) -> UserOut:
    student = user.student_profile
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Student account required"
        )
    student.preferred_language = payload.preferred_language
    db.commit()
    db.refresh(user)
    return user_to_out(user)
