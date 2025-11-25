from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

from backend.app import crud, models
from backend.app.database import SessionLocal, engine
from backend.app.schemas import (
    PatientCreate,
    PatientRead,
    AppointmentCreate,
    AppointmentRead
)

# İç modüller
from backend.app import crud, models, schemas
from backend.app.database import SessionLocal, engine

# Eğer modelleri otomatik oluşturmak istiyorsan:
#models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Dentist Appointment System")

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- DB Dependency ----------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------- Root ----------
@app.get("/")
def home():
    return {"message": "Welcome to the Dentist Appointment System!"}


# ---------- Patients ----------
@app.post("/patients/", response_model=PatientRead, status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreate, db: Session = Depends(get_db)):
    new_patient = crud.create_patient(db, name=payload.name, phone=payload.phone)
    return new_patient


@app.get("/patients/", response_model=List[PatientRead])
def list_patients(db: Session = Depends(get_db)):
    return crud.get_patients(db)


@app.get("/patients/{patient_id}", response_model=PatientRead)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@app.put("/patients/{patient_id}", response_model=PatientRead)
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
@app.post("/appointments/", response_model=AppointmentRead)
def create_appointment(payload: AppointmentCreate, db: Session = Depends(get_db)):
    appt = crud.create_appointment(
        db=db,
        patient_id=payload.patient_id,
        doctor_name=payload.doctor_name,
        appointment_time=payload.appointment_time
    )
    return appt

@app.get("/appointments/", response_model=List[AppointmentRead])
def list_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)

@app.delete("/appointments/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_appointment(db, appointment_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return
