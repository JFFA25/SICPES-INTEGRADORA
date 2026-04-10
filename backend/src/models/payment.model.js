const db = require("../database/db");

const createPayment = (data, callback) => {
  const fechaPago = data.fecha_pago || new Date().toISOString().slice(0, 10);
  const sql = `
    INSERT INTO tbd_pagos
      (reservacion_id, monto_pagado, monto_calculado, fecha_pago, mes, anio, tipo_pago, fecha_generada, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.reservacion_id,
    data.monto,
    data.monto_calculado ?? data.monto,
    fechaPago,
    data.mes,
    data.anio,
    data.tipo_pago || "mensual",
    new Date(),
    "Pendiente",
  ];
  db.query(sql, params, callback);
};

const findPaymentByReservationPeriod = (reservacion_id, mes, anio, callback) => {
  const sql = `
    SELECT *
    FROM tbd_pagos
    WHERE reservacion_id = ? AND mes = ? AND anio = ?
    LIMIT 1
  `;
  db.query(sql, [reservacion_id, mes, anio], callback);
};

const getPaymentById = (id, callback) => {
  const sql = `
    SELECT *
    FROM tbd_pagos
    WHERE id = ?
    LIMIT 1
  `;
  db.query(sql, [id], callback);
};

const getPaymentsByUser = (usuario_id, callback) => {
  const sql = `
    SELECT p.*, LOWER(p.estado) AS estado, p.monto_pagado AS monto,
           p.tipo_pago, p.monto_calculado, p.fecha_generada, p.mes, p.anio
    FROM tbd_pagos p
    JOIN tbd_reservaciones r ON p.reservacion_id = r.id
    WHERE r.usuario_id = ?
    ORDER BY p.anio DESC, p.mes DESC
  `;
  db.query(sql, [usuario_id], callback);
};

const getAllPaymentsAdmin = (callback) => {
  const sql = `
    SELECT p.*, LOWER(p.estado) AS estado, p.monto_pagado AS monto,
           p.tipo_pago, p.monto_calculado, p.fecha_generada, p.mes, p.anio,
           u.nombre, u.email
    FROM tbd_pagos p
    JOIN tbd_reservaciones r ON p.reservacion_id = r.id
    JOIN tbd_usuarios u ON r.usuario_id = u.id
    ORDER BY p.anio DESC, p.mes DESC
  `;
  db.query(sql, [], callback);
};

const updatePaymentStatus = (id, estado, callback) => {
  const sql = `UPDATE tbd_pagos SET estado = ? WHERE id = ?`;
  db.query(sql, [estado, id], callback);
};

module.exports = { createPayment, findPaymentByReservationPeriod, getPaymentById, getPaymentsByUser, getAllPaymentsAdmin, updatePaymentStatus };
