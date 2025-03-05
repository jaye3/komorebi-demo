from pydantic import BaseModel

class PatientBase(BaseModel):
    full_name: str
    mobile_no: str
    other_remarks: str
    doctor_assigned:str