import smtplib
import os
from email.mime.text import MIMEText

def send_reset_email(to_email: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    msg = MIMEText(f"Click to reset your password:\n{reset_link}")
    msg["Subject"] = "Password Reset"
    msg["From"] = "noreply@clinic.com"
    msg["To"] = to_email

    server = smtplib.SMTP("sandbox.smtp.mailtrap.io", 587)
    server.starttls()  # 🔥 BU ÇOK ÖNEMLİ

    server.login(
        os.getenv("MAIL_USERNAME"),
        os.getenv("MAIL_PASSWORD")
    )

    server.send_message(msg)
    server.quit()