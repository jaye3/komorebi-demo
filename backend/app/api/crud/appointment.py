from sqlalchemy.orm import Session, joinedload
from app import models
from app.schemas.appointment import AppointmentBase
from datetime import datetime

# 1️⃣ Create Appointment
def create_appointment(db: Session, appointment: AppointmentBase):
    # Check if doctor and patient exist
    doctor = db.query(models.Doctor).filter(models.Doctor.id == appointment.doctor_id).first()
    patient = db.query(models.Patient).filter(models.Patient.id == appointment.patient_id).first()
    if not doctor:
        raise ValueError("Assigned doctor does not exist")
    if not patient:
        raise ValueError("Assigned patient does not exist")

    new_appointment = models.AppointmentDetails(
        date_time=datetime.strptime(appointment.date_time, "%Y-%m-%d %H:%M:%S"),
        doctor_id=appointment.doctor_id,
        patient_id=appointment.patient_id,
        status=appointment.status,
        patient_survey_summary=appointment.patient_survey_summary,
        doctor_remarks=appointment.doctor_remarks
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

# 2️⃣ Get All Appointments
def get_all_appointments(db: Session):
    return db.query(models.AppointmentDetails).all()

# 3️⃣ Get Appointment by ID
def get_appointment_by_id(db: Session, appointment_id: int):
    return db.query(models.AppointmentDetails).filter(models.AppointmentDetails.id == appointment_id).first()

# 4️⃣ Get Appointments by Patient ID
def get_appointments_by_patient_id(db: Session, patient_id: int):
    return db.query(models.AppointmentDetails).filter(models.AppointmentDetails.patient_id == patient_id).all()

# 5️⃣ Get Appointments by Doctor ID
def get_appointments_by_doctor_id(db: Session, doctor_id: int):
    return db.query(models.AppointmentDetails).filter(models.AppointmentDetails.doctor_id == doctor_id).all()

# 6️⃣ Update Appointment Status (Cancel & Reschedule)
def update_appointment_status(db: Session, appointment_id: int, new_date_time: str):
    appointment = db.query(models.AppointmentDetails).filter(models.AppointmentDetails.id == appointment_id).first()
    if not appointment:
        return None

    appointment.status = "canceled"
    appointment.date_time = datetime.strptime(new_date_time, "%Y-%m-%d %H:%M:%S")

    db.commit()
    db.refresh(appointment)
    return appointment

def get_available_appointments(db: Session):
    return (
        db.query(models.AppointmentDetails)
        .options(joinedload(models.AppointmentDetails.doctor))  # Eagerly loads related doctor
        .filter(models.AppointmentDetails.status == "none")
        .order_by(models.AppointmentDetails.date_time.asc())
        .all()
    )

# Update details when booking new appointment
def book_appointment_status(db: Session, appointment_id: int, patient_id: int, booking_remarks: str):
    appointment = db.query(models.AppointmentDetails).filter(models.AppointmentDetails.id == appointment_id).first()
    if not appointment:
        return None

    appointment.status = "scheduled"
    appointment.patient_id = patient_id
    appointment.booking_remarks = booking_remarks

    db.commit()
    db.refresh(appointment)
    return appointment