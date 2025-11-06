# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
import crud, models
from database import SessionLocal, engine

# Eğer modellerde Base.metadata.create_all kullandıysan (development)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dentist Appointment System")

# CORS - geliştirme için geniş izin veriyoruz (production'da kısıtla)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic modeller (request/response schemas)
class PatientCreate(BaseModel):
    name: str
    phone: str

class PatientOut(BaseModel):
    id: int
    name: str
    phone: str
    class Config:
        orm_mode = True

class AppointmentCreate(BaseModel):
    patient_id: int
    date: str   # ISO string from frontend (e.g. "2025-11-05T15:00:00")

class AppointmentOut(BaseModel):
    id: int
    patient_id: int
    date: str
    class Config:
        orm_mode = True

@app.get("/")
def home():
    return {"message": "Welcome to the Appointment System!"}

# ---------- Patients ----------
@app.post("/patients/", response_model=PatientOut, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    new_patient = crud.create_patient(db, name=payload.name, phone=payload.phone)
    return new_patient

@app.get("/patients/", response_model=List[PatientOut])
def list_patients(db: Session = Depends(get_db)):
    return crud.get_patients(db)

@app.get("/patients/{patient_id}", response_model=PatientOut)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.put("/patients/{patient_id}", response_model=PatientOut)
def update_patient(patient_id: int, payload: PatientCreate, db: Session = Depends(get_db)):
    updated = crud.update_patient(db, patient_id, payload.name, payload.phone)
    if not updated:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated

@app.delete("/patients/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_patient(db, patient_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Patient not found")
    return

# ---------- Appointments ----------
@app.post("/appointments/", response_model=AppointmentOut, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    appt = crud.create_appointment(db, patient_id=payload.patient_id, date=payload.date)
    return appt

@app.get("/appointments/", response_model=List[AppointmentOut])
def list_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)

@app.get("/appointments/{appointment_id}", response_model=AppointmentOut)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appt = crud.get_appointment(db, appointment_id)
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appt

@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_appointment(db, appointment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return
