from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud, schemas
from app.models import User
from app.security import admin_required, doctor_required

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

# =========================================================
# DOCTOR PANEL – OWN APPOINTMENTS
# =========================================================

@router.get(
    "/my",
    response_model=list[schemas.AppointmentRead],
)
def read_my_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(doctor_required),
):
    return crud.get_my_appointments(
        db=db,
        doctor_id=current_user.id
    )

# =========================================================
# ADMIN PANEL
# =========================================================

@router.get(
    "/",
    response_model=list[schemas.AppointmentRead],
)
def read_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return crud.get_appointments(db)


@router.post(
    "/admin",
    response_model=schemas.AppointmentRead,
)
def create_appointment_admin(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return crud.create_appointment(
        db=db,
        patient_id=appointment.patient_id,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        department=appointment.department,
        complaint=appointment.complaint,
    )


@router.get(
    "/{appointment_id}",
    response_model=schemas.AppointmentRead,
)
def read_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment


@router.put(
    "/{appointment_id}",
    response_model=schemas.AppointmentRead,
)
def update_appointment(
    appointment_id: int,
    update_data: schemas.AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    updated = crud.update_appointment(
        db=db,
        appointment_id=appointment_id,
        status=update_data.status
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated


@router.delete(
    "/{appointment_id}",
)
def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    deleted = crud.delete_appointment(db, appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"detail": "Appointment deleted successfully"}

# =========================================================
# PUBLIC
# =========================================================

@router.post(
    "/",
    response_model=schemas.AppointmentRead,
)
def create_public_appointment(
    appointment: schemas.PublicAppointmentCreate,
    db: Session = Depends(get_db),
):
    return crud.create_public_appointment(
        db=db,
        patient_name=appointment.patient_name,
        patient_phone=appointment.patient_phone,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        department=appointment.department,
        complaint=appointment.complaint,
    )
