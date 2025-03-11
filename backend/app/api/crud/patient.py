from sqlalchemy.orm import Session
from app import models
from app.schemas.patient import PatientBase

def get_all_patient(db:Session):
    return db.query(models.Patient).all()

def get_patient_by_id(db:Session, patient_id:int):
    return db.query(models.Patient).filter(models.Patient.id == patient_id).first()

def create_patient(db: Session, patient: PatientBase):
    # Check if the patient with the given email already exists
    existing_patient = db.query(models.Patient).filter(models.Patient.email == patient.email).first()
    if existing_patient:
        raise ValueError("Email already registered")
    
    new_patient = models.Patient(
        full_name=patient.full_name,
        mobile_no = patient.mobile_no,
        other_remarks= patient.other_remarks,
        doctor_assigned = patient.doctor_assigned,
        email = patient.email,
        telegram_username = patient.telegram_username
    )
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    
    return new_patient

def get_patient_find_by_telegram_username(db:Session, telegram_username:str):
    return db.query(models.Patient).filter(models.Patient.telegram_username == telegram_username).first()