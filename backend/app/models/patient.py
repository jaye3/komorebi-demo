from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    mobile_no = Column(String(20), nullable=False)
    other_remarks = Column(Text)
    
    doctors = relationship("DoctorPatientAssignment", back_populates="patient")
    appointments = relationship("AppointmentDetails", back_populates="patient")
    conversations = relationship("PatientConversation", back_populates="patient")
    survey_responses = relationship("PatientSurveyResponse", back_populates="patient")
