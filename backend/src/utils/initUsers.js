const db = require("../database/db");
const bcrypt = require("bcrypt");

const createDefaultUsers = async () => {
  try {
    const adminEmail = "sonic.amador@gmail.com";
    const userEmail = "flores.amador2009@gmail.com";
    
    const adminPass = await bcrypt.hash("paco1234", 10);
    const userPass = await bcrypt.hash("luis1234", 10);

    // Verificar y crear Admin
    db.query("SELECT * FROM tbd_usuarios WHERE email = ?", [adminEmail], (err, results) => {
      if (err) return console.error("Error comprobando admin:", err);
      
      if (results.length === 0) {
        const sql = "INSERT INTO tbd_usuarios (nombre, email, password, rol, confirmado) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, ["Jose Francisco", adminEmail, adminPass, "admin", 1], (err) => {
          if (err) console.error("Error creando admin:", err);
          else console.log("Usuario Admin 'Jose Francisco' creado por defecto.");
        });
      } else {
        console.log("Admin 'Jose Francisco' ya existe. Ignorando...");
      }
    });

    // Verificar y crear Usuario regular
    db.query("SELECT * FROM tbd_usuarios WHERE email = ?", [userEmail], (err, results) => {
      if (err) return console.error("Error comprobando usuario regular:", err);
      
      if (results.length === 0) {
        const sql = "INSERT INTO tbd_usuarios (nombre, email, password, rol, confirmado) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, ["Luis Angel", userEmail, userPass, "user", 1], (err) => {
          if (err) console.error("Error creando usuario Luis:", err);
          else console.log("Usuario Regular 'Luis Angel' creado por defecto.");
        });
      } else {
        console.log("Usuario Regular 'Luis Angel' ya existe. Ignorando...");
      }
    });

  } catch (error) {
    console.error("Error general en createDefaultUsers:", error);
  }
};

module.exports = createDefaultUsers;
