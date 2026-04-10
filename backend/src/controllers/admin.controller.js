const db = require("../database/db");

let appSettings = {
  precioIndividual: 2500,
  precioCompartida: 1800,
  emailAdmin: "admin@sicpes.com"
};

// OBTENER TODAS LAS RESERVACIONES (ADMIN)
const getAllReservations = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  const sql = `
    SELECT p.*, p.monto_pagado AS monto, u.nombre, u.email, MONTH(p.fecha_pago) AS mes, YEAR(p.fecha_pago) AS anio
    FROM tbd_pagos p
    JOIN tbd_reservaciones r ON p.reservacion_id = r.id
    JOIN tbd_usuarios u ON r.usuario_id = u.id
    ORDER BY p.fecha_pago DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
};

// ACTUALIZAR ESTADO DE RESERVACIÓN (ADMIN)
const updateReservationStatus = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  const { id } = req.params;
  const { estado, motivo_rechazo, piso, habitacion, monto } = req.body;

  let sql, values;

  if (estado === "aceptada" && piso && habitacion && monto) {
    // Si se acepta, actualizar también los detalles
    sql = "UPDATE tbd_reservaciones SET estado = ?, motivo_rechazo = ?, piso = ?, habitacion = ?, monto = ? WHERE id = ?";
    values = [estado, motivo_rechazo || null, piso, habitacion, monto, id];
  } else {
    sql = "UPDATE tbd_reservaciones SET estado = ?, motivo_rechazo = ? WHERE id = ?";
    values = [estado, motivo_rechazo || null, id];
  }

  db.query(sql, values, (err) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json({ message: "Reservación actualizada" });
  });
};

// OBTENER TODOS LOS PAGOS (ADMIN)
const getAllPayments = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  const sql = `
    SELECT p.*, u.nombre, u.email, MONTH(p.fecha_pago) AS mes, YEAR(p.fecha_pago) AS anio
    FROM tbd_pagos p
    JOIN tbd_reservaciones r ON p.reservacion_id = r.id
    JOIN tbd_usuarios u ON r.usuario_id = u.id
    ORDER BY p.fecha_pago DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
};

// ACTUALIZAR ESTADO DE PAGO (ADMIN)
const updatePaymentStatus = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  const { id } = req.params;
  const { estado } = req.body;

  const normalized = String(estado || "").toLowerCase();
  const statusMap = {
    pendiente: "Pendiente",
    aprobado: "Pagado",
    pagado: "Pagado",
    rechazado: "Atrasado",
    atrasado: "Atrasado",
  };

  const dbEstado = statusMap[normalized];
  if (!dbEstado) {
    return res.status(400).json({ error: "Estado de pago inválido" });
  }

  const sql = "UPDATE tbd_pagos SET estado = ? WHERE id = ?";
  db.query(sql, [dbEstado, id], (err) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json({ message: "Pago actualizado" });
  });
};

// OBTENER CONFIGURACIONES (ADMIN)
const getSettings = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  res.json(appSettings);
};

const getPublicSettings = (req, res) => {
  res.json(appSettings);
};

// ACTUALIZAR CONFIGURACIONES (ADMIN)
const updateSettings = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  const { precioIndividual, precioCompartida, emailAdmin } = req.body;

  if (!precioIndividual || !precioCompartida || !emailAdmin) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  appSettings = {
    precioIndividual,
    precioCompartida,
    emailAdmin,
  };

  res.json({ message: "Configuraciones actualizadas" });
};

module.exports = {
  getAllReservations,
  updateReservationStatus,
  getAllPayments,
  updatePaymentStatus,
  getSettings,
  getPublicSettings,
  updateSettings
};