const db = require("../database/db");

// Crear reservación
const createReservation = (data, callback) => {
  const sql = `
    INSERT INTO tbd_reservaciones
    (usuario_id, fecha_ingreso, tipo, piso, habitacion, monto)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.usuario_id,
    data.fecha_ingreso,
    data.tipo,
    data.piso,
    data.habitacion,
    data.monto,
  ];

  db.query(sql, values, callback);
};

// Obtener reservación del usuario
const getReservationByUser = (usuario_id, callback) => {
  const sql = `
    SELECT * FROM tbd_reservaciones
    WHERE usuario_id = ?
    ORDER BY creado_en DESC
    LIMIT 1
  `;

  db.query(sql, [usuario_id], callback);
};

module.exports = {
  createReservation,
  getReservationByUser,
};