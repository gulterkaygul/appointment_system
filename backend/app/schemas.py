from pydantic import BaseModel
from datetime import datetime

# =====================================
# PATIENT SCHEMAS
# =====================================

class PatientBase(BaseModel):
    name: str
    phone: str


class PatientCreate(PatientBase):
    pass


class PatientRead(PatientBase):
    id: int

    class Config:
        from_attributes = True


# =====================================
# APPOINTMENT SCHEMAS
# =====================================

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_name: str
    appointment_time: datetime


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRead(AppointmentBase):
    id: int
    status: str

    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    status: str

