from pydantic import BaseModel
from typing import Optional

class ReservationCreate(BaseModel):
    usuario_id: int
    fecha_ingreso: str
    tipo: str
    piso: str
    habitacion: str
    monto: float

class ReservationResponse(ReservationCreate):
    id: int
    estado: str
    motivo_rechazo: Optional[str] = None

    class Config:
        from_attributes = True

class ReservationUpdate(BaseModel):
    fecha_ingreso: Optional[str] = None
    tipo: Optional[str] = None
    piso: Optional[str] = None
    habitacion: Optional[str] = None
    monto: Optional[float] = None
    estado: Optional[str] = None
    motivo_rechazo: Optional[str] = None
