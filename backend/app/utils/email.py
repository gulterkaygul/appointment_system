import smtplib
import os
from email.mime.text import MIMEText

def send_reset_email(to_email: str, token: str):
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    #HTML içerik (tıklanabilir link)
    html_content = f"""
    <html>
        <body>
            <h3>Password Reset</h3>
            <p>Click the link below to reset your password:</p>
            <a href="{reset_link}" style="color:blue; text-decoration:underline;">
                Reset Password
            </a>
        </body>
    </html>
    """

    msg = MIMEText(html_content, "html")  # 🔥 önemli!
    msg["Subject"] = "Password Reset"
    msg["From"] = "noreply@clinic.com"
    msg["To"] = to_email

    server = smtplib.SMTP("sandbox.smtp.mailtrap.io", 587)
    server.starttls()

    server.login(
        os.getenv("MAIL_USERNAME"),
        os.getenv("MAIL_PASSWORD")
    )

    server.send_message(msg)
    server.quit()