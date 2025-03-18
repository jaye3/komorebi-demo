from sqlalchemy.orm import Session
from backend.app import models
from backend.app.schemas.patient_conversation import PatientConversationBase
from datetime import datetime

def create_patient_conversation(db: Session, conversation: PatientConversationBase):
    new_conversation = models.PatientConversation(
        patient_id=conversation.patient_id,
        date_time=datetime.utcnow(),  # ✅ Automatically set to current time
        raw_message=conversation.raw_message,
        vectorised_message=conversation.vectorised_message,
    )
    db.add(new_conversation)
    db.commit()
    db.refresh(new_conversation)
    return new_conversation

def get_all_conversations(db: Session):
    return db.query(models.PatientConversation).all()

def get_conversation_by_id(db: Session, msg_id: int):
    return db.query(models.PatientConversation).filter(models.PatientConversation.msg_id == msg_id).first()

def get_conversations_by_patient(db: Session, patient_id: int):
    return db.query(models.PatientConversation).filter(models.PatientConversation.patient_id == patient_id).all()

def get_recent_conversations_by_patient(db: Session, patient_id: int):
    # Returns the 7 most recent messages from the patient conversation
    return db.query(models.PatientConversation).filter(models.PatientConversation.patient_id == patient_id).order_by(models.PatientConversation.date_time.desc()).limit(7).all()

def delete_conversation(db: Session, msg_id: int):
    conversation = db.query(models.PatientConversation).filter(models.PatientConversation.msg_id == msg_id).first()
    if conversation:
        db.delete(conversation)
        db.commit()
        return {"message": "Conversation deleted successfully"}
    raise ValueError("Conversation not found")
