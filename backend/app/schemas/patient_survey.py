from pydantic import BaseModel
from datetime import datetime

class PatientSurveyResponseBase(BaseModel):
    patient_id: int
    date_time: datetime  # ✅ Change from str → datetime
    survey_response: str
    summarised_response: str | None = None  # ✅ Optional field

    class Config:
        from_attributes = True  # ✅ Ensures automatic conversion from SQLAlchemy models
