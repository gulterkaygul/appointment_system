from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# PATIENT SCHEMAS

class PatientBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None # Hastanın kayıtlı mailini tutmak için ekledik


class PatientCreate(PatientBase):
    pass


class PatientRead(PatientBase):
    id: int

    class Config:
        from_attributes = True


# APPOINTMENT SCHEMAS

class PatientMini(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None

    class Config:
        from_attributes = True

class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    department: str
    appointment_time: datetime
    complaint: Optional[str] = "" # Boş bırakılabilir yaptık


class AppointmentCreate(AppointmentBase):
    pass


class AppointmentRead(BaseModel):
    id: int
    appointment_time: datetime
    status: str

    patient: PatientMini   

    doctor_id: Optional[int]
    department: Optional[str]
    complaint: Optional[str]

    class Config:
        from_attributes = True


class AppointmentUpdate(BaseModel):
    status: str


# Login request

class LoginRequest(BaseModel):
    email: str
    password: str


# Token response

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


# PUBLIC APPOINTMENT (NO LOGIN)
# Burası dışarıdaki hastanın randevu aldığı yer
class PublicAppointmentCreate(BaseModel):
    patient_name: str
    patient_phone: str
    email: Optional[str] = None  # ✅ KRİTİK: Optional yaptık, 422 hatasını çözer.
    doctor_id: int
    department: str
    appointment_time: datetime
    complaint: Optional[str] = ""

# Forgot password

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str