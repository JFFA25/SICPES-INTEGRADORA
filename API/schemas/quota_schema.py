from pydantic import BaseModel
from typing import Optional

class QuotaCreate(BaseModel):
    reservacion_id: int
    mes: int
    anio: int
    tipo_pago: str
    monto_calculado: float
    estado: str = "pendiente"
    fecha_vencimiento: str

class QuotaResponse(QuotaCreate):
    id: int

    class Config:
        from_attributes = True

class QuotaUpdate(BaseModel):
    estado: Optional[str] = None
