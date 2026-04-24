from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional
from pydantic import BaseModel
from config.database import get_db

seed_router = APIRouter(tags=["SQL Tests"])

class SeedRequest(BaseModel):
    cantidad: int = 10
    estado_reservacion: Optional[str] = None
    estado_pago: Optional[str] = None
    motivo_rechazo: Optional[str] = None
    usuario_confirmado: Optional[int] = None
    metodo_pago: Optional[str] = None

@seed_router.post("/generate-data", summary="Generar datos aleatorios masivos (Usuarios, Reservaciones, Pagos, Cuotas)")
def generar_datos_aleatorios(request: SeedRequest, db: Session = Depends(get_db)):
    try:
        # Llamamos al procedimiento almacenado 
        query = text("""
            CALL sp_generar_lote_hibrido(
                :cantidad, 
                :estado_reservacion, 
                :estado_pago, 
                :motivo_rechazo,
                :usuario_confirmado,
                :metodo_pago
            )
        """)
        
        db.execute(query, {
            "cantidad": request.cantidad,
            "estado_reservacion": request.estado_reservacion,
            "estado_pago": request.estado_pago,
            "motivo_rechazo": request.motivo_rechazo,
            "usuario_confirmado": request.usuario_confirmado,
            "metodo_pago": request.metodo_pago
        })
        db.commit()
        
        return {
            "message": f"Se han generado {request.cantidad} registros exitosamente.",
            "params": request.dict()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
