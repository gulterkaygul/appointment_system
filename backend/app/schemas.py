from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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
    doctor_id: int
    department: str
    appointment_time: datetime
    complaint: str


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRead(BaseModel):
    id: int
    patient_id: int
    doctor_id: Optional[int]
    department: Optional[str]
    appointment_time: datetime
    complaint: Optional[str]
    status: str

    class Config:
        from_attributes = True

class AppointmentUpdate(BaseModel):
    status: str


# ------------------------
# Login request
# ------------------------
class LoginRequest(BaseModel):
    email: str
    password: str

# ------------------------
# Token response
# ------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

# =====================================
# PUBLIC APPOINTMENT (NO LOGIN)
# =====================================

class PublicAppointmentCreate(BaseModel):
    patient_name: str
    patient_phone: str
    doctor_id: int
    department: str
    appointment_time: datetime
    complaint: str
