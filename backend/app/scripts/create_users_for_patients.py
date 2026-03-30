from app.database import SessionLocal
from app.models import Patient, User
from app.security import hash_password

db = SessionLocal()

patients = db.query(Patient).all()

for patient in patients:
    if patient.user_id:
        continue

    base_email = patient.name.lower().replace(' ', '')
    email = f"{base_email}@patient.com"

    #EMAIL VAR MI KONTROL ET
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        patient.user_id = existing_user.id
        db.commit()
        print(f"Linked existing user for {patient.name}")
        continue

    # YENİ USER OLUŞTUR
    user = User(
        full_name=patient.name,
        email=email,
        password_hash=hash_password("123456"),
        role="patient"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    patient.user_id = user.id
    db.commit()

    print(f"Created user for {patient.name} -> {email}")

db.close()