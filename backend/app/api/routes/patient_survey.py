from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.patient_survey import PatientSurveyResponseBase
from app.api.crud.patient_survey import (
    create_patient_survey,
    get_all_surveys,
    get_survey_by_id,
    get_surveys_by_patient,
    delete_survey
)
from app.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_survey(survey: PatientSurveyResponseBase, db: Session = Depends(get_db)):
    try:
        return create_patient_survey(db, survey)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/getall/")
def read_all_surveys(db: Session = Depends(get_db)):
    return get_all_surveys(db)

@router.get("/{survey_id}")
def read_survey(survey_id: int, db: Session = Depends(get_db)):
    survey = get_survey_by_id(db, survey_id)
    if survey is None:
        raise HTTPException(status_code=404, detail="Survey response not found")
    return survey

@router.get("/patient/{patient_id}")
def read_surveys_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return get_surveys_by_patient(db, patient_id)

@router.delete("/{survey_id}")
def remove_survey(survey_id: int, db: Session = Depends(get_db)):
    try:
        return delete_survey(db, survey_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
