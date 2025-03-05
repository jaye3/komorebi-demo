from pydantic import BaseModel

class PatientConversationBase(BaseModel):
    patient_id: int
    date_time: str
    raw_message: str
    vectorised_message: str
