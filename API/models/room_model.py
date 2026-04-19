from sqlalchemy import Column, Integer, String
from config.database import Base

class RoomModel(Base):
    __tablename__ = "tbi_habitaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    piso = Column(String(20), index=True)
    habitacion = Column(String(20))
