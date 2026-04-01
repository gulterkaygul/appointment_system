import smtplib
import os
from email.mime.text import MIMEText

# 1. Buraya 'role' parametresini ekledik (Dışarıdan gelecek)
def send_reset_email(to_email: str, token: str, role: str):
    # 2. Artık f-string içindeki {role} hata vermez, doğru çalışır
    reset_link = f"http://localhost:5173/reset-password?token={token}&type={role}"

    # HTML içerik
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
            <p style="font-size: 12px; color: #666;">If you didn't request this, you can safely ignore this email.</p>
        </body>
    </html>
    """

    msg = MIMEText(html_content, "html")
    msg["Subject"] = "Security Override: Password Reset"
    msg["From"] = "noreply@clinic.com"
    msg["To"] = to_email

    try:
        # Mailtrap Ayarları
        server = smtplib.SMTP("sandbox.smtp.mailtrap.io", 587)
        server.starttls()

        server.login(
            os.getenv("MAIL_USERNAME"),
            os.getenv("MAIL_PASSWORD")
        )

        server.send_message(msg)
        server.quit()
        print(f"Reset email sent to {to_email} with role {role}")
    except Exception as e:
        print(f"SMTP Error: {e}")