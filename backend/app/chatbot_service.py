import os
import re
from datetime import datetime
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_community.utilities import SQLDatabase
from dotenv import load_dotenv

load_dotenv(override=True)

# Veritabanı bağlantı adresi
pg_uri = "postgresql+psycopg2://postgres:1234@localhost:5432/dentist_appointment_db"

db = SQLDatabase.from_uri(pg_uri, include_tables=['patients', 'appointments', 'users'])
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3)
current_date_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

# Sabit Genel Bilgiler Area
TR_HOSPITAL_INFO = """Yakın Doğu Üniversitesi Diş Hastanesi olarak sizlere en modern teknolojilerle hizmet vermekteyiz.

Bünyemizde Sunulan Tedaviler:
• İmplant Tedavisi (Dental Implant)
• Kanal Treati (Root Canal Treatment)
• Ortodonti (Tel Tedavisi)
• Diş Beyazlatma (Teeth Whitening)
• Pedodonti (Çocuk Diş Hekimliği)

🕒 Çalışma Saatlerimiz: Hafta içi 08:30 - 17:00 arasındadır. Hafta sonu hizmetimiz bulunmamaktadır.
*Ücretlendirme ve detaylı tedavi planlaması için klinik muayene yapılması gerekmektedir."""

EN_HOSPITAL_INFO = """Welcome to the Near East University Dental Hospital.

Our Specialized Treatments:
• Dental Implants
• Root Canal Treatment
• Orthodontics
• Teeth Whitening
• Pedodontics (Pediatric Dentistry)

🕒 Working Hours: Weekdays 08:30 - 17:00. Closed on weekends.
*Treatment planning requires a comprehensive clinical examination."""

if 'user_session' not in globals():
    user_session = {
        "step": "ASK_LANGUAGE",  
        "lang": "TR",            
        "full_name": "Guest / Misafir",
        "phone": None,
        "is_authenticated": False
    }

def try_inline_authentication(text_input):
    global user_session
    match = re.search(r"([^,]+),\s*([\d\s\-\+]+)", text_input)
    if match:
        name = match.group(1).strip()
        phone = match.group(2).strip()
        if len(name.split()) >= 2 and len(phone) >= 7:
            user_session["full_name"] = name
            user_session["phone"] = phone
            user_session["is_authenticated"] = True
            return True
    return False

