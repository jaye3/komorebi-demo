from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class PatientSurveyResponse(Base):
    __tablename__ = 'patient_survey_responses'
    
    survey_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    date_time = Column(DateTime, nullable=False)
    survey_response = Column(Text, nullable=False)
    summarised_response = Column(Text)
    
    patient = relationship("Patient", back_populates="survey_responses")
