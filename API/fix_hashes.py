from config.database import SessionLocal
from models.user_model import UserModel
from passlib.context import CryptContext

db = SessionLocal()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
users = db.query(UserModel).all()
updated = 0

for u in users:
    if not u.password.startswith('$2b$'):
        print(f"Hashing password for {u.email} (current: {u.password})")
        u.password = pwd_context.hash(u.password)
        updated += 1

if updated:
    db.commit()

print(f"Updated {updated} passwords")
db.close()
