import os
from dotenv import load_dotenv

# .env dosyasını yükle
load_dotenv()

# Ortam değişkenlerini oku
DATABASE_URL = os.getenv("DATABASE_URL")
