'''
This is where the routing for the doctor table goes. 
If its CRUD - maybe can made another folder like /api/crud/ and move this there instead
'''
# /api/routes/doctor.py
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.doctor import DoctorBase
from app.api.crud.doctor import create_doctor,get_all_doctors  # Correct import
from app.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/getall/")
def get_doctors(db: Session = Depends(get_db)):
    return get_all_doctors(db)

@router.post("/create/", status_code=status.HTTP_201_CREATED)
async def create_doctor_route(doctor: DoctorBase, db: Session = Depends(get_db)):
    try:
        new_doctor = create_doctor(db, doctor)
        return new_doctor
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
