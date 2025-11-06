# app/database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import DATABASE_URL  # .env'den gelen URL

# SQLAlchemy engine oluştur
engine = create_engine(DATABASE_URL)

# Session sınıfı
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base sınıfı (tüm modeller buradan türetilir)
Base = declarative_base()
