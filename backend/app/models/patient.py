from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)  # ✅ Added length
    email = Column(String(255), unique=True, nullable=False)  # ✅ Added length
    mobile_no = Column(String(20), nullable=False)  # ✅ Added length
    other_remarks = Column(Text, nullable=True)
    doctor_assigned = Column(Integer, ForeignKey("doctors.id"), nullable=False)

    
    # doctors = relationship("DoctorPatientAssignment", back_populates="patient")
    appointments = relationship("AppointmentDetails", back_populates="patient")
    conversations = relationship("PatientConversation", back_populates="patient")
    survey_responses = relationship("PatientSurveyResponse", back_populates="patient")
