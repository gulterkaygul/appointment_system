from fastapi import APIRouter, Body
from app.chatbot_service import get_chatbot_response

router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"]
)

@router.post("")
async def chat_with_ai(message: str = Body(..., embed=True)):
    """
    Yapay zeka asistanı ile mesajlaşın.
    """
    response = get_chatbot_response(message)
    return {"reply": response}