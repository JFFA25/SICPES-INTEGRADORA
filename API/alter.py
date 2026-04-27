from config.database import engine
from sqlalchemy import text

try:
    with engine.connect() as con:
        con.execute(text('ALTER TABLE tbd_usuarios ADD COLUMN current_session VARCHAR(255) NULL'))
        con.commit()
        print("Column added")
except Exception as e:
    print("Error:", e)
