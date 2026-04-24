from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class NotificationBase(BaseModel):
    user_id: int
    message: str
    category: str # "PAYMENT", "MAINTENANCE", "ADMIN"
    priority: int # 1 (Alta), 2 (Media), 3 (Baja)
    type: str # "INFO", "WARNING", "ALERT"
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.now)

class NotificationCreate(NotificationBase):
    pass

class Notification(NotificationBase):
    id: Optional[str] = Field(None, alias="_id")

    class Config:
        populate_by_name = True
