from app.database import Base  # Import Base from database.py

# Import all models so they are registered properly
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import AppointmentDetails
from app.models.patient_conversation import PatientConversation
from app.models.patient_survey import PatientSurveyResponse