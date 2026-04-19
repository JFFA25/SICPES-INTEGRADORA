from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user_schema import UserResponse, UserCreate, UserUpdate
from crud.user_crud import get_all_users, create_user, get_user, update_user, delete_user
from portadortoken import PortadorToken
from typing import List

user_router = APIRouter()

@user_router.get("/usuarios", tags=["Usuarios"], response_model=List[UserResponse], dependencies=[Depends(PortadorToken())])
def obtener_usuarios(db: Session = Depends(get_db)):
    return get_all_users(db)

@user_router.post("/usuarios", tags=["Usuarios"], response_model=UserResponse, dependencies=[Depends(PortadorToken())])
def agregar_usuario(user_data: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user_data)

@user_router.get("/usuarios/{user_id}", tags=["Usuarios"], response_model=UserResponse, dependencies=[Depends(PortadorToken())])
def obtener_usuario(user_id: int, db: Session = Depends(get_db)):
    db_user = get_user(db, user_id)
    if not db_user: raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_user

@user_router.put("/usuarios/{user_id}", tags=["Usuarios"], response_model=UserResponse, dependencies=[Depends(PortadorToken())])
def actualizar_usuario(user_id: int, user_data: UserUpdate, db: Session = Depends(get_db)):
    updated = update_user(db, user_id, user_data)
    if not updated: raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return updated

@user_router.delete("/usuarios/{user_id}", tags=["Usuarios"], dependencies=[Depends(PortadorToken())])
def eliminar_usuario(user_id: int, db: Session = Depends(get_db)):
    deleted = delete_user(db, user_id)
    if not deleted: raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado correctamente"}
