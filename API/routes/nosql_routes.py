from fastapi import APIRouter, Depends, HTTPException
from config.mongodb import get_nosql_db
from motor.motor_asyncio import AsyncIOMotorDatabase
from schemas.nosql.user_detail_schema import UserDetailCreate
from schemas.nosql.audit_log_schema import AuditLogCreate
from schemas.nosql.notification_schema import NotificationCreate
from crud.nosql import user_detail_crud, audit_log_crud, notification_crud
from datetime import datetime

nosql_router = APIRouter(prefix="/nosql", tags=["NoSQL Tests"])

@nosql_router.post("/seed-test")
async def run_nosql_tests(db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    results = []
    
    try:
        # Test 1: Crear detalle de usuario
        user_detail = UserDetailCreate(
            user_id=1,
            career="Tecnologías de la Información",
            cuatrimestre=4,
            promedio=9.2,
            tipo_beca="Federal",
            blood_type="O+",
            address="Calle Falsa 123, Ciudad de México",
            emergency_contact={"name": "Juan Perez", "phone": "555-0199"},
            hobbies=["Lectura", "Programación"],
            medical_info="Alergia a la penicilina"
        )
        detail_id = await user_detail_crud.create_user_detail(db, user_detail)
        results.append({"test": 1, "status": "Success", "action": "Create User Detail", "id": detail_id})

        # Test 2: Crear log de auditoría
        audit_log = AuditLogCreate(
            admin_id=10,
            action="LOGIN_SUCCESS",
            module="AUTH",
            ip_address="192.168.1.1",
            status="SUCCESS",
            target_id="user_1",
            details={"device": "Chrome/Windows"},
            timestamp=datetime.now()
        )
        log_id = await audit_log_crud.create_audit_log(db, audit_log)
        results.append({"test": 2, "status": "Success", "action": "Create Audit Log", "id": log_id})

        # Test 3: Crear notificación
        notification = NotificationCreate(
            user_id=1,
            message="Tu reservación ha sido confirmada.",
            category="ADMIN",
            priority=1,
            type="SUCCESS"
        )
        notif_id = await notification_crud.create_notification(db, notification)
        results.append({"test": 3, "status": "Success", "action": "Create Notification", "id": notif_id})

        # Test 4: Consultar detalle de usuario
        found_detail = await user_detail_crud.get_user_detail(db, 1)
        results.append({"test": 4, "status": "Success" if found_detail else "Failed", "action": "Get User Detail", "data": str(found_detail) if found_detail else None})

        # Test 5: Consultar logs recientes
        recent_logs = await audit_log_crud.get_audit_logs(db, limit=5)
        results.append({"test": 5, "status": "Success", "action": "Get Recent Logs", "count": len(recent_logs)})

        return {
            "message": "NoSQL Test Suite Completed",
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NoSQL Test Error: {str(e)}")

@nosql_router.post("/user-details", summary="Insertar detalle de usuario")
async def create_detail(detail: UserDetailCreate, db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    detail_id = await user_detail_crud.create_user_detail(db, detail)
    return {"message": "User detail created", "id": detail_id}

@nosql_router.post("/audit-logs", summary="Insertar log de auditoría")
async def create_log(log: AuditLogCreate, db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    log_id = await audit_log_crud.create_audit_log(db, log)
    return {"message": "Audit log created", "id": log_id}

@nosql_router.post("/notifications", summary="Enviar notificación")
async def create_notif(notif: NotificationCreate, db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    notif_id = await notification_crud.create_notification(db, notif)
    return {"message": "Notification created", "id": notif_id}

@nosql_router.get("/user-details/{user_id}")
async def get_details(user_id: int, db: AsyncIOMotorDatabase = Depends(get_nosql_db)):
    detail = await user_detail_crud.get_user_detail(db, user_id)
    if not detail:
        raise HTTPException(status_code=404, detail="Details not found")
    # Convert MongoDB _id to string for JSON serialization
    detail["_id"] = str(detail["_id"])
    return detail
