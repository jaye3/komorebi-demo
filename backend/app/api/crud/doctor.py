from sqlalchemy.orm import Session
from app import models
from app.schemas.doctor import DoctorBase


def create_doctor(db: Session, doctor: DoctorBase):
    # Check if the doctor with the given email already exists
    existing_doctor = db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first()
    if existing_doctor:
        raise ValueError("Email already registered")
    
    new_doctor = models.Doctor(
        full_name=doctor.full_name,
        email=doctor.email,
        mobile_no=doctor.mobile_no
    )
    db.add(new_doctor)
    db.commit()
    db.refresh(new_doctor)
    
    return new_doctor

def get_all_doctors(db: Session):
    return db.query(models.Doctor).all()

