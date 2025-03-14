from fastapi import FastAPI
from backend.app.database import engine
from backend.app import models  # ✅ This now works because of __init__.py
import os
import uvicorn
from dotenv import load_dotenv
load_dotenv()

# Import API routes
from backend.app.api.routes import doctor, patient, appointment, patient_conversation,patient_survey, chatbot_insights


app = FastAPI()

# ✅ Ensure tables are created
models.Base.metadata.create_all(bind=engine)

# Include API routers
app.include_router(doctor.router, prefix="/api/doctors", tags=["Doctors"])
app.include_router(patient.router, prefix="/api/patients", tags=["Patients"])
app.include_router(appointment.router, prefix="/api/appointments", tags=["Appointments"])
app.include_router(patient_conversation.router, prefix="/api/conversations", tags=["Conversations"])
app.include_router(patient_survey.router, prefix="/api/survey_responses", tags=["Survey Responses"])
app.include_router(chatbot_insights.router, prefix="/api/insights", tags=["Insights"])

@app.get("/")
async def root():
    return {"message": "Test root"}

if __name__ == "__main__":
    # Run FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))