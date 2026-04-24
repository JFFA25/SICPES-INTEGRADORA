from motor.motor_asyncio import AsyncIOMotorDatabase
from schemas.nosql.notification_schema import NotificationCreate

async def create_notification(db: AsyncIOMotorDatabase, notification: NotificationCreate):
    notification_dict = notification.dict()
    result = await db.notifications.insert_one(notification_dict)
    return str(result.inserted_id)

async def get_unread_notifications(db: AsyncIOMotorDatabase, user_id: int):
    cursor = db.notifications.find({"user_id": user_id, "is_read": False})
    return await cursor.to_list(length=100)
