from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.appointment import AppointmentBase, AppointmentDetailsResponse, AppointmentBooking
from app.api.crud.appointment import (
    create_appointment, get_all_appointments, get_appointment_by_id,
    get_appointments_by_patient_id, get_appointments_by_doctor_id, update_appointment_status,
    get_available_appointments, book_appointment_status
)
from app.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1️⃣ Create Appointment
@router.post("/create/", status_code=status.HTTP_201_CREATED)
async def create_appointment_route(appointment: AppointmentBase, db: Session = Depends(get_db)):
    try:
        new_appointment = create_appointment(db, appointment)
        return new_appointment
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# 2️⃣ Get All Appointments
@router.get("/all/", response_model=List[AppointmentBase])
def get_appointments_route(db: Session = Depends(get_db)):
    return get_all_appointments(db)

# Get all available slots
@router.get("/available/",response_model=List[AppointmentDetailsResponse])
def get_available_appointments_route(db: Session = Depends(get_db)):
    return get_available_appointments(db)

# Book appointment (update slot to schedeuled status)
@router.put("/book/{appointment_id}/update/")
def book_appointment_route(appointment_id: int, booking: AppointmentBooking, db: Session = Depends(get_db)):
    patient_id = booking.patient_id
    booked_appointment = book_appointment_status(db, appointment_id, patient_id)
    if not booked_appointment:
        raise HTTPException(status_code=404, detail="Appointment slot not found or could not be booked")
    return booked_appointment

# 3️⃣ Get Appointment by ID
@router.get("/{appointment_id}/")
def get_appointment_by_id_route(appointment_id: int, db: Session = Depends(get_db)):
    appointment = get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

# 4️⃣ Get Appointments by Patient ID
@router.get("/patient/{patient_id}/", response_model=List[AppointmentBase])
def get_appointments_by_patient_id_route(patient_id: int, db: Session = Depends(get_db)):
    return get_appointments_by_patient_id(db, patient_id)

# 5️⃣ Get Appointments by Doctor ID
@router.get("/doctor/{doctor_id}/", response_model=List[AppointmentBase])
def get_appointments_by_doctor_id_route(doctor_id: int, db: Session = Depends(get_db)):
    return get_appointments_by_doctor_id(db, doctor_id)

# 6️⃣ Update Appointment Status (Cancel & Reschedule)
@router.put("/{appointment_id}/update/")
def update_appointment_status_route(appointment_id: int, new_date_time: str, db: Session = Depends(get_db)):
    updated_appointment = update_appointment_status(db, appointment_id, new_date_time)
    if not updated_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found or could not be updated")
    return updated_appointment
    
