from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.security import doctor_required, get_current_user
from app.models import User
from app import crud, schemas

router = APIRouter(
    prefix="/doctor",
    tags=["Doctor Panel"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Dashboard summary
@router.get("/dashboard")
def doctor_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(doctor_required),
):
    return {
        "total_appointments": crud.count_doctor_appointments(db, current_user.id),
        "upcoming_appointments": crud.count_upcoming_appointments(db, current_user.id),
    }

#My appointments
@router.get("/appointments", response_model=list[schemas.AppointmentRead])
def my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(doctor_required),
):
    return crud.get_my_appointments(db, current_user.id)

#Today appointments
@router.get("/appointments/today", response_model=list[schemas.AppointmentRead])
def today_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(doctor_required),
):
    return crud.get_today_appointments(db, current_user.id)
