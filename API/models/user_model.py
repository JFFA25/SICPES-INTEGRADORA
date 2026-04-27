from sqlalchemy import Column, Integer, String, Boolean, DateTime
from config.database import Base

class UserModel(Base):
    __tablename__ = "tbd_usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    password = Column(String(255))
    rol = Column(String(20), default="user")
    confirmado = Column(Boolean, default=False)
    token = Column(String(255), nullable=True)
    current_session = Column(String(255), nullable=True)
