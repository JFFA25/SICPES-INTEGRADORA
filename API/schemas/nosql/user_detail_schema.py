from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class UserDetailBase(BaseModel):
    user_id: int
    career: str      # TICs, Mecatrónica, etc.
    cuatrimestre: int # 1-11
    promedio: float   # Rendimiento académico
    tipo_beca: str    # Federal, Estatal, Ninguna
    blood_type: str   # O+, A+, etc.
    address: str
    emergency_contact: Dict[str, str]
    hobbies: List[str] = []
    medical_info: Optional[str] = None

class UserDetailCreate(UserDetailBase):
    pass

class UserDetail(UserDetailBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True
