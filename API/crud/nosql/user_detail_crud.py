from motor.motor_asyncio import AsyncIOMotorDatabase
from schemas.nosql.user_detail_schema import UserDetailCreate

async def create_user_detail(db: AsyncIOMotorDatabase, detail: UserDetailCreate):
    detail_dict = detail.dict()
    result = await db.user_details.insert_one(detail_dict)
    return str(result.inserted_id)

async def get_user_detail(db: AsyncIOMotorDatabase, user_id: int):
    return await db.user_details.find_one({"user_id": user_id})
