from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from backend.app.schemas.patient import PatientBase
from backend.app.api.crud.patient import get_all_patient, get_patient_by_id, create_patient, get_patient_find_by_telegram_username # Correct import
from backend.app.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/getall/")
def get_patients(db:Session = Depends(get_db)):
    return get_all_patient(db)

@router.get("/get/{patient_id}")
def get_patient_by_id_route(patient_id:int,db:Session= Depends(get_db)):
    patient = get_patient_by_id(db, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.post("/create/", status_code=status.HTTP_201_CREATED)
async def create_patient_route(patient: PatientBase, db: Session = Depends(get_db)):
    try:
        new_patient = create_patient(db, patient)
        return new_patient
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.get("/findby/{telegram_username}", status_code=200)
async def get_patient_find_by_telegram_username_route(telegram_username: str, db: Session = Depends(get_db)):
    try:
        patient = get_patient_find_by_telegram_username(db, telegram_username)
        return patient
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

