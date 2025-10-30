from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, models

app = FastAPI()

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
