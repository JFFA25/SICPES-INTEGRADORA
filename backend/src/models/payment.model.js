const db = require("../database/db");

const createPayment = (data, callback) => {
  const sql = `INSERT INTO tbd_pagos (reservacion_id, usuario_id, monto, mes, anio) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [data.reservacion_id, data.usuario_id, data.monto, data.mes, data.anio], callback);
}

const getPaymentsByUser = (usuario_id, callback) => {
  const sql = `SELECT * FROM tbd_pagos WHERE usuario_id = ? ORDER BY anio DESC, mes DESC, creado_en DESC`;
  db.query(sql, [usuario_id], callback);
}

const getAllPaymentsAdmin = (callback) => {
  const sql = `
    SELECT p.*, u.nombre, r.habitacion, r.piso 
    FROM tbd_pagos p
    JOIN tbd_usuarios u ON p.usuario_id = u.id
    JOIN tbd_reservaciones r ON p.reservacion_id = r.id
    ORDER BY p.creado_en DESC
  `;
  db.query(sql, [], callback);
}

const updatePaymentStatus = (id, estado, callback) => {
  const sql = `UPDATE tbd_pagos SET estado = ? WHERE id = ?`;
  db.query(sql, [estado, id], callback);
}

module.exports = { createPayment, getPaymentsByUser, getAllPaymentsAdmin, updatePaymentStatus };
