from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from backend.app.schemas.patient_conversation import PatientConversationBase
from backend.app.api.crud.patient_conversation import (
    create_patient_conversation,
    get_all_conversations,
    get_conversation_by_id,
    get_conversations_by_patient,
    delete_conversation
)
from backend.app.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_conversation(conversation: PatientConversationBase, db: Session = Depends(get_db)):
    try:
        return create_patient_conversation(db, conversation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/getall/")
def read_all_conversations(db: Session = Depends(get_db)):
    return get_all_conversations(db)

@router.get("/{msg_id}")
def read_conversation(msg_id: int, db: Session = Depends(get_db)):
    conversation = get_conversation_by_id(db, msg_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.get("/patient/{patient_id}")
def read_conversations_by_patient(patient_id: str, db: Session = Depends(get_db)):
    patient_id = int(patient_id)
    return get_conversations_by_patient(db, patient_id)

@router.delete("/{msg_id}")
def remove_conversation(msg_id: int, db: Session = Depends(get_db)):
    try:
        return delete_conversation(db, msg_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
