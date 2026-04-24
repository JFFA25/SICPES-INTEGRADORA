from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user_schema import UserLogin
from crud.user_crud import get_user_by_email, verify_password
from jwt_config import create_access_token

from portadortoken import PortadorToken

auth_router = APIRouter()

@auth_router.post("/login", tags=["Autenticación"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    if db_user.password != user.password and not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    access_token = create_access_token(data={"sub": db_user.email, "rol": db_user.rol, "id": db_user.id, "nombre": db_user.nombre})
    return {"access_token": access_token, "token_type": "bearer"}

@auth_router.get("/session", tags=["Autenticación"])
def get_session(token: str = Depends(PortadorToken())):
    # El PortadorToken ya valida el token y nos devuelve el payload (usuario)
    return token
