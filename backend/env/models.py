from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from database import Base

# class User(Base):
#     __tablename__='users'

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String(50), unique=True)


# class Post(Base):
#     __tablename__='posts'
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String(50))
#     content =Column(String(100))
#     user_id = Column(Integer)



class Patient(Base):
    __tablename__ = 'patients'
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    mobile_no = Column(String(20), nullable=False)
    other_remarks = Column(Text)
    
    # doctors = relationship("DoctorPatientAssignment", back_populates="patient")
    appointments = relationship("AppointmentDetails", back_populates="patient")
    conversations = relationship("PatientConversation", back_populates="patient")
    survey_responses = relationship("PatientSurveyResponse", back_populates="patient")

class DoctorPatientAssignment(Base):
    __tablename__ = 'doctor_patient_assignments'
    
    doctor_id = Column(Integer, ForeignKey('doctors.id'), primary_key=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), primary_key=True)
    
    doctor = relationship("Doctor", back_populates="patients")
    patient = relationship("Patient", back_populates="doctors")

class AppointmentDetails(Base):
    __tablename__ = 'appointment_details'
    
    id = Column(Integer, primary_key=True, index=True)
    date_time = Column(DateTime, nullable=False)
    doctor_id = Column(Integer, ForeignKey('doctors.id'), nullable=False)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    status = Column(String(20), default="none", nullable=False)
    patient_survey_summary = Column(Text)
    doctor_remarks = Column(Text)
    
    doctor = relationship("Doctor", back_populates="appointments")
    patient = relationship("Patient", back_populates="appointments")

class PatientConversation(Base):
    __tablename__ = 'patient_conversations'
    
    msg_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    date_time = Column(DateTime, nullable=False)
    raw_message = Column(Text, nullable=False)
    vectorised_message = Column(Text)
    
    patient = relationship("Patient", back_populates="conversations")

class PatientSurveyResponse(Base):
    __tablename__ = 'patient_survey_responses'
    
    survey_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patients.id'), nullable=False)
    date_time = Column(DateTime, nullable=False)
    survey_response = Column(Text, nullable=False)
    summarised_response = Column(Text)
    
    patient = relationship("Patient", back_populates="survey_responses")

