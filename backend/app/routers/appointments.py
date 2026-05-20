from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud, schemas
from app.models import User, Appointment, Patient
from app.security import admin_required, doctor_required, get_current_user

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

# DOCTOR PANEL – OWN APPOINTMENTS

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

# ADMIN PANEL

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
    "/{appointment_id:int}",
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
    # 1. Güncellenmek istenen randevuyu veritabanında bul
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
        
    # 2. Durumu güncelle
    appointment.status = update_data.status

    # 3. Veritabanına kesin olarak kaydet
    try:
        db.commit()
        db.refresh(appointment)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return appointment

@router.put("{appointment_id}/status")
def update_status(
    appointment_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(doctor_required),
):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id
    ).first()

    if not appointment:
        raise HTTPException(404, "Appointment not found")

    # sadece kendi randevusunu değiştirebilir
    if appointment.doctor_id != current_user.id:
        raise HTTPException(403, "Not authorized")

    # geçerli statusler
    valid_statuses = ["planned", "approved", "rejected", "completed"]

    if status not in valid_statuses:
        raise HTTPException(400, "Invalid status")

    # completed ise bir daha değişmesin (bonus)
    if appointment.status == "completed":
        raise HTTPException(400, "Completed appointment cannot be changed")

    appointment.status = status
    db.commit()

    return {"message": f"Status updated to {status}"}

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


# PUBLIC

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
        email=appointment.email,
        doctor_id=appointment.doctor_id,
        appointment_time=appointment.appointment_time,
        department=appointment.department,
        complaint=appointment.complaint,
    )

#patients panel

@router.get("/my-patient/") #sondaki / path cakismasini engeller
def get_my_patient_appointments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # sadece patient role erişsin
    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients allowed")

    # patient kaydını bul
    patient = db.query(Patient).filter(
        Patient.user_id == current_user.id
    ).first()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # randevuları getir
    appointments = db.query(Appointment).filter(
        Appointment.patient_id == patient.id,
        Appointment.is_deleted == False
    ).all()

    return appointments
