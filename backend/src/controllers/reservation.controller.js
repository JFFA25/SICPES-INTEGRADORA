const db = require("../database/db");
const {
  createReservation,
  getReservationByUser,
} = require("../models/reservation.model");

// CREAR RESERVACIÓN
const createReservationController = (req, res) => {
  const { fecha_ingreso, tipo, piso, habitacion, monto } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const usuario_id = req.session.user.id;

  // VALIDAR FECHA
  const fechaHoy = new Date().toISOString().split("T")[0];

  if (fecha_ingreso < fechaHoy) {
    return res.status(400).json({
      error: "La fecha no puede ser anterior a hoy",
    });
  }

  //  VALIDAR SI YA TIENE RESERVACIÓN
  const sqlCheck = "SELECT * FROM tbd_reservaciones WHERE usuario_id = ?";

  db.query(sqlCheck, [usuario_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya tienes una reservación registrada",
      });
    }

    // CREAR RESERVACIÓN
    createReservation(
      { usuario_id, fecha_ingreso, tipo, piso, habitacion, monto },
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            error: "Error al crear reservación",
          });
        }

        res.json({
          message: "Reservación enviada correctamente",
        });
      }
    );
  });
};

// OBTENER RESERVACIÓN
const getMyReservation = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const usuario_id = req.session.user.id;

  getReservationByUser(usuario_id, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener reservación",
      });
    }

    res.json(results[0] || null);
  });
};

module.exports = {
  createReservationController,
  getMyReservation,
};