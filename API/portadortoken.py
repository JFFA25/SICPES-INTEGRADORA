from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer
from jwt_config import validate_token

class PortadorToken(HTTPBearer):
    async def __call__(self, request: Request):
        auth = await super().__call__(request)
        data = validate_token(auth.credentials)
        if not data:
            raise HTTPException(status_code=401, detail="No está autenticado o el token es inválido")
            
        if data.get("rol") != "admin":
            raise HTTPException(status_code=403, detail="Acceso denegado. Exclusivo para Administradores.")
            
        return data
