from sqlalchemy.orm import Session, joinedload
from datetime import datetime, date
from fastapi import HTTPException, status

from .models import Patient, Appointment


# =========================
# PATIENT CRUD
# =========================

def create_patient(db: Session, name: str, phone: str, email: str = None):
    # Artık hasta oluştururken email bilgisini de kaydediyoruz
    patient = Patient(name=name, phone=phone, email=email)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


def get_patients(db: Session):
    return db.query(Patient).filter(Patient.is_deleted == False).all()


def get_patient(db: Session, patient_id: int):
    return db.query(Patient).filter(
        Patient.id == patient_id,
        Patient.is_deleted == False
    ).first()


def delete_patient(db: Session, patient_id: int):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        return None

    patient.is_deleted = True
    db.commit()
    return patient


# =========================
# APPOINTMENT HELPERS
# =========================

VALID_STATUSES = ["planned", "approved", "rejected", "completed"]


def _check_conflict(db: Session, doctor_id: int, appointment_time: datetime):
    conflict = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.appointment_time == appointment_time,
        Appointment.is_deleted == False
    ).first()

    if conflict:
        raise HTTPException(
            status_code=400,
            detail="Doctor is not available at this time."
        )


def _get_appointment_or_404(db: Session, appointment_id: int):
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.is_deleted == False
    ).first()

    if not appointment:
        raise HTTPException(404, "Appointment not found")

    return appointment


# =========================
# CREATE
# =========================

def create_appointment(
    db: Session,
    patient_id: int,
    doctor_id: int,
    appointment_time: datetime,
    department: str,
    complaint: str,
):
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


def create_public_appointment(
    db: Session,
    patient_name: str,
    patient_phone: str,
    doctor_id: int,
    appointment_time: datetime,
    email: str = None,  # <-- KRİTİK: Terminaldeki TypeError'ı bu satır çözüyor
    department: str | None = None,
    complaint: str | None = None,
):
    # patient oluştururken artık email parametresini de iletiyoruz
    patient = create_patient(db, patient_name, patient_phone, email)

    # çakışma kontrolü
    _check_conflict(db, doctor_id, appointment_time)

    # randevu oluştur
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


# =========================
# READ
# =========================

def get_appointments(db: Session):
    return db.query(Appointment).filter(Appointment.is_deleted == False).all()


def get_appointment_by_id(db: Session, appointment_id: int):
    return _get_appointment_or_404(db, appointment_id)


def get_my_appointments(db: Session, doctor_id: int):
    return db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.is_deleted == False
    ).all()


# =========================
# UPDATE (STATUS)
# =========================

def update_appointment_status(
    db: Session,
    appointment_id: int,
    new_status: str,
    current_user_id: int = None,
    is_doctor: bool = False
):
    appointment = _get_appointment_or_404(db, appointment_id)

    # doktor sadece kendi randevusunu değiştirebilir
    if is_doctor and appointment.doctor_id != current_user_id:
        raise HTTPException(403, "Not authorized")

    # status kontrol
    if new_status not in VALID_STATUSES:
        raise HTTPException(400, "Invalid status")

    # completed kilidi
    if appointment.status == "completed":
        raise HTTPException(400, "Completed appointment cannot be changed")

    appointment.status = new_status
    db.commit()
    db.refresh(appointment)

    return appointment


# =========================
# DELETE
# =========================

def delete_appointment(db: Session, appointment_id: int):
    appointment = _get_appointment_or_404(db, appointment_id)

    appointment.is_deleted = True
    db.commit()

    return appointment


# =========================
# DASHBOARD
# =========================

def get_today_appointments(db: Session, doctor_id: int):
    today = date.today()

    return db.query(Appointment).options(
        joinedload(Appointment.patient)
        ).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.is_deleted == False,
        Appointment.appointment_time >= datetime.combine(today, datetime.min.time()),
        Appointment.appointment_time <= datetime.combine(today, datetime.max.time()),
    ).all()


def count_doctor_appointments(db: Session, doctor_id: int):
    return db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.is_deleted == False
    ).count()


def count_upcoming_appointments(db: Session, doctor_id: int):
    return db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.is_deleted == False,
        Appointment.status == "planned"
    ).count()