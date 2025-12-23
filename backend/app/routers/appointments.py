from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas, models
from app.security import doctor_required

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


# GET all appointments --doctor only
@router.get("/", response_model=list[schemas.AppointmentRead], dependencies=[Depends(doctor_required)])
def read_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)


# POST create appointment
@router.post("/", response_model=schemas.AppointmentRead)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    new_appointment = crud.create_appointment(
        db=db,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        status="planned"
    )
    return new_appointment


# GET appointment by ID --doctor only
@router.get("/{appointment_id}", response_model=schemas.AppointmentRead, dependencies=[Depends(doctor_required)]
)
def read_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = crud.get_appointment_by_id(db, appointment_id)
    if db_appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return db_appointment


# PUT update appointment --doctor only
@router.put("/{appointment_id}", response_model=schemas.AppointmentRead, dependencies=[Depends(doctor_required)]
)
def update_appointment(
    appointment_id: int,
    update_data: schemas.AppointmentRead,
    db: Session = Depends(get_db)
):
    updated = crud.update_appointment(
        db=db,
        appointment_id=appointment_id,
        status=update_data.status
    )
    if updated is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated


# DELETE appointment --doctor only
@router.delete("/{appointment_id}", dependencies=[Depends(doctor_required)])
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    result = crud.delete_appointment(db, appointment_id)
    if not result:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"detail": "Appointment deleted successfully"}
