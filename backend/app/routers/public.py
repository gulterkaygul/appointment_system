from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app.models import Patient, Appointment
from app.schemas import PublicAppointmentCreate

router = APIRouter(
    prefix="/public",
    tags=["public"]
)


# DB dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# PUBLIC APPOINTMENT CREATE
# (Login gerekmez)

@router.post("/appointments")
def create_public_appointment(
    data: PublicAppointmentCreate,
    db: Session = Depends(get_db)
):
    #Hasta var mı?
    patient = db.query(Patient).filter(
        Patient.phone == data.patient_phone,
        Patient.is_deleted == False
    ).first()

    #Yoksa otomatik oluştur
    if not patient:
        patient = Patient(
            name=data.patient_name,
            phone=data.patient_phone
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

    #Aynı doktor + saat çakışma kontrolü
    conflict = db.query(Appointment).filter(
        Appointment.doctor_id == data.doctor_id,
        Appointment.appointment_time == data.appointment_time,
        Appointment.is_deleted == False
    ).first()

    if conflict:
        raise HTTPException(
            status_code=400,
            detail="Doctor is not available at this time."
        )

    #Randevu oluştur
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=data.doctor_id,
        department=data.department,
        appointment_time=data.appointment_time,
        complaint=data.complaint,
        status="planned"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    return {
        "message": "Appointment request created successfully",
        "appointment_id": appointment.id
    }
