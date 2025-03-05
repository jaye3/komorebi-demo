from pydantic import BaseModel

class AppointmentBase(BaseModel):
    date_time: str
    doctor_id: int
    patient_id: int
    status: str = "scheduled"
    patient_survey_summary: str
    doctor_remarks: str
