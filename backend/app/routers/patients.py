from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import crud, schemas, models

router = APIRouter(
    prefix="/patients",
    tags=["patients"]
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET all patients
@router.get("/", response_model=list[schemas.PatientRead])
def read_patients(db: Session = Depends(get_db)):
    return crud.get_patients(db)

# POST create patient
@router.post("/", response_model=schemas.PatientRead)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db)
):
    new_patient = models.Patient(name=patient.name, phone=patient.phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

#Put patients
@router.put("/{patient_id}", response_model=schemas.PatientRead)
def update_patient(
    patient_id: int,
    patient_update: schemas.PatientCreate,
    db: Session = Depends(get_db)
):
    updated = crud.update_patient(
        db,
        patient_id=patient_id,
        name=patient_update.name,
        phone=patient_update.phone
    )

    if updated is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return updated

# GET patient by ID
@router.get("/{patient_id}", response_model=schemas.PatientRead)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = crud.get_patient(db, patient_id)
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return db_patient

# DELETE patient
@router.delete("/{patient_id}")
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    result = crud.delete_patient(db, patient_id)
    if not result:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted successfully"}
