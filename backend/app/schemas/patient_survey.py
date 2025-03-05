from pydantic import BaseModel

class PatientSurveyResponseBase(BaseModel):
    patient_id: int
    date_time: str
    survey_response: str
    summarised_response: str