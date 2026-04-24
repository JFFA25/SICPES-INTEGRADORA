from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from config.mongodb import get_nosql_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from schemas.nosql.user_detail_schema import UserDetailCreate
from schemas.nosql.hybrid_schema import HybridUserCreate
from schemas.user_schema import UserCreate
from crud.nosql import user_detail_crud
from crud import user_crud

nosql_router = APIRouter(prefix="/nosql", tags=["NoSQL Tests"])

@nosql_router.post("/hybrid-register", summary="Registro Híbrido (SQL + NoSQL)")
async def hybrid_register(
    data: HybridUserCreate, 
    db_sql: Session = Depends(get_db), 
    db_nosql: AsyncIOMotorDatabase = Depends(get_nosql_db)
):
    try:
        sql_user_data = UserCreate(
            nombre=data.nombre,
            email=data.email,
            password=data.password,
            rol=data.rol,
            confirmado=1
        )
        new_user_sql = user_crud.create_user(db_sql, sql_user_data)
        
        nosql_detail_data = UserDetailCreate(
            user_id=new_user_sql.id,
            career=data.career,
            cuatrimestre=data.cuatrimestre,
            promedio=data.promedio,
            tipo_beca=data.tipo_beca,
            blood_type=data.blood_type,
            address=data.address,
            emergency_contact=data.emergency_contact,
            hobbies=data.hobbies,
            medical_info=data.medical_info
        )
        await user_detail_crud.create_user_detail(db_nosql, nosql_detail_data)
        
        return {"status": "success", "id": new_user_sql.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@nosql_router.get("/user-details/{user_id}")
async def get_details(user_id: int, db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    detail = await user_detail_crud.get_user_detail(db, user_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Not found")
    detail["_id"] = str(detail["_id"])
    return detail
