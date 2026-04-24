from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime

class AuditLogBase(BaseModel):
    admin_id: int
    action: str # "LOGIN_SUCCESS", "REJECT_PAYMENT", etc.
    module: str # "FINANCES", "OPERATIONS", "AUTH"
    ip_address: str
    status: str # "SUCCESS", "FAILED"
    target_id: str 
    details: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.now)

class AuditLogCreate(AuditLogBase):
    pass

class AuditLog(AuditLogBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True
