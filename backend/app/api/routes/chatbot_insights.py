from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from backend.app.services.chatbot_insights_service import (
    get_patient_reported_outcomes,
    get_patient_risk_alert,
    get_suggested_actions
)
from backend.app.services.iris_vector_search import retrieve_context
from backend.app.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/reported-outcomes", status_code=200)
def get_reported_outcomes(patient_id: int, db: Session = Depends(get_db)):
    try:
        return get_patient_reported_outcomes(patient_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/risk-alert", status_code=200)
def get_risk_alert(patient_id: int, db: Session = Depends(get_db)):
    try:
        return get_patient_risk_alert(patient_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/suggested-actions", status_code=200)
def get_suggestions(patient_id: int, db: Session = Depends(get_db)):
    try:
        return get_suggested_actions(patient_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/context/{query}", status_code=200)
def get_query_context(query: str):
    try:
        return retrieve_context(query)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

