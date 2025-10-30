from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    phone = Column(String)

    appointments = relationship("Appointment", back_populates="patient")


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_name = Column(String)  # Hangi doktor
    appointment_time = Column(DateTime)  # Randevu tarihi ve saati
    status = Column(String, default="planned")  # planned, completed, canceled

    patient = relationship("Patient", back_populates="appointments")
