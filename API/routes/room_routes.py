from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from config.database import get_db
from schemas.room_schema import RoomResponse, RoomCreate, RoomUpdate
from crud.room_crud import get_all_rooms, create_room, delete_room, get_room, update_room
from portadortoken import PortadorToken

room_router = APIRouter()

@room_router.get("/habitaciones", response_model=List[RoomResponse], tags=["Habitaciones"], dependencies=[Depends(PortadorToken())])
def listar_habitaciones(db: Session = Depends(get_db)):
    return get_all_rooms(db)

@room_router.post("/habitaciones", response_model=RoomResponse, tags=["Habitaciones"], dependencies=[Depends(PortadorToken())])
def agregar_habitacion(room_data: RoomCreate, db: Session = Depends(get_db)):
    return create_room(db, room_data)

@room_router.delete("/habitaciones/{room_id}", tags=["Habitaciones"], dependencies=[Depends(PortadorToken())])
def eliminar_habitacion(room_id: int, db: Session = Depends(get_db)):
    deleted = delete_room(db, room_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Habitación no encontrada")
    return {"message": "Habitación eliminada correctamente"}

@room_router.get("/habitaciones/{room_id}", response_model=RoomResponse, tags=["Habitaciones"], dependencies=[Depends(PortadorToken())])
def obtener_habitacion(room_id: int, db: Session = Depends(get_db)):
    db_room = get_room(db, room_id)
    if not db_room: raise HTTPException(status_code=404, detail="Habitación no encontrada")
    return db_room

@room_router.put("/habitaciones/{room_id}", response_model=RoomResponse, tags=["Habitaciones"], dependencies=[Depends(PortadorToken())])
def actualizar_habitacion(room_id: int, room_data: RoomUpdate, db: Session = Depends(get_db)):
    updated = update_room(db, room_id, room_data)
    if not updated: raise HTTPException(status_code=404, detail="Habitación no encontrada")
    return updated
