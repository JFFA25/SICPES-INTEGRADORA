from sqlalchemy import Column, Integer, String, Float
from config.database import Base

class QuotaModel(Base):
    __tablename__ = "tbd_cuotas"
    
    id = Column(Integer, primary_key=True, index=True)
    reservacion_id = Column(Integer, index=True)
    mes = Column(Integer)
    anio = Column(Integer)
    tipo_pago = Column(String(50))
    monto_calculado = Column(Float)
    estado = Column(String(50), default="pendiente")
    fecha_vencimiento = Column(String(50))
