'''
This is where the doctor model will be
'''

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Doctor(Base):
    __tablename__ = 'doctors'
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    mobile_no = Column(String(20), nullable=False)
    
    patients = relationship("DoctorPatientAssignment", back_populates="doctor")
    appointments = relationship("AppointmentDetails", back_populates="doctor")
