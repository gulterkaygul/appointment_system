import smtplib
from email.mime.text import MIMEText

def send_reset_email(to_email: str, token: str, role: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}&type={role}"

    html_content = f"""
    <html>
        <body style="font-family: sans-serif; text-align: center;">
            <h3 style="color: #7f1d1d;">Password Reset Request</h3>
            <p>You requested a password reset for your {role} account.</p>
            <p>Click the button below to authorize your new credentials:</p>
            <div style="margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #7f1d1d; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase;">
                    Authorize Update
                </a>
            </div>
        </body>
    </html>
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = "Security Override: Password Reset"
    msg["From"] = "noreply@clinic.com"
    msg["To"] = to_email

    # 🔥 TRY-EXCEPT BLOĞUNU KALDIRDIK! HATA NEBEYSE TERMİNALE PATLAYACAK!
    # Eğer port engeli varsa alternatif port olan 2525'i deniyoruz:
    server = smtplib.SMTP("sandbox.smtp.mailtrap.io", 2525) 
    server.starttls()

    username = "7f388a3f874fd6" 
    password = "473775a81bd33b"

    server.login(username, password)
    server.send_message(msg)
    server.quit()
    print(f"🚀 [SMTP SUCCESS] Mailtrap'e mail başarıyla fırlatıldı! Alıcı: {to_email}")