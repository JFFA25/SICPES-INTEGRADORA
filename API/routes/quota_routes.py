from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas.quota_schema import QuotaResponse, QuotaCreate, QuotaUpdate
from crud.quota_crud import get_all_quotas, create_quota, update_quota_status, delete_quota
from portadortoken import PortadorToken

quota_router = APIRouter()

@quota_router.get("/cuotas", response_model=List[QuotaResponse], tags=["Cuotas"], dependencies=[Depends(PortadorToken())])
def listar_cuotas(db: Session = Depends(get_db)):
    return get_all_quotas(db)

@quota_router.post("/cuotas", response_model=QuotaResponse, tags=["Cuotas"], dependencies=[Depends(PortadorToken())])
def agregar_cuota(quota_data: QuotaCreate, db: Session = Depends(get_db)):
    return create_quota(db, quota_data)

@quota_router.put("/cuotas/{quota_id}", response_model=QuotaResponse, tags=["Cuotas"], dependencies=[Depends(PortadorToken())])
def actualizar_estado_cuota(quota_id: int, quota_data: QuotaUpdate, db: Session = Depends(get_db)):
    updated = update_quota_status(db, quota_id, quota_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Cuota no encontrada")
    return updated

@quota_router.delete("/cuotas/{quota_id}", tags=["Cuotas"], dependencies=[Depends(PortadorToken())])
def eliminar_cuota(quota_id: int, db: Session = Depends(get_db)):
    deleted = delete_quota(db, quota_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cuota no encontrada")
    return {"message": "Cuota eliminada correctamente"}
