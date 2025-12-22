from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# ------------------------
# AuditMixin (Soft Delete)
# ------------------------
class AuditMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)


# ------------------------
# Patient Model
# ------------------------
class Patient(Base, AuditMixin):
    __tablename__ = "patients"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)

    appointments = relationship("Appointment", back_populates="patient")


# ------------------------
# Appointment Model
# ------------------------
class Appointment(Base, AuditMixin):
    __tablename__ = "appointments"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("public.patients.id"))
    doctor_id = Column(Integer, ForeignKey("public.users.id"))  # NEW
    appointment_time = Column(DateTime)
    status = Column(String, default="planned")

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("User")  # NEW
    

# ------------------------
# User Model  (NEW)
# ------------------------
class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="doctor")  # doctor / admin / ...
