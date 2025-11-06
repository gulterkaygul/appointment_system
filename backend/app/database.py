import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# .env dosyasini yukle
load_dotenv()

# .env içindeki DATABASE_URL değerini oku
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Engine oluştur
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session sınıfı
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base sınıfı (tüm modeller bundan türeyecek)
Base = declarative_base()