from pydantic import BaseModel, EmailStr
from typing import Optional

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: str = "user"
    confirmado: bool = True

class UserUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    rol: Optional[str] = None
    confirmado: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    confirmado: bool

    class Config:
        from_attributes = True
