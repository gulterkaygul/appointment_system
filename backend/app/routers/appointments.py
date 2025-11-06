from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter(
    prefix="/appointments",
    tags=["appointments"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tüm randevuları listele
@router.get("/", response_model=list[schemas.AppointmentRead])
def read_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)

# Yeni randevu ekle
@router.post("/", response_model=schemas.AppointmentRead)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    return crud.create_appointment(db, appointment)

# ID ile randevu getir
@router.get("/{appointment_id}", response_model=schemas.AppointmentRead)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.get_appointment(db, appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment

# ID ile randevu sil
@router.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    result = crud.delete_appointment(db, appointment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"detail": "Appointment deleted successfully"}
