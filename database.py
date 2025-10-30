from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL bağlantısı
SQLALCHEMY_DATABASE_URL = "postgresql://dentist_user:1234@localhost/dentist_appointment_db"

# Engine oluştur
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session sınıfı
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base sınıfı (tüm modeller bundan türeyecek)
Base = declarative_base()