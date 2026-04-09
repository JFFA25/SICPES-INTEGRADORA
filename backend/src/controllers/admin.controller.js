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
    SELECT r.*, u.nombre, u.email
    FROM tbd_reservaciones r
    JOIN tbd_usuarios u ON r.usuario_id = u.id
    ORDER BY r.creado_en DESC
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
    SELECT p.*, u.nombre, u.email
    FROM tbd_pagos p
    JOIN tbd_usuarios u ON p.usuario_id = u.id
    ORDER BY p.creado_en DESC
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

  const sql = "UPDATE tbd_pagos SET estado = ? WHERE id = ?";
  db.query(sql, [estado, id], (err) => {
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