from backend.app.database import Base  # Import Base from database.py

# Import all models so they are registered properly
from backend.app.models.doctor import Doctor
from backend.app.models.patient import Patient
from backend.app.models.appointment import AppointmentDetails
from backend.app.models.patient_conversation import PatientConversation
from backend.app.models.patient_survey import PatientSurveyResponse
