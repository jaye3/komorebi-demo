from pydantic import BaseModel

class PatientBase(BaseModel):
    id: int
    full_name: str
    mobile_no: str
    other_remarks: str
    doctor_assigned:str
    email:str
    telegram_username:str