from typing import Optional
from pydantic import BaseModel

# Shared properties
class UserBase(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "user"

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: str
    password: str
    full_name: str

# Properties to receive via API on update
class UserUpdate(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None


# Properties to return via API
class UserResponse(UserBase):
    id: int
    
    class Config:
        from_attributes = True

# Token response schema
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Token payload schema
class TokenPayload(BaseModel):
    sub: Optional[int] = None
