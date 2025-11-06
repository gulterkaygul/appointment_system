from pydantic import BaseModel
from datetime import datetime

class PatientBase(BaseModel):
    name: str
    phone: str

class PatientCreate(PatientBase):
    pass

class PatientRead(PatientBase):
    id: int
    class Config:
        orm_mode = True

class AppointmentBase(BaseModel):
    patient_id: int
    appointment_time: datetime

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentRead(AppointmentBase):
    id: int
    class Config:
        orm_mode = True