def get_chatbot_response(user_query):
    global user_session
    query_clean = user_query.strip()
    query_lower = query_clean.lower()
    
    # ADIM 1: Dil Seçimi İsteme
    if user_session["step"] == "ASK_LANGUAGE":
        if query_clean in ["1", "en", "English", "english", "EN"]:
            user_session["lang"] = "EN"
            user_session["step"] = "MAIN_FLOW"
            return "Language set to English. Welcome to the Near East University Dental Hospital!\n\n👉 Please type the number of your action:\n1️⃣ Check my current appointments\n2️⃣ Doctor availability and empty hours\n3️⃣ General treatment types and information"
        elif query_clean in ["2", "tr", "Türkçe", "turkce", "TR", "türkçe"]:
            user_session["lang"] = "TR"
            user_session["step"] = "MAIN_FLOW"
            return "Dil Türkçe olarak ayarlandı. Yakın Doğu Üniversitesi Diş Hastanesi'ne hoş geldiniz!\n\n👉 Lütfen yapmak istediğiniz işlemin numarasını yazınız:\n1️⃣ Mevcut Randevularımı Sorgulama\n2️⃣ Doktor Boşlukları ve Müsait Saatleri Öğrenme\n3️⃣ Tedavi Çeşitleri ve Hastane Bilgisi Alma"
        else:
            return "Please select your language / Lütfen iletişim dilinizi seçiniz:\n👉 Type '1' for English\n👉 Türkçe için '2' yazınız"

    # GİRİŞ YAPMA TALEBİ KONTROLÜ
    if any(kw in query_lower for kw in ["giriş yap", "giris yap", "log in", "login"]):
        if user_session.get("lang") == "TR":
            return "Harika! Kimliğinizi doğrulamak için lütfen Adınızı, Soyadınızı ve Telefon numaranızı aralarında virgül olacak şekilde yazınız. (Örn: Mehmet Kayaoglu, 05443332211)"
        return "Perfect! To authenticate, please provide your Full Name and Phone Number separated by a comma. (e.g., John Doe, 05443332211)"

    # Giriş doğrulaması
    if not user_session["is_authenticated"] and (len(query_clean.split(',')) == 2):
        if try_inline_authentication(query_clean):
            if user_session.get("lang") == "TR":
                return f"Giriş başarılı! Tekrar hoş geldiniz Sayın {user_session['full_name']}.\n\n👉 Şimdi yapmak istediğiniz işlem numarasını (1, 2 veya 3) yazabilir ya da sorunuzu doğrudan iletebilirsiniz."
            return f"Authentication successful! Welcome back, {user_session['full_name']}.\n\n👉 Now you can select your action (1, 2 or 3) or ask your question directly."

    # GÜVENLİK FİLTRESİ
    if any(keyword in query_lower for keyword in ["password", "şifre", "sifre", "parola"]):
        return "Gizlilik ve güvenlik politikalarımız gereği, sistem erişim bilgileri paylaşılamaz." if user_session.get("lang") == "TR" else "Credentials cannot be shared due to privacy policies."

    # Doktor Kadrosu İsim Listesi
    has_doctor_mention = any(name in query_lower for name in ["elif", "demir", "ahmet", "kaya", "zeynep", "arslan", "mehmet", "yildiz", "yıldız", "ayşe", "ayse", "çelik", "celik", "can", "özkan", "ozkan"])

    # 🎯 NET NİYET BELİRLEME
    if query_clean == "1" or any(kw in query_lower for kw in ["randevu", "randevum", "saatimi", "saatim", "ne zaman", "appointment", "appointments", "my schedule", "when is my"]):
        intent = "MY_APPOINTMENTS"
    elif query_clean == "2" or has_doctor_mention or any(kw in query_lower for kw in ["boş", "müsait", "bosluk", "boşluk", "saatleri", "saatleti", "doktor", "dr"]):
        intent = "DOCTOR_AVAILABILITY"
    else:
        intent = "GENERAL_CHAT"

    # -------------------------------------------------------------------------
    # SEÇENEK 1: KENDİ RANDEVULARINI SORGULAMA
    # -------------------------------------------------------------------------
    if intent == "MY_APPOINTMENTS":
        if not user_session["is_authenticated"]:
            return "Kişisel randevularınızı görebilmeniz için önce giriş yapmanız gerekmektedir. Lütfen 'Giriş yap' yazarak kimliğinizi doğrulayınız." if user_session.get("lang") == "TR" else "To see your personal appointments, please type 'Log in' first."

        try:
            safe_name = user_session["full_name"].replace("'", "''")
            raw_sql = f"""
                SELECT a.appointment_time, a.department, u.full_name AS doctor_name 
                FROM appointments AS a
                JOIN patients AS p ON a.patient_id = p.id
                LEFT JOIN users AS u ON a.doctor_id = u.id
                WHERE p.name = '{safe_name}' AND a.is_deleted = FALSE
                ORDER BY a.appointment_time;
            """
            db_results = db.run(raw_sql)
            
            if not db_results or db_results == "[]" or db_results == "":
                if user_session.get("lang") == "TR":
                    return f"Sayın {user_session['full_name']}, sistemde adınıza kayıtlı aktif bir gelecek randevusu bulunamadı."
                return f"Dear {user_session['full_name']}, no active upcoming appointments were found in our system."
            
            clean_res = db_results.replace("[(", "").replace(")]", "")
            parts = clean_res.split("',")
            
            date_match = re.search(r"datetime\.datetime\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)", parts[0])
            if date_match:
                y, m, d, hr, mn = date_match.groups()
                formatted_date = f"{d.zfill(2)}/{m.zfill(2)}/{y} saat {hr.zfill(2)}:{mn.zfill(2)}"
            else:
                formatted_date = "Belirtilmeyen bir tarihte"
                
            dept = parts[1].replace("'", "").strip() if len(parts) > 1 else "Genel Klinik"
            if "General Dentistry" in dept or "None" in dept:
                dept = "Genel Diş Hekimliği"
            elif "Orthodontics" in dept:
                dept = "Ortodonti"
            
            doctor_name = "Henüz Atanmadı"
            if len(parts) > 2:
                doc_clean = parts[2].replace("'", "").replace("None", "").strip()
                if doc_clean and doc_clean != "None":
                    doctor_name = doc_clean

            if user_session.get("lang") == "TR":
                return f"🗓️ **Randevu Bilgileriniz Bulundu Sayın {user_session['full_name']}:**\n\n• **Tarih:** {formatted_date}\n• **Bölüm:** {dept}\n• **Hekim:** {doctor_name}\n• **Durum:** Aktif / Onaylandı\n\n*Yakın Doğu Üniversitesi Diş Hastanesi sağlıklı günler diler!*"
            else:
                return f"🗓️ **Appointment Details Found for {user_session['full_name']}:**\n\n• **Date:** {formatted_date}\n• **Department:** {dept}\n• **Doctor:** {doctor_name}\n• **Status:** Active / Confirmed\n\n*Have a healthy day!*"
                
        except Exception as e:
            return f"🗓️ **Randevu Bilgileriniz Veritabanından Çekildi Sayın {user_session['full_name']}:**\n\n{db_results}"

    # -------------------------------------------------------------------------
    # SEÇENEK 2: DOKTOR SORGULAMA KANALI
    # -------------------------------------------------------------------------
    if intent == "DOCTOR_AVAILABILITY":
        current_lang = user_session.get("lang", "TR")

        if query_clean == "2" and not has_doctor_mention:
            try:
                doc_sql = "SELECT full_name FROM users WHERE role = 'doctor' AND is_deleted = FALSE ORDER BY full_name;"
                db_docs = db.run(doc_sql)
                clean_docs = db_docs.replace("[('", "").replace("',), ('", "\n• ").replace("',)]", "")
                if not clean_docs or clean_docs == "[]":
                    clean_docs = "Dr. Ahmet Kaya\n• Dr. Ayşe Çelik\n• Dr. Can Özkan\n• Dr. Elif Demir\n• Dr. Mehmet Yıldız\n• Dr. Zeynep Arslan"
                else:
                    clean_docs = "• " + clean_docs

                if current_lang == "TR":
                    return f"👩‍⚕️👨‍⚕️ **Hastanemizde Görevli Aktif Hekimlerimiz:**\n\n{clean_docs}\n\n👉 Müsaitlik durumunu ve boş saatlerini öğrenmek istediğiniz hekimimizin adını yazabilirsiniz. (Örn: *Can Özkan*)"
                else:
                    return f"👩‍⚕️👨‍⚕️ **Our Active Medical Staff:**\n\n{clean_docs}\n\n👉 Please type the name of the doctor whose availability you'd like to check. (e.g., *Can Ozkan*)"
            except:
                if current_lang == "TR":
                    return "👩‍⚕️👨‍⚕️ **Hastanemizde Görevli Aktif Hekimlerimiz:**\n\n• Dr. Ahmet Kaya\n• Dr. Ayşe Çelik\n• Dr. Can Özkan\n• Dr. Elif Demir\n• Dr. Mehmet Yıldız\n• Dr. Zeynep Arslan\n\n👉 Boş saatlerini öğrenmek istediğiniz hekimimizin adını doğrudan yazabilirsiniz."
                return "👩‍⚕️👨‍⚕️ **Our Active Medical Staff:**\n\n• Dr. Ahmet Kaya\n• Dr. Ayşe Çelik\n• Dr. Can Özkan\n• Dr. Elif Demir\n• Dr. Mehmet Yıldız\n• Dr. Zeynep Arslan\n\n👉 Please type the name of the doctor directly to see empty hours."

        # AŞAMA B: Belirli bir doktor ismi algılandıysa boş slotları ara
        try:
            doctor_filter = ""
            detected_doctor = "Dr. Mehmet Yıldız"
            
            if "elif" in query_lower or "demir" in query_lower:
                doctor_filter = "AND u.full_name ILIKE '%Elif%'"
                detected_doctor = "Dr. Elif Demir"
            elif "ahmet" in query_lower or "kaya" in query_lower:
                doctor_filter = "AND u.full_name ILIKE '%Ahmet%'"
                detected_doctor = "Dr. Ahmet Kaya"
            elif "zeynep" in query_lower or "arslan" in query_lower:
                doctor_filter = "AND u.full_name ILIKE '%Zeynep%'"
                detected_doctor = "Dr. Zeynep Arslan"
            elif "mehmet" in query_lower or "yildiz" in query_lower or "yıldız" in query_lower:
                doctor_filter = "AND u.full_name ILIKE '%Mehmet%'"
                detected_doctor = "Dr. Mehmet Yıldız"
            elif "ayşe" in query_lower or "ayse" in query_lower or "çelik" in query_lower or "celik" in query_lower:
                doctor_filter = "AND u.full_name ILIKE '%Ay%' AND u.full_name ILIKE '%Ç%'"
                detected_doctor = "Dr. Ayşe Çelik"
            elif "can" in query_lower or "ozkan" in query_lower or "özkan" in query_lower:
                doctor_filter = "AND (u.full_name ILIKE '%Can%' OR u.full_name ILIKE '%Özkan%')"
                detected_doctor = "Dr. Can Özkan"
            
            raw_sql = f"""
                SELECT a.appointment_time, a.department
                FROM appointments AS a
                JOIN users AS u ON a.doctor_id = u.id
                WHERE a.patient_id IS NULL AND a.is_deleted = FALSE {doctor_filter}
                ORDER BY a.appointment_time ASC
                LIMIT 5;
            """
            db_results = db.run(raw_sql)

            if not db_results or db_results == "[]" or db_results == "":
                if current_lang == "TR":
                    return f"Sistem Kontrolü: {detected_doctor} için şu anda online rezerve edilebilir boş slot bulunmamaktadır. Lütfen daha sonra tekrar deneyiniz."
                return f"System Check: There are currently no available online slots for {detected_doctor}. Please try again later."

            # Yapay zekanın patlamaması için python katmanında tarihleri regex ile bulup temiz bir metne döküyoruz 🛠️
            dates_found = re.findall(r"datetime\.datetime\((\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)", db_results)
            
            if dates_found:
                # Ham SQL verisini temiz, okunabilir metne çevirdik!
                formatted_slots = []
                for y, m, d, hr, mn in dates_found:
                    formatted_slots.append(f"📅 {d.zfill(2)}/{m.zfill(2)}/{y} - ⏰ {hr.zfill(2)}:{mn.zfill(2)}")
                slots_text = "\n".join(formatted_slots)
                
                if current_lang == "TR":
                    return f"👩‍⚕️ {detected_doctor} için bulunan müsait randevu saatleri aşağıdadır:\n\n{slots_text}\n\n*Randevunuzu kesinleştirmek için web arayüzümüzü kullanabilirsiniz.*"
                else:
                    return f"👩‍⚕️ Available appointment slots for {detected_doctor}:\n\n{slots_text}\n\n*You can book these slots via our web interface.*"

            # Eğer tarihler ayıklanamazsa güvenli liman olarak LLM promptunu tetikle
            interpretation_prompt = f"""
            You are the medical scheduler chatbot at 'Yakın Doğu Üniversitesi Diş Hastanesi'.
            Language Status: {current_lang} (CRITICAL: Write in this language!)
            Current Time: {current_date_str}
            Doctor: {detected_doctor}
            Available Slots: "{db_results}"
            
            Format the available dates/hours cleanly. Do not use asterisks (*) for formatting.
            """
            return llm.invoke(interpretation_prompt).content.strip()
        except:
            if user_session.get("lang", "TR") == "TR":
                return "Seçtiğiniz hekimimizin randevu durumları şu anda güncellenmektedir. Lütfen daha sonra tekrar deneyiniz."
            return "The schedule for the selected doctor is currently being updated. Please try again later."

    # -------------------------------------------------------------------------
    # SEÇENEK 3 & GENEL CHAT
    # -------------------------------------------------------------------------
    return TR_HOSPITAL_INFO if user_session.get("lang") == "TR" else EN_HOSPITAL_INFO