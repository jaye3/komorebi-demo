from pydantic import BaseModel
from datetime import datetime

class AppointmentBase(BaseModel):
    date_time: datetime  # ✅ Change from str → datetime
    doctor_id: int
    patient_id: int
    status: str = "scheduled"
    patient_survey_summary: str
    doctor_remarks: str

    class Config:
        from_attributes = True  # ✅ Ensures automatic conversion from SQLAlchemy models
