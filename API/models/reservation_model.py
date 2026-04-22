from sqlalchemy import Column, Integer, String, Float
from config.database import Base

class ReservationModel(Base):
    __tablename__ = "tbd_reservaciones"
    
    id = Column(Integer, primary_key=True, index=True)
    usuario_id = Column(Integer, index=True)
    fecha_ingreso = Column(String(50))
    tipo = Column(String(50))
    piso = Column(String(20))
    habitacion = Column(String(20))
    monto = Column(Float)
    estado = Column(String(50), default="pendiente")
    motivo_rechazo = Column(String(255), nullable=True)
