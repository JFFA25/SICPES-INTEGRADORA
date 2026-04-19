from pydantic import BaseModel
from typing import Optional

class RoomCreate(BaseModel):
    piso: str
    habitacion: str

class RoomResponse(RoomCreate):
    id: int

    class Config:
        from_attributes = True

class RoomUpdate(BaseModel):
    piso: Optional[str] = None
    habitacion: Optional[str] = None
