from motor.motor_asyncio import AsyncIOMotorDatabase
from schemas.nosql.audit_log_schema import AuditLogCreate

async def create_audit_log(db: AsyncIOMotorDatabase, log: AuditLogCreate):
    log_dict = log.dict()
    result = await db.audit_logs.insert_one(log_dict)
    return str(result.inserted_id)

async def get_audit_logs(db: AsyncIOMotorDatabase, limit: int = 10):
    cursor = db.audit_logs.find().sort("timestamp", -1).limit(limit)
    return await cursor.to_list(length=limit)
