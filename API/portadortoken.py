from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer
from jwt_config import validate_token
from config.database import SessionLocal
from models.user_model import UserModel

class PortadorToken(HTTPBearer):
    async def __call__(self, request: Request):
        auth = await super().__call__(request)
        data = validate_token(auth.credentials)
        if not data:
            raise HTTPException(status_code=401, detail="No está autenticado o el token es inválido")
            
        # Check active session to prevent concurrent logins
        session_id = data.get("session_id")
        user_email = data.get("sub")
        
        db = SessionLocal()
        try:
            db_user = db.query(UserModel).filter(UserModel.email == user_email).first()
            if not db_user or db_user.current_session != session_id:
                raise HTTPException(status_code=401, detail="Sesión cerrada porque iniciaste sesión en otro lugar")
        finally:
            db.close()
            
        return data
