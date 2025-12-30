from app.database import SessionLocal
from app.models import User
from app.security import hash_password   # 👈 BURASI ÖNEMLİ

db = SessionLocal()

doctors = [
    {
        "full_name": "Dr. Ahmet Kaya",
        "email": "ahmet.kaya@clinic.com",
        "password": "doctor123",
    },
    {
        "full_name": "Dr. Elif Demir",
        "email": "elif.demir@clinic.com",
        "password": "doctor123",
    },
    {
        "full_name": "Dr. Mehmet Yılmaz",
        "email": "mehmet.yilmaz@clinic.com",
        "password": "doctor123",
    },
    {
        "full_name": "Dr. Ayşe Çelik",
        "email": "ayse.celik@clinic.com",
        "password": "doctor123",
    },
    {
        "full_name": "Dr. Can Özkan",
        "email": "can.ozkan@clinic.com",
        "password": "doctor123",
    },
    {
        "full_name": "Dr. Zeynep Arslan",
        "email": "zeynep.arslan@clinic.com",
        "password": "doctor123",
    },
]

added = 0

for d in doctors:
    exists = db.query(User).filter(User.email == d["email"]).first()
    if exists:
        continue

    user = User(
        full_name=d["full_name"],
        email=d["email"],
        password_hash=hash_password(d["password"]),  # 👈 UYUMLU
        role="doctor",
    )
    db.add(user)
    added += 1

db.commit()
db.close()

print(f"✅ Doctors seeded successfully. Added: {added}")
