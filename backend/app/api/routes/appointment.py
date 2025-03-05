from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_appointment():
    return {"message": "List of appointment"}
