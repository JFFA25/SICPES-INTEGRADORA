from sqlalchemy.orm import Session
from models.room_model import RoomModel
from schemas.room_schema import RoomCreate

def get_all_rooms(db: Session):
    return db.query(RoomModel).all()

def create_room(db: Session, room_data: RoomCreate):
    db_room = RoomModel(**room_data.model_dump())
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def delete_room(db: Session, room_id: int):
    db_room = db.query(RoomModel).filter(RoomModel.id == room_id).first()
    if db_room:
        db.delete(db_room)
        db.commit()
    return db_room

def get_room(db: Session, room_id: int):
    return db.query(RoomModel).filter(RoomModel.id == room_id).first()

def update_room(db: Session, room_id: int, room_data):
    db_room = db.query(RoomModel).filter(RoomModel.id == room_id).first()
    if db_room:
        if room_data.piso: db_room.piso = room_data.piso
        if room_data.habitacion: db_room.habitacion = room_data.habitacion
        db.commit()
        db.refresh(db_room)
    return db_room
