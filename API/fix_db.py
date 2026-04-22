from sqlalchemy import create_engine, text

engine = create_engine('mysql+pymysql://root:1234@localhost:3307/sicpes')
try:
    with engine.begin() as conn:
        conn.execute(text('SET FOREIGN_KEY_CHECKS = 0;'))
        try: conn.execute(text('ALTER TABLE tbd_usuarios MODIFY id INT AUTO_INCREMENT;'))
        except: pass
        try: conn.execute(text('ALTER TABLE tbd_reservaciones MODIFY id INT AUTO_INCREMENT;'))
        except: pass
        try: conn.execute(text('ALTER TABLE tbi_habitaciones MODIFY id INT AUTO_INCREMENT;'))
        except: pass
        try: conn.execute(text('ALTER TABLE tbd_cuotas MODIFY id INT AUTO_INCREMENT;'))
        except: pass
        try: conn.execute(text('ALTER TABLE tbd_pagos MODIFY id INT AUTO_INCREMENT;'))
        except: pass
        conn.execute(text('SET FOREIGN_KEY_CHECKS = 1;'))
    print("Auto Increment fixes applied perfectly.")
except Exception as e:
    print("Error:", e)
