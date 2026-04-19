const db = require("../database/db");

const getRooms = (req, res) => {
  const sql = "SELECT piso, GROUP_CONCAT(habitacion ORDER BY habitacion ASC SEPARATOR ', ') AS habitaciones FROM tbi_habitaciones GROUP BY piso ORDER BY piso ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    
    // Formatear para que el frontend lo trate mas facil
    let formatted = {};
    results.forEach(row => {
      formatted[row.piso] = row.habitaciones.split(', ');
    });
    
    // Enviar ambos formatos para flexibilidad
    res.json({
      lista: results, // Arreglo para la tabla del Admin
      agrupado: formatted // Objeto para el Reservation.tsx
    });
  });
};

const addRooms = (req, res) => {
  const { piso, habitaciones } = req.body; // habitaciones es string "101, 102"
  if (!piso || !habitaciones) return res.status(400).json({ error: "Faltan datos" });

  const habArray = habitaciones.split(',').map(h => h.trim()).filter(h => h !== '');
  if(habArray.length === 0) return res.status(400).json({ error: "Lista de habitaciones vacia" });

  // Bulk insert ignore
  const values = habArray.map(h => [piso, h]);
  
  db.query("INSERT IGNORE INTO tbd_habitaciones (piso, habitacion) VALUES ?", [values], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al insertar" });
    res.json({ message: "Habitaciones agregadas correctamente", added: result.affectedRows });
  });
};

const deleteFloor = (req, res) => {
  const { piso } = req.params;
  db.query("DELETE FROM tbd_habitaciones WHERE piso = ?", [piso], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar" });
    res.json({ message: "Piso y habitaciones eliminados" });
  });
};

module.exports = {
  getRooms,
  addRooms,
  deleteFloor
};
