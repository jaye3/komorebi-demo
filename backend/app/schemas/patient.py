from pydantic import BaseModel
from typing import Optional

class PatientBase(BaseModel):
    id: Optional[int] = None
    full_name: str
    mobile_no: str
    other_remarks: str
    doctor_assigned:str
    email:str
    telegram_username:str