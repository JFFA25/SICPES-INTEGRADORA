const db = require("../database/db");

const createQuota = (data, callback) => {
  const sql = `
    INSERT INTO tbd_cuotas
      (reservacion_id, mes, anio, tipo_pago, monto_calculado, estado, fecha_vencimiento)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.reservacion_id,
    data.mes,
    data.anio,
    data.tipo_pago || "mensual",
    data.monto_calculado,
    data.estado || "pendiente",
    data.fecha_vencimiento || null,
  ];

  db.query(sql, values, callback);
};

const findQuotaByReservationPeriod = (reservacion_id, mes, anio, callback) => {
  const sql = `
    SELECT *
    FROM tbd_cuotas
    WHERE reservacion_id = ? AND mes = ? AND anio = ?
    LIMIT 1
  `;

  db.query(sql, [reservacion_id, mes, anio], callback);
};

const updateQuotaStatusByReservationPeriod = (reservacion_id, mes, anio, estado, callback) => {
  const sql = `
    UPDATE tbd_cuotas
    SET estado = ?
    WHERE reservacion_id = ? AND mes = ? AND anio = ?
  `;

  db.query(sql, [estado, reservacion_id, mes, anio], callback);
};

module.exports = {
  createQuota,
  findQuotaByReservationPeriod,
  updateQuotaStatusByReservationPeriod,
};
