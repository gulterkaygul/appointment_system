from sqlalchemy.orm import Session
from models import Patient

# Yeni bir hasta ekleme fonksiyonu
def create_patient(db: Session, name: str, phone: str):
    new_patient = Patient(name=name, phone=phone)
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient
