from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import traceback

from app.database import get_db
from app.models import Patient, Appointment, User
from app.schemas import PublicAppointmentCreate
from app.security import hash_password, create_reset_token
from app.utils.email import send_reset_email

router = APIRouter(
    prefix="/public",
    tags=["public"]
)

@router.post("/appointments")
def create_public_appointment(
    data: PublicAppointmentCreate,
    db: Session = Depends(get_db)
):
    print("\n" + "🔥" * 20)
    print(f"🚀 [PUBLIC ROUTER] Form tetiklendi! Hasta: {data.patient_name}, Mail: {data.email}")

    # 1. Hasta var mı kontrol et (Mail adresi üzerinden kontrol etmek daha sağlıklı)
    patient = db.query(Patient).filter(
        Patient.phone == data.patient_phone,
        Patient.is_deleted == False
    ).first()

    # 2. Yeni hasta ise kayıt et, User oluştur ve mail at
    if not patient:
        print(f"💡 [PUBLIC] Yeni hasta algılandı ({data.email}). Kayıt başlıyor...")
        try:
            # Hasta tablosuna kayıt
            patient = Patient(
                name=data.patient_name,
                phone=data.patient_phone,
                email=data.email # FORM GİRİŞİ KULLANILIYOR
            )
            db.add(patient)
            db.commit()
            db.refresh(patient)
            print(f"✅ Patient tablosuna yazıldı. ID: {patient.id}")

            # User (Giriş Kimliği) tablosuna kayıt
            existing_user = db.query(User).filter(User.email == data.email).first()
            if not existing_user:
                new_user = User(
                    email=data.email, # FORM GİRİŞİ KULLANILIYOR
                    password_hash=hash_password("Temporary123!"),
                    role="patient"
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)
                print(f"✅ User tablosuna kimlik bağlandı: {data.email}")

                # ŞİFRE OLUŞTURMA MAİLİ
                try:
                    token = create_reset_token(data.email)
                    send_reset_email(data.email, token, "patient") # FORM GİRİŞİ KULLANILIYOR
                    print(f"🚀 [MAILTRAP SUCCESS] Şifre maili başarıyla gitti: {data.email}")
                except Exception as email_err:
                    print(f"❌ [MAIL ERROR]: {str(email_err)}")

        except Exception as db_err:
            db.rollback()
            print(f"❌ [DATABASE ERROR]: {str(db_err)}")
            raise HTTPException(status_code=500, detail="Database registration error.")
    else:
        print("⚠️ [PUBLIC] Hasta zaten kayıtlı.")

    # 3. Doktor Kontrolü (Daha önce konuştuğumuz 6 doktordan biri mi?)
    db_doctor = db.query(User).filter(User.id == data.doctor_id, User.role == "doctor").first()
    if not db_doctor:
        fallback = db.query(User).filter(User.role == "doctor").first()
        data.doctor_id = fallback.id
        print(f"💡 [DOKTOR] ID bulunamadı, {fallback.id} ID'li doktora atandı.")

    # 4. Randevu oluştur
    appointment = Appointment(
        patient_id=patient.id,
        doctor_id=data.doctor_id,
        department=data.department,
        appointment_time=data.appointment_time,
        complaint=data.complaint,
        status="planned"
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    return {"message": "Appointment request created successfully", "appointment_id": appointment.id}