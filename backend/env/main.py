from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel
from typing import Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

class DoctorBase(BaseModel):
    full_name: str
    email: str
    mobile_no: str

class PatientBase(BaseModel):
    full_name: str
    mobile_no: str
    other_remarks: str

class AppointmentBase(BaseModel):
    date_time: str
    doctor_id: int
    patient_id: int
    status: str = "scheduled"
    patient_survey_summary: str
    doctor_remarks: str

class PatientConversationBase(BaseModel):
    patient_id: int
    date_time: str
    raw_message: str
    vectorised_message: str

class PatientSurveyResponseBase(BaseModel):
    patient_id: int
    date_time: str
    survey_response: str
    summarised_response: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.post("/doctors/", status_code=status.HTTP_201_CREATED)
async def create_doctor(doctor: DoctorBase, db: db_dependency):
    db_doctor = models.Doctor(**doctor.model_dump())
    db.add(db_doctor)
    db.commit()
    return db_doctor

@app.get("/doctors/{doctor_id}", status_code=status.HTTP_200_OK)
async def get_doctor(doctor_id: int, db: db_dependency):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@app.post("/patients/", status_code=status.HTTP_201_CREATED)
async def create_patient(patient: PatientBase, db: db_dependency):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    return db_patient

@app.get("/patients/{patient_id}", status_code=status.HTTP_200_OK)
async def get_patient(patient_id: int, db: db_dependency):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@app.post("/appointments/", status_code=status.HTTP_201_CREATED)
async def create_appointment(appointment: AppointmentBase, db: db_dependency):
    appointment_data = appointment.model_dump()
    appointment_data["status"] = "scheduled"
    db_appointment = models.AppointmentDetails(**appointment_data)
    db.add(db_appointment)
    db.commit()
    return db_appointment

@app.put("/appointments/{appointment_id}/cancel", status_code=status.HTTP_200_OK)
async def cancel_appointment(appointment_id: int, db: db_dependency):
    appointment = db.query(models.AppointmentDetails).filter(models.AppointmentDetails.id == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = "none"
    db.commit()
    return appointment

@app.get("/appointments/{appointment_id}", status_code=status.HTTP_200_OK)
async def get_appointment(appointment_id: int, db: db_dependency):
    appointment = db.query(models.AppointmentDetails).filter(models.AppointmentDetails.id == appointment_id).first()
    if appointment is None:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@app.post("/conversations/", status_code=status.HTTP_201_CREATED)
async def create_conversation(conversation: PatientConversationBase, db: db_dependency):
    db_conversation = models.PatientConversation(**conversation.model_dump())
    db.add(db_conversation)
    db.commit()
    return db_conversation

@app.get("/conversations/{msg_id}", status_code=status.HTTP_200_OK)
async def get_conversation(msg_id: int, db: db_dependency):
    conversation = db.query(models.PatientConversation).filter(models.PatientConversation.msg_id == msg_id).first()
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@app.post("/survey_responses/", status_code=status.HTTP_201_CREATED)
async def create_survey_response(survey_response: PatientSurveyResponseBase, db: db_dependency):
    db_survey_response = models.PatientSurveyResponse(**survey_response.model_dump())
    db.add(db_survey_response)
    db.commit()
    return db_survey_response

@app.get("/survey_responses/{survey_id}", status_code=status.HTTP_200_OK)
async def get_survey_response(survey_id: int, db: db_dependency):
    survey_response = db.query(models.PatientSurveyResponse).filter(models.PatientSurveyResponse.survey_id == survey_id).first()
    if survey_response is None:
        raise HTTPException(status_code=404, detail="Survey response not found")
    return survey_response
