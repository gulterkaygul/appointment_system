from sqlalchemy.orm import Session
from datetime import datetime, date
from fastapi import HTTPException, status

from .models import Patient, Appointment


# =========================================================
# PATIENT CRUD
# =========================================================

def create_patient(db: Session, name: str, phone: str):
    patient = Patient(name=name, phone=phone)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


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


# =========================================================
# APPOINTMENT CRUD
# =========================================================

def _check_conflict(
    db: Session,
    doctor_id: int,
    appointment_time: datetime
):
    conflict = (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_time == appointment_time,
            Appointment.is_deleted == False
        )
        .first()
    )

    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment conflict: doctor is not available at this time."
        )


# -------------------------
# ADMIN – CREATE APPOINTMENT
# -------------------------

def create_appointment(
    db: Session,
    patient_id: int,
    doctor_id: int,
    appointment_time: datetime,
    department: str,
    complaint: str,
):
    # Çakışma kontrolü
    _check_conflict(db, doctor_id, appointment_time)

    appointment = Appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        appointment_time=appointment_time,
        department=department,
        complaint=complaint,
        status="planned",
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


# -------------------------
# PUBLIC – CREATE APPOINTMENT
# -------------------------

def create_public_appointment(
    db: Session,
    patient_name: str,
    patient_phone: str,
    doctor_id: int,
    appointment_time: datetime,
    department: str | None = None,
    complaint: str | None = None,
):
    # 1️⃣ Hasta oluştur
    patient = Patient(name=patient_name, phone=patient_phone)
    db.add(patient)
    db.commit()
    db.refresh(patient)

    # 2️⃣ Çakışma kontrolü
    _check_conflict(db, doctor_id, appointment_time)

    # 3️⃣ Randevu oluştur
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=doctor_id,
        appointment_time=appointment_time,
        department=department,
        complaint=complaint,
        status="planned",
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


# -------------------------
# READ
# -------------------------

def get_appointments(db: Session):
    return db.query(Appointment).filter(Appointment.is_deleted == False).all()


def get_appointment_by_id(db: Session, appointment_id: int):
    return (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.is_deleted == False)
        .first()
    )


def get_my_appointments(db: Session, doctor_id: int):
    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == doctor_id,
            Appointment.is_deleted == False
        )
        .all()
    )


# -------------------------
# UPDATE
# -------------------------

def update_appointment(db: Session, appointment_id: int, status: str):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.is_deleted == False)
        .first()
    )
    if not appointment:
        return None

    appointment.status = status
    db.commit()
    db.refresh(appointment)
    return appointment


def update_appointment_status(
    db: Session,
    appointment_id: int,
    new_status: str
):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.is_deleted == False)
        .first()
    )

    if not appointment:
        return None

    appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    return appointment


# -------------------------
# DELETE (SOFT)
# -------------------------

def delete_appointment(db: Session, appointment_id: int):
    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.is_deleted == False)
        .first()
    )
    if not appointment:
        return None

    appointment.is_deleted = True
    db.commit()
    return appointment


# -------------------------
# DOCTOR DASHBOARD HELPERS
# -------------------------

def get_today_appointments(db: Session, doctor_id: int):
    today = date.today()
    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == doctor_id,
            Appointment.is_deleted == False,
            Appointment.appointment_time >= datetime.combine(today, datetime.min.time()),
            Appointment.appointment_time <= datetime.combine(today, datetime.max.time()),
        )
        .all()
    )


def count_doctor_appointments(db: Session, doctor_id: int):
    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == doctor_id,
            Appointment.is_deleted == False
        )
        .count()
    )


def count_upcoming_appointments(db: Session, doctor_id: int):
    return (
        db.query(Appointment)
        .filter(
            Appointment.doctor_id == doctor_id,
            Appointment.is_deleted == False,
            Appointment.status == "planned"
        )
        .count()
    )