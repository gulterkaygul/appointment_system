import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from langchain_experimental.sql import SQLDatabaseChain
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Settings and Connections
os.environ["GOOGLE_API_KEY"] = "AIzaSyB3Hbg9DzFKRfg7ImeR0xm-8wSZnab_reE"

DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME = "postgres", "1234", "localhost", "5432", "dentist_appointment_db"
pg_uri = f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

db = SQLDatabase.from_uri(pg_uri, include_tables=['patients', 'appointments', 'users'])
llm = ChatGoogleGenerativeAI(model="gemini-3.1-flash-lite-preview", temperature=0)

# 2. 🔐 SQL PROMPT WITH SECURITY, PHONE, AND EMAIL AUTOMATION RULES
sql_template = """
You are an expert data assistant for 'Özel Diş Hastanesi' (Private Dental Hospital).
Your job is to convert the user's request into a valid PostgreSQL query and return the final natural language answer.

CRITICAL TONE & LANGUAGE RULES:
1. You MUST ALWAYS reply in ENGLISH.
2. When confirming a newly created appointment or talking about a patient, you MUST ALWAYS address them politely using "Dear [Patient Name]". For example: "Dear Cem Ak, your appointment has been successfully created..." or "Dear [Name], ...". Never skip the word "Dear".

CRITICAL DATA & SECURITY RULES:
1. When inserting a new patient into the 'patients' table, you MUST provide a valid string for the 'phone' field using the phone number provided by the user.
2. If the 'patients' table requires an 'email' field, automatically generate a dummy email based on the patient's name (e.g., for "Cem Ak", use "cem.ak@example.com") and insert it so the database constraints do not fail.
3. NEVER, UNDER ANY CIRCUMSTANCES, write a query that selects passwords, hashes, tokens, or credentials from 'users', 'patients', or any other table.
4. If the user explicitly asks for passwords, credentials, or pins, DO NOT execute any SQL query. Instead, your SQLQuery output must be exactly: "SECURITY_BLOCK"
5. If the user wants to book an appointment, write a valid INSERT statement into 'appointments'.
6. Always return a polite English answer.

Database Tables: {table_info}
Question: {input}
SQLQuery: """

CUSTOM_PROMPT = PromptTemplate(input_variables=["input", "table_info"], template=sql_template)
db_chain = SQLDatabaseChain.from_llm(llm, db, prompt=CUSTOM_PROMPT, verbose=True, use_query_checker=True)

# -------------------------------------------------------------------------
# 🚀 3. SECURE & FLEXIBLE ANALYSIS MECHANISM (ENGLISH VERSION)
# -------------------------------------------------------------------------
def get_chatbot_response(user_query):
    query_lower = user_query.lower().strip()
    
    # 🛑 SECURITY FILTER (Code-Level Protection)
    dangerous_keywords = ["password", "şifre", "sifre", "parola", "credential", "token", "hash", "pin"]
    if any(keyword in query_lower for keyword in dangerous_keywords):
        return "Due to our privacy and security policies, user passwords or personal access credentials can never be shared or displayed."

    # 🌟 GREETING FILTER
    greeting_keywords = ["hello", "hi", "hey", "hii", "hiii", "greetings", "selam", "merhaba", "slm"]
    if query_lower in greeting_keywords:
        return "Hello! I am your Dental Hospital Assistant. How can I help you today? You can ask about appointment bookings or hospital information."
        
    # 🌸 POLITENESS & THANK YOU FILTER
    thanks_keywords = ["thank you", "thanks", "thx", "thank you so much", "tesekkurler", "teşekkürler"]
    if query_lower in thanks_keywords:
        return "You're very welcome! It was a pleasure helping you. We wish you a healthy and happy day! Let me know if you need anything else."

    # 📅 INITIAL APPOINTMENT REQUEST FILTER (Şimdi telefon numarasını da istiyor!)
    if ("appointment" in query_lower or "book" in query_lower or "randevu" in query_lower) and not any(char.isdigit() for char in query_lower):
        return "I would be happy to help you book an appointment. Please provide the following details separated by commas: Patient Full Name, Phone Number, Doctor Name, Desired Date and Time. (e.g., Cem Ak, 05551234567, Dr. Ahmet Kaya, 2026-06-02 14:00)"

    # AI Smart Decision Mechanism
    analysis_prompt = f"""
    Analyze the user's message for a hospital chatbot: "{user_query}"
    Determine the intent and output EXACTLY ONE of these words:
    
    - RANDEVU_KAYIT: If the user is directly providing appointment details (e.g., names, phone number, doctor, date/time like "Cem Ak, 05551234567, Ahmet Kaya, 2026-06-02 14:00").
    - VERITABANI: If the user is asking for hospital statistics, doctor counts, or info.
    
    Output only the word RANDEVU_KAYIT or VERITABANI. Do not write anything else.
    """
    
    try:
        chain = llm | StrOutputParser()
        decision = chain.invoke(analysis_prompt).strip().upper()
        
        print(f"--- [SMART ANALYSIS] Query: {user_query} | Decision: {decision} ---")
        
        if "RANDEVU_KAYIT" in decision or "VERITABANI" in decision:
            response = db_chain.invoke({"query": user_query})
            result_text = str(response.get("result", ""))
            
            # 🛑 SECURITY FILTER 2 (AI Block Check)
            if "SECURITY_BLOCK" in result_text or "password" in result_text.lower() or "şifre" in result_text.lower():
                return "Due to security regulations, sharing password or credential information is strictly prohibited."
            
            # ✨ SQL CLEANING WIZARD
            if "Answer:" in result_text:
                result_text = result_text.split("Answer:")[-1].strip()
                
            return result_text if result_text else "I could not process your request at the moment."
            
        else:
            return "I couldn't quite understand your request. Please specify your question or appointment details clearly."

    except Exception as e:
        print(f"❌ [SYSTEM ERROR] {str(e)}")
        if any(keyword in query_lower for keyword in dangerous_keywords):
            return "Access denied for security reasons."
            
        try:
            response = db_chain.invoke({"query": user_query})
            result_text = str(response.get("result", ""))
            if "Answer:" in result_text:
                result_text = result_text.split("Answer:")[-1].strip()
            return result_text if result_text else "I am unable to perform this operation right now."
        except Exception as db_err:
            print(f"❌ [CHAIN ERROR] {str(db_err)}")
            return "Something went wrong. Please check your details and try again."