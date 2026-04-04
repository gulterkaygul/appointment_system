from app.database import SessionLocal
from app.models import Patient, User
from app.security import hash_password, create_reset_token
from app.utils.email import send_reset_email
import uuid

db = SessionLocal()

# 1. Tüm hastaları getir
patients = db.query(Patient).all()

print(f"--- Processing {len(patients)} patients ---")

for patient in patients:
    # Eğer bu hastanın zaten bir User hesabı varsa atla
    if patient.user_id:
        print(f"Skipping {patient.name}: User already linked.")
        continue

    # 2. Randevu formundan gelen GERÇEK e-postayı al
    # Not: Eğer tablonuzda sütun adı farklıysa (örn: email_address), orayı güncelleyin.
    email = patient.email 

    if not email:
        print(f"⚠️ Warning: {patient.name} has no email in appointment form. Skipping...")
        continue

    # 3. Bu email ile zaten bir kullanıcı açılmış mı kontrol et (Unique kontrolü)
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        patient.user_id = existing_user.id
        db.commit()
        print(f"Linked existing user for {patient.name} ({email})")
        continue

    # 4. YENİ USER OLUŞTUR
    # Şifreyi rastgele yapıyoruz, kullanıcı maildeki linkle kendi şifresini seçecek.
    random_temp_pwd = str(uuid.uuid4())
    
    new_user = User(
        full_name=patient.name,
        email=email,
        password_hash=hash_password(random_temp_pwd),
        role="patient"
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        # 5. Patient tablosunu User ID ile eşle
        patient.user_id = new_user.id
        db.commit()

        # 6. MAILTRAP'E ŞİFRE BELİRLEME MAİLİ GÖNDER
        token = create_reset_token(new_user.email)
        send_reset_email(new_user.email, token, "patient")
        
        print(f"✅ Success: User created and email sent to {email}")

    except Exception as e:
        db.rollback()
        print(f"❌ Error for {patient.name}: {e}")

db.close()
print("--- Migration Finished ---")