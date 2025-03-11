from pydantic import BaseModel
from datetime import datetime

class PatientConversationBase(BaseModel):
    patient_id: int
    date_time: datetime  # ✅ Change from str → datetime
    raw_message: str
    vectorised_message: str | None = None  # ✅ Optional field

    class Config:
        from_attributes = True  # ✅ Ensures automatic conversion from SQLAlchemy models
