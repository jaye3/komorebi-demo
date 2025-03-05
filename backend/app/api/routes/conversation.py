from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_conversation():
    return {"message": "List of conversation"}
