from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")
ALGORITHM = "HS256"

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=120)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def validate_token(token: str) -> dict:
    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return data
    except JWTError:
        return None
