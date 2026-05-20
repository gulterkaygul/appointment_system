from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import traceback

from app.database import SessionLocal
from app import crud, schemas, models
from app.security import admin_required, create_reset_token, hash_password
from app.utils.email import send_reset_email

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


# POST create patient + AUTOMATIC USER CREATION & EMAIL SEND 🔥
# 💥 DÜZELTME: Fonksiyonu 'async def' yaptık!
@router.post("/", response_model=schemas.PatientRead)
async def create_patient(
    patient: schemas.PatientCreate,
    db: Session = Depends(get_db)
):
    patient_email = patient.email.strip() if patient.email else None

    if not patient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Email address is required for registration."
        )

    # 1. Önceden bu e-posta adresiyle açılmış hasta veya kullanıcı var mı kontrol et
    existing_patient = db.query(models.Patient).filter(models.Patient.email == patient_email).first()
    existing_user = db.query(models.User).filter(models.User.email == patient_email).first()
    
    if existing_patient or existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="This email address is already registered in the system. Please use a different email."
        )

    try:
        # 2. Patients Tablosuna Ekleme Yap
        new_patient = models.Patient(
            name=patient.name,
            phone=patient.phone,
            email=patient_email
        )
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        print(f"✅ [DATABASE] Patient successfully created with ID: {new_patient.id}")

        # 3. Users Tablosuna Ekleme Yap
        new_user = models.User(
            email=patient_email,
            password_hash=hash_password("Temporary123!"), 
            role="patient"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"✅ [DATABASE] User credentials successfully tied for: {patient_email}")

    except Exception as db_err:
        db.rollback()
        print(f"❌ [DATABASE ERROR] Verification failed: {str(db_err)}")
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail="Database synchronization error occurred."
        )

    try:
        print(f"🔄 [TOKEN] Generating standard token for {patient_email}...")
        token = create_reset_token(patient_email) 
        
        print("\n" + "="*70)
        print(f"🔥 SÜPER AKTİVASYON LİNKİ BURADA! TARAYICIYA YAPIŞTIR:\nhttp://localhost:5173/reset-password?token={token}")
        print("="*70 + "\n")
        
        print(f"🔄 [SMTP] Attempting to fire email via Mailtrap...")
        # 💥 EN KRİTİK DÜZELTME: Eğer email fonksiyonun async ise önüne 'await' gelmeli!
        # Hem normal hem async senkronizasyonu için burayı güvenli çağırıyoruz:
        import inspect
        if inspect.iscoroutinefunction(send_reset_email):
            await send_reset_email(patient_email, token, "patient")
        else:
            send_reset_email(patient_email, token, "patient")
            
        print(f"🚀 [MAILTRAP SUCCESS] Activation trigger sent to {patient_email}")
    except Exception as email_err:
        print(f"❌ [CRITICAL MAIL PIPELINE ERROR] Token or SMTP crashed: {str(email_err)}")
        traceback.print_exc() 

    return new_patient


# PUT update patient (ADMIN)
@router.put("/{patient_id}", response_model=schemas.PatientRead)
def update_patient(
    patient_id: int,
    patient_update: schemas.PatientCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(admin_required),
):
    db_patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not db_patient:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    db_patient.name = patient_update.name
    db_patient.phone = patient_update.phone
    
    if patient_update.email:
        db_patient.email = patient_update.email.strip()

    try:
        db.commit()
        db.refresh(db_patient)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return db_patient


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