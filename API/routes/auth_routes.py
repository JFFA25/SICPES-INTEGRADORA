from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from config.database import get_db
from schemas.user_schema import UserLogin
from crud.user_crud import get_user_by_email, verify_password
from jwt_config import create_access_token

auth_router = APIRouter()

@auth_router.post("/login", tags=["Autenticación"])
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user.email)
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    # Comparación de contraseñas (plano o bcrypt para compatibilidad)
    if db_user.password != user.password and not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Credenciales incorrectas")

    # Si todo sale bien
    access_token = create_access_token(data={"sub": db_user.email, "rol": db_user.rol})
    return {"access_token": access_token, "token_type": "bearer"}
