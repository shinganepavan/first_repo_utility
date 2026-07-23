from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.db import models

router = APIRouter()

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/contact")
def create_contact(contact: ContactRequest, db: Session = Depends(get_db)):
    """Save contact form submission to database"""
    try:
        db_contact = models.Contact(
            name=contact.name,
            email=contact.email,
            message=contact.message
        )
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        return {"message": "Contact form submitted successfully", "id": db_contact.id}
    except Exception as e:
        db.rollback()
        print(f"Error saving contact: {e}")
        raise HTTPException(status_code=500, detail="Failed to save contact form")

@router.post("/login")
def create_login(login: LoginRequest, db: Session = Depends(get_db)):
    """Save login credentials to database"""
    try:
        db_login = models.Login(
            email=login.email,
            password=login.password
        )
        db.add(db_login)
        db.commit()
        db.refresh(db_login)
        return {"message": "Login credentials saved successfully", "id": db_login.id}
    except Exception as e:
        db.rollback()
        print(f"Error saving login: {e}")
        raise HTTPException(status_code=500, detail="Failed to save login credentials")

@router.get("/contacts")
def get_contacts(db: Session = Depends(get_db)):
    """Get all contact submissions"""
    contacts = db.query(models.Contact).all()
    return contacts

@router.get("/logins")
def get_logins(db: Session = Depends(get_db)):
    """Get all login records"""
    logins = db.query(models.Login).all()
    return logins
