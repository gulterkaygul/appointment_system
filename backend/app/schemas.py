from pydantic import BaseModel
from datetime import datetime

# -----------------------------------------------------
# 🧩 PATIENT (Hasta) Modelleri
# -----------------------------------------------------
class PatientBase(BaseModel):
    name: str
    phone: str


class PatientCreate(PatientBase):
    """Yeni hasta oluşturmak için kullanılacak model"""
    pass


class PatientUpdate(PatientBase):
    """Hasta bilgilerini güncellemek için kullanılacak model"""
    pass


class PatientRead(PatientBase):
    """Veritabanından dönen hasta bilgisi"""
    id: int

    class Config:
         from_attributes = True


# -----------------------------------------------------
# 📅 APPOINTMENT (Randevu) Modelleri
# -----------------------------------------------------
class AppointmentBase(BaseModel):
    patient_id: int
    date: datetime


class AppointmentCreate(AppointmentBase):
    """Yeni randevu oluşturmak için kullanılacak model"""
    pass


class AppointmentUpdate(BaseModel):
    """Randevu durumunu veya zamanını güncellemek için"""
    date: datetime | None = None
    status: str | None = None


class AppointmentRead(AppointmentBase):
    """Veritabanından dönen randevu bilgisi"""
    id: int
    status: str

    class Config:
        from_attributes = True
