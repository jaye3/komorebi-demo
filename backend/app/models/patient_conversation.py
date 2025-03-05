from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class PatientConversation(Base):
    __tablename__ = 'patient_conversations'
    
    msg_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    date_time = Column(DateTime, nullable=False)
    raw_message = Column(Text, nullable=False)
    vectorised_message = Column(Text)
    
    patient = relationship("Patient", back_populates="conversations")