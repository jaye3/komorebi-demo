from sqlalchemy.orm import Session
from backend.app import models
from backend.app.schemas.patient_survey import PatientSurveyResponseBase
from datetime import datetime

def create_patient_survey(db: Session, survey: PatientSurveyResponseBase):
    new_survey = models.PatientSurveyResponse(
        patient_id=survey.patient_id,
        date_time=datetime.utcnow(),  # ✅ Automatically set to current time
        survey_response=survey.survey_response,
        summarised_response=survey.summarised_response,
    )
    db.add(new_survey)
    db.commit()
    db.refresh(new_survey)
    return new_survey

def get_all_surveys(db: Session):
    return db.query(models.PatientSurveyResponse).all()

def get_survey_by_id(db: Session, survey_id: int):
    return db.query(models.PatientSurveyResponse).filter(models.PatientSurveyResponse.survey_id == survey_id).first()

def get_surveys_by_patient(db: Session, patient_id: int):
    return db.query(models.PatientSurveyResponse).filter(models.PatientSurveyResponse.patient_id == patient_id).all()

def delete_survey(db: Session, survey_id: int):
    survey = db.query(models.PatientSurveyResponse).filter(models.PatientSurveyResponse.survey_id == survey_id).first()
    if survey:
        db.delete(survey)
        db.commit()
        return {"message": "Survey response deleted successfully"}
    raise ValueError("Survey response not found")
