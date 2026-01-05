from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app import crud, schemas, models
from app.security import admin_required

router = APIRouter(
    prefix="/patients",
    tags=["patients"]
)

# DB Dependency

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# GET all patients (ADMIN)

@router.get("/", response_model=list[schemas.PatientRead])
def read_patients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    return crud.get_patients(db)


# POST create patient (ADMIN)

@router.post("/", response_model=schemas.PatientRead)
def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    new_patient = models.Patient(
        name=patient.name,
        phone=patient.phone
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient


# PUT update patient (ADMIN)

@router.put("/{patient_id}", response_model=schemas.PatientRead)
def update_patient(
    patient_id: int,
    patient_update: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    updated = crud.update_patient(
        db,
        patient_id=patient_id,
        name=patient_update.name,
        phone=patient_update.phone
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated


# GET patient by ID (ADMIN)

@router.get("/{patient_id}", response_model=schemas.PatientRead)
def read_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    patient = crud.get_patient(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


# DELETE patient (ADMIN)

@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    deleted = crud.delete_patient(db, patient_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"detail": "Patient deleted successfully"}
