import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain

# 1. API Key Ayarı
os.environ["GOOGLE_API_KEY"] = "AIzaSyB3Hbg9DzFKRfg7ImeR0xm-8wSZnab_reE"

# 2. PostgreSQL Bağlantı Bilgileri
DB_USER = "postgres"  
DB_PASSWORD = "1234" 
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "dentist_appointment_db"

pg_uri = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Veritabanı bağlantısı (include_tables ve schema PostgreSQL için önemli)
db = SQLDatabase.from_uri(
    pg_uri, 
    include_tables=['patients', 'appointments', 'users']
)

# 1. Seçenek (En hafif ve kota dostu olan):
#llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite-001", temperature=0)

#yukaridaki calismazsa bunu dene (daha yeni bir önizleme):
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=0)

# 4. Bilingual Context (Hastaneye özel kurallar)
hospital_context = """
You are a professional AI Assistant for a Dental Hospital.
You have access to a PostgreSQL database with 'public.patients', 'public.appointments', and 'public.users' tables.

Rules:
1. In the 'users' table, rows where role='doctor' are doctors.
2. If the user asks in English, respond in English. If in Turkish, respond in Turkish.
3. NEVER share or query 'password_hash' or any sensitive user credentials.
4. If information is not found, politely state that you couldn't find any record.
5. Be professional, polite, and brief.

Veritabanı detayları:
- 'users.full_name' doktor ve kullanıcı isimleridir.
- 'patients.name' hasta isimleridir.
- 'appointments.department' branş bilgisidir (Örn: Orthodontics).
"""

# 5. SQL Chain Oluşturma
db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)

def get_chatbot_response(user_query):
    try:
        # Sorguyu context ile birleştiriyoruz
        # 'run' yerine güncel olan 'invoke' metodunu kullanıyoruz
        full_query = f"{hospital_context}\nQuestion/Soru: {user_query}"
        
        # langchain-experimental sürümüne göre sonuç 'result' anahtarında döner
        response = db_chain.invoke({"query": full_query})
        
        return response["result"]
    
    except Exception as e:
        # Hatayı terminalde detaylı görmek için
        print(f"Chatbot Error: {e}")
        return "I'm having trouble connecting to the database system. / Şu an veritabanı sistemine bağlanırken bir sorun yaşıyorum."