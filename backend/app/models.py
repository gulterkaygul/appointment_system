from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


# =========================
# AuditMixin (Soft Delete)
# =========================

class AuditMixin:
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)


# =========================
# Patient Model
# =========================

class Patient(Base, AuditMixin):
    __tablename__ = "patients"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)

    # 🔥 YENİ: user bağlantısı
    user_id = Column(Integer, ForeignKey("public.users.id"), nullable=True)

    # ilişkiler
    appointments = relationship("Appointment", back_populates="patient")
    user = relationship("User", back_populates="patient_profile")


# =========================
# Appointment Model
# =========================

class Appointment(Base, AuditMixin):
    __tablename__ = "appointments"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)

    patient_id = Column(Integer, ForeignKey("public.patients.id"))
    doctor_id = Column(Integer, ForeignKey("public.users.id"))

    appointment_time = Column(DateTime)
    status = Column(String, default="planned")
    department = Column(String)
    complaint = Column(Text)

    # ilişkiler
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("User", back_populates="doctor_appointments")


# =========================
# User Model
# =========================

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "public"}

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String)  # doctor / admin / patient

    # 🔥 doktor için ilişkiler
    doctor_appointments = relationship("Appointment", back_populates="doctor")

    # 🔥 hasta için profil (1-1)
    patient_profile = relationship("Patient", back_populates="user", uselist=False)