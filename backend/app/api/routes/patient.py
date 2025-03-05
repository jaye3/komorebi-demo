from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_patient():
    return {"message": "List of patient"}
