from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
def list_users(role: str | None = None, db: Session = Depends(get_db)):
    query = db.query(User)

    if role:
        query = query.filter(User.role == role)

    return query.all()
