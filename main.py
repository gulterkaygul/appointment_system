from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
import crud, models

app = FastAPI()

Base.metadata.create_all(bind=engine)

# Veritabanı bağlantısı (Dependency)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Welcome to the Appointment System!"}

@app.post("/patients/")
def create_patient(name: str, phone: str, db: Session = Depends(get_db)):
    patient = crud.create_patient(db, name=name, phone=phone)
    return {"id": patient.id, "name": patient.name, "phone": patient.phone}

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