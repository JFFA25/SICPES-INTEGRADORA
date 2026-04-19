from sqlalchemy.orm import Session
from models.user_model import UserModel
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_email(db: Session, email: str):
    return db.query(UserModel).filter(UserModel.email == email).first()

def get_all_users(db: Session):
    return db.query(UserModel).all()

def create_user(db: Session, user_data):
    hashed_pass = pwd_context.hash(user_data.password)
    db_user = UserModel(
        nombre=user_data.nombre,
        email=user_data.email,
        password=hashed_pass,
        rol=user_data.rol,
        confirmado=user_data.confirmado
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(UserModel).filter(UserModel.id == user_id).first()

def update_user(db: Session, user_id: int, user_data):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user:
        if user_data.nombre: db_user.nombre = user_data.nombre
        if user_data.email: db_user.email = user_data.email
        if user_data.password: db_user.password = pwd_context.hash(user_data.password)
        if user_data.rol: db_user.rol = user_data.rol
        if user_data.confirmado is not None: db_user.confirmado = user_data.confirmado
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user(db: Session, user_id: int):
    db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return db_user

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except:
        return False
