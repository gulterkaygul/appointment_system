import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain_core.prompts import PromptTemplate

# 1. API Key Ayarı
os.environ["GOOGLE_API_KEY"] = "AIzaSyB3Hbg9DzFKRfg7ImeR0xm-8wSZnab_reE"

# 2. PostgreSQL Bağlantı Bilgileri
DB_USER = "postgres"  
DB_PASSWORD = "1234" 
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "dentist_appointment_db"

pg_uri = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Veritabanı bağlantısı
db = SQLDatabase.from_uri(
    pg_uri, 
    include_tables=['patients', 'appointments', 'users']
)

# Model seçimi (Hafif ve hızlı olan lite-preview modelini kullanıyoruz)
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=0)

# 3. Gelişmiş ve Yetenekli Prompt Taslağı
template = """
You are a professional, polite, and helpful AI Assistant for 'Özel Diş Hastanesi' (Private Dental Hospital).
You have access to a PostgreSQL database to manage patients, appointments, and doctors.

RULES:
1. LANGUAGE MATCHING: Respond in the SAME language as the user's question. 
   - If the question is in Turkish, respond in professional Turkish.
   - If the question is in English, respond in professional English.
2. PROFESSIONALISM: Never give just a number. (e.g., instead of "5", say "There are 5 doctors registered in our system.")
3. DATA PRIVACY: NEVER query or share sensitive data like 'password_hash' or secret keys.
4. NO DATA FOUND: If no information is found, say "I couldn't find any record matching your criteria" in the user's language.
5. WRITING AUTHORITY: You are authorized to create new records (INSERT) or update existing ones if the user provides necessary details (name, phone, department, etc.).

Database Tables: {table_info}

Question: {input}
SQLQuery: """

CUSTOM_PROMPT = PromptTemplate(
    input_variables=["input", "table_info"], 
    template=template
)

# 4. SQL Chain Oluşturma (Yazma yetkisi aktif edildi)
db_chain = SQLDatabaseChain.from_llm(
    llm, 
    db, 
    prompt=CUSTOM_PROMPT, 
    verbose=True,
    use_query_checker=True,
    # allow_dangerous_requests=True # Yazma (INSERT/UPDATE) yetkisi için kritik!
)

def get_chatbot_response(user_query):
    try:
        # invoke metodu ile sorguyu gönderiyoruz
        response = db_chain.invoke({"query": user_query})
        
        return response["result"]
    
    except Exception as e:
        # Hatayı terminalde detaylı görmek için
        print(f"Chatbot Error: {e}")
        return "I'm having trouble connecting to the database system. / Şu an veritabanı sistemine bağlanırken bir sorun yaşıyorum."