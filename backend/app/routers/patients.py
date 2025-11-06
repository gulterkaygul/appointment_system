from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import crud, schemas

router = APIRouter(
    prefix="/patients",
    tags=["patients"]
)

# Dependency: veri tabanı oturumu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Tüm hastaları listele
@router.get("/", response_model=list[schemas.PatientRead])
def read_patients(db: Session = Depends(get_db)):
    return crud.get_patients(db)

# Yeni hasta ekle
@router.post("/", response_model=schemas.PatientRead)
def create_patient(db: Session, patient: schemas.PatientCreate):
    new_patient = models.Patient(name=patient.name, phone=patient.phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

# ID ile hasta getir
@router.get("/{patient_id}", response_model=schemas.PatientRead)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

# ID ile hasta sil
@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    result = crud.delete_patient(db, patient_id)
    if not result:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted successfully"}
