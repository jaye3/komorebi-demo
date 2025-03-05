from fastapi import FastAPI
from app.database import engine
import app.models.doctor, app.models.patient, app.models.appointment # to add for other models
from app.api.routes import doctor, patient, appointment, conversation, survey_response # to add for other tables
import models

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(doctor.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(patient.router, prefix="/api/patients", tags=["Patients"])
app.include_router(appointment.router, prefix="/api/appointments", tags=["Appointments"])

@app.get("/")
async def root():
    return {"message": "Test root"}