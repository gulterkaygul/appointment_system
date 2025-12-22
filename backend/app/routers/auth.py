from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app import schemas
from app.security import verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=schemas.Token)
def login(
    login_data: schemas.LoginRequest,
    db: Session = Depends(get_db),
):
    # 1) Kullanıcıyı bul
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password.",
        )

    # 2) Şifreyi doğrula
    if not verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password.",
        )

    # 3) Token oluştur
    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role,
        }
    )

    # 4) Token + role döndür
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }
