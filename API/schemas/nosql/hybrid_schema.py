from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict
from datetime import datetime

class HybridUserCreate(BaseModel):
    # SQL Fields (Table: usuarios)
    nombre: str
    email: EmailStr
    password: str
    rol: str = "estudiante"
    
    # NoSQL Fields (Collection: user_details)
    career: str
    cuatrimestre: int
    promedio: float
    tipo_beca: str
    blood_type: str
    address: str
    emergency_contact: Dict[str, str]
    hobbies: List[str] = []
    medical_info: Optional[str] = None
