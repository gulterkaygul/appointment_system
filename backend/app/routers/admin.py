from fastapi import APIRouter, Depends
from app.security import admin_required
from app.models import User

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)

@router.get("/me")
def admin_profile(
    current_user: User = Depends(admin_required),
):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "role": current_user.role
    }
