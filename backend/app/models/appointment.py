from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from backend.app.database import Base

class AppointmentDetails(Base):
    __tablename__ = 'appointment_details'
    
    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=True)
    status = Column(String(20), default="none", nullable=False)
    booking_remarks = Column(Text)
    patient_survey_summary = Column(Text)
    doctor_remarks = Column(Text)
    
    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")
