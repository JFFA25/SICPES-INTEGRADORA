from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas.reservation_schema import ReservationResponse, ReservationCreate, ReservationUpdate
from crud.reservation_crud import create_reservation, get_all_reservations, get_reservation, update_reservation, delete_reservation
from portadortoken import PortadorToken

reservation_router = APIRouter()

@reservation_router.get("/reservaciones", response_model=List[ReservationResponse], tags=["Reservaciones"], dependencies=[Depends(PortadorToken())])
def listar_reservaciones(db: Session = Depends(get_db)):
    return get_all_reservations(db)

@reservation_router.post("/reservaciones", response_model=ReservationResponse, tags=["Reservaciones"], dependencies=[Depends(PortadorToken())])
def agregar_reservacion(res_data: ReservationCreate, db: Session = Depends(get_db)):
    return create_reservation(db, res_data)

@reservation_router.get("/reservaciones/{res_id}", response_model=ReservationResponse, tags=["Reservaciones"], dependencies=[Depends(PortadorToken())])
def obtener_reservacion(res_id: int, db: Session = Depends(get_db)):
    db_res = get_reservation(db, res_id)
    if not db_res: raise HTTPException(status_code=404, detail="Reservación no encontrada")
    return db_res

@reservation_router.put("/reservaciones/{res_id}", response_model=ReservationResponse, tags=["Reservaciones"], dependencies=[Depends(PortadorToken())])
def actualizar_reservacion(res_id: int, res_data: ReservationUpdate, db: Session = Depends(get_db)):
    updated = update_reservation(db, res_id, res_data)
    if not updated: raise HTTPException(status_code=404, detail="Reservación no encontrada")
    return updated

@reservation_router.delete("/reservaciones/{res_id}", tags=["Reservaciones"], dependencies=[Depends(PortadorToken())])
def eliminar_reservacion(res_id: int, db: Session = Depends(get_db)):
    deleted = delete_reservation(db, res_id)
    if not deleted: raise HTTPException(status_code=404, detail="Reservación no encontrada")
    return {"message": "Reservación eliminada correctamente"}
