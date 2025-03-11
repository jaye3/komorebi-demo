from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.doctor import DoctorBase

class AppointmentBase(BaseModel):
    id: int
    date_time: datetime  # ✅ Change from str → datetime
    doctor_id: int
    patient_id: Optional[int]
    status: str 
    booking_remarks: Optional[str]
    patient_survey_summary: Optional[str]
    doctor_remarks: Optional[str]

    class Config:
        from_attributes = True  # ✅ Ensures automatic conversion from SQLAlchemy models

class AppointmentDetailsResponse(BaseModel):
    id: int
    date_time: datetime
    status: str
    doctor: DoctorBase  # ✅ Include the nested doctor model

    class Config:
        from_attributes = True

class AppointmentBooking(BaseModel):
    patient_id: int
    booking_remarks: Optional[str]