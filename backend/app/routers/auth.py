from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.utils.email import send_reset_email
from app.database import get_db
from app.models import User
from app import schemas
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_reset_token,
    verify_reset_token
)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.Token)
def login(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.email == login_data.email).first()

    if not user or not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password.",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }


@router.post("/forgot-password")
def forgot_password(data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    # 🔒 Güvenlik: kullanıcı yoksa bile aynı mesajı dön
    if not user:
        return {
            "message": "If this email exists, a reset link has been sent."
        }

    token = create_reset_token(user.email)

    try:
        # send_reset_email fonksiyonuna 'role' parametresini ekle
        send_reset_email(user.email, token, user.role) 
    except Exception as e:
        print("Email error:", e)

    return {
        "message": "If this email exists, a reset link has been sent."
    }


@router.post("/reset-password")
def reset_password(data: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    email = verify_reset_token(data.token)

    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.password_hash = hash_password(data.new_password)
    db.commit()

    return {"message": "Password successfully reset"}