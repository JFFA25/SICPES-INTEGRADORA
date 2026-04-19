from sqlalchemy.orm import Session
from models.reservation_model import ReservationModel
from schemas.reservation_schema import ReservationCreate

def create_reservation(db: Session, res_data: ReservationCreate):
    db_res = ReservationModel(**res_data.model_dump())
    db.add(db_res)
    db.commit()
    db.refresh(db_res)
    return db_res

def get_all_reservations(db: Session):
    return db.query(ReservationModel).all()

def get_reservation(db: Session, res_id: int):
    return db.query(ReservationModel).filter(ReservationModel.id == res_id).first()

def update_reservation(db: Session, res_id: int, res_data):
    db_res = db.query(ReservationModel).filter(ReservationModel.id == res_id).first()
    if db_res:
        update_data = res_data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_res, key, value)
        db.commit()
        db.refresh(db_res)
    return db_res

def delete_reservation(db: Session, res_id: int):
    db_res = db.query(ReservationModel).filter(ReservationModel.id == res_id).first()
    if db_res:
        db.delete(db_res)
        db.commit()
    return db_res
