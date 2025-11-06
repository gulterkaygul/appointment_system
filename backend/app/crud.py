from sqlalchemy.orm import Session
from .models import Patient, Appointment
from datetime import datetime

#patient crud
def create_patient(db: Session, name: str, phone: str):
    new_patient = Patient(name=name, phone=phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

def get_patients(db: Session):
    return db.query(Patient).all()

#appointment crud
def create_appointment(db: Session, patient_id: int, doctor_name: str, appointment_time: datetime, status: str = "planned"):
    appointment = Appointment(
        patient_id=patient_id,
        doctor_name=doctor_name,
        appointment_time=appointment_time,
        status=status
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

def get_appointments(db: Session):
    return db.query(Appointment).all()

def get_appointment_by_id(db: Session, appointment_id: int):
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()

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
    db.delete(appointment)
    db.commit()
    return appointment