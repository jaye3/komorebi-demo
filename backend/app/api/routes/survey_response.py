from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_survey():
    return {"message": "List of survey"}
