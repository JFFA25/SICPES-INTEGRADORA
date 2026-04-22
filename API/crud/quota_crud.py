from sqlalchemy.orm import Session
from models.quota_model import QuotaModel
from schemas.quota_schema import QuotaCreate, QuotaUpdate

def get_all_quotas(db: Session):
    return db.query(QuotaModel).all()

def create_quota(db: Session, quota_data: QuotaCreate):
    db_quota = QuotaModel(**quota_data.model_dump())
    db.add(db_quota)
    db.commit()
    db.refresh(db_quota)
    return db_quota

def update_quota_status(db: Session, quota_id: int, quota_data: QuotaUpdate):
    db_quota = db.query(QuotaModel).filter(QuotaModel.id == quota_id).first()
    if db_quota:
        if quota_data.estado:
            db_quota.estado = quota_data.estado
        db.commit()
        db.refresh(db_quota)
    return db_quota

def delete_quota(db: Session, quota_id: int):
    db_quota = db.query(QuotaModel).filter(QuotaModel.id == quota_id).first()
    if db_quota:
        db.delete(db_quota)
        db.commit()
    return db_quota
