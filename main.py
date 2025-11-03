from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
import crud, models
from datetime import datetime

app = FastAPI()

#Base.metadata.create_all(bind=engine) // artik tablolari alembic ile migration olusturup uygulayacagiz.

#Veritabanı bağlantısı (Dependency)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Welcome to the Appointment System!"}

#patients endpoints
@app.post("/patients/")
def create_patient(name: str, phone: str, db: Session = Depends(get_db)):
    patient = crud.create_patient(db, name=name, phone=phone)
    return {"id": patient.id, "name": patient.name, "phone": patient.phone}

@app.get("/patients/")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(models.Patient).all()
    return patients

@app.put("/patients/{patient_id}")
def update_patient(patient_id: int, name: str, phone: str, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.name = name
    patient.phone = phone
    db.commit()
    db.refresh(patient)
    return patient

@app.delete("/patients/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    db.delete(patient)
    db.commit()
    return {"detail": "Patient deleted"}

#appointments endpoints
@app.post("/appointments/")
def create_appointment(patient_id: int, doctor_name: str, appointment_time: datetime, db: Session = Depends(get_db)):
    appointment = crud.create_appointment(db, patient_id=patient_id, doctor_name=doctor_name, appointment_time=appointment_time)
    return {
        "id": appointment.id,
        "doctor_name": appointment.doctor_name,
        "appointment_time": appointment.appointment_time,
        "status": appointment.status
    }

@app.get("/appointments/")
def get_appointments(db: Session = Depends(get_db)):
    return crud.get_appointments(db)

@app.get("/appointments/{appointment_id}")
def get_appointment_by_id(appointment_id: int, db: Session = Depends(get_db)):
    appointment = crud.get_appointment_by_id(db, appointment_id=appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.put("/appointments/{appointment_id}")
def update_appointment(appointment_id: int, status: str, db: Session = Depends(get_db)):
    updated = crud.update_appointment(db, appointment_id=appointment_id, status=status)
    if not updated:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return updated

@app.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    deleted = crud.delete_appointment(db, appointment_id=appointment_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return {"detail": "Appointment deleted"}
