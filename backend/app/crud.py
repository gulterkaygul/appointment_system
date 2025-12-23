from sqlalchemy.orm import Session
from .models import Patient, Appointment
from datetime import datetime
from fastapi import HTTPException, status

# -------------------------
# PATIENT CRUD
# -------------------------

def create_patient(db: Session, name: str, phone: str):
    new_patient = Patient(name=name, phone=phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

def get_patients(db: Session):
    return db.query(Patient).filter(Patient.is_deleted == False).all()

def get_patient(db: Session, patient_id: int):
    return (
        db.query(Patient)
        .filter(Patient.id == patient_id, Patient.is_deleted == False)
        .first()
    )

def update_patient(db: Session, patient_id: int, name: str, phone: str):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        return None

    patient.name = name
    patient.phone = phone

    db.commit()
    db.refresh(patient)
    return patient

def delete_patient(db: Session, patient_id: int):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        return None

    patient.is_deleted = True
    db.commit()
    return patient

# -------------------------
# APPOINTMENT CRUD
# -------------------------

def create_appointment(
    db: Session,
    patient_id: int,
    doctor_id: int,
    appointment_time: datetime,
    appointment_status: str = "planned"
):

    # ---- ÇAKIŞMA KONTROLÜ ----
    conflict = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_time == appointment_time,
        Appointment.is_deleted == False
    ).first()

    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment conflict: doctor is not available at this time."
        )

    # ---- RANDEVUYU OLUŞTUR ----
    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        appointment_time=appointment_time,
        status=appointment_status
    )
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


def get_appointments(db: Session):
    return db.query(Appointment).filter(Appointment.is_deleted == False).all()

def get_appointment_by_id(db: Session, appointment_id: int):
    return (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.is_deleted == False)
        .first()
    )

def update_appointment(db: Session, appointment_id: int, status: str):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None
    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment

def delete_appointment(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        return None

    appointment.is_deleted = True
    db.commit()
    return appointment

