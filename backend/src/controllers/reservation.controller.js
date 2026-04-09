const db = require("../database/db");
const {
  createReservation,
  getReservationByUser,
} = require("../models/reservation.model");


// CREAR RESERVACIÓN

const createReservationController = (req, res) => {
  const { fecha_ingreso, tipo, piso, habitacion, monto } = req.body;

  // validar sesión
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  const usuario_id = req.session.user.id;

  // validar fecha
  const fechaHoy = new Date().toISOString().split("T")[0];

  if (fecha_ingreso < fechaHoy) {
    return res.status(400).json({
      error: "La fecha no puede ser anterior a hoy",
    });
  }

  // validar si ya tiene reservación ACTIVA
  const sqlUserCheck = "SELECT * FROM tbd_reservaciones WHERE usuario_id = ? AND estado NOT IN ('cancelada', 'rechazada', 'finalizada')";

  db.query(sqlUserCheck, [usuario_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results.length > 0) {
      return res.status(400).json({
        error: "Ya tienes una reservación registrada",
      });
    }

    // validar si la habitación ya está reservada por otro usuario
    const sqlRoomCheck = `
      SELECT * FROM tbd_reservaciones
      WHERE piso = ?
      AND habitacion = ?
      AND estado NOT IN ('cancelada', 'rechazada', 'finalizada')
    `;

    db.query(sqlRoomCheck, [piso, habitacion], (err, roomResults) => {
      if (err) {
        return res.status(500).json({ error: "Error del servidor" });
      }

      if (roomResults.length > 0) {
        return res.status(400).json({
          error: "Esta habitación ya está ocupada. Elige otra habitación en el mismo piso.",
        });
      }

      // crear reservación
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
            message: "Reservación enviada correctamente y está pendiente de revisión",
          });
        }
      );
    });
  });
};


// OBTENER RESERVACIÓN DEL USUARIO

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


//  ADMIN: VER TODAS LAS RESERVACIONES

const getAllReservations = (req, res) => {
  const sql = `
    SELECT r.*, u.nombre, u.email
    FROM tbd_reservaciones r
    JOIN tbd_usuarios u ON r.usuario_id = u.id
    ORDER BY r.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener reservaciones",
      });
    }

    res.json(results);
  });
};


// ADMIN: ACTUALIZAR ESTADO

const updateReservationStatus = (req, res) => {
  const { id } = req.params;
  const { estado, monto, piso, habitacion, motivo_rechazo } = req.body;

  let updates = [];
  let values = [];

  if (estado) {
    const estadosValidos = ["pendiente", "aceptada", "cancelada", "rechazada", "finalizada"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }
    updates.push("estado = ?");
    values.push(estado);
  }

  if (monto !== undefined) {
    updates.push("monto = ?");
    values.push(monto);
  }

  if (piso !== undefined) {
    updates.push("piso = ?");
    values.push(piso);
  }

  if (habitacion !== undefined) {
    updates.push("habitacion = ?");
    values.push(habitacion);
  }

  if (motivo_rechazo !== undefined) {
    updates.push("motivo_rechazo = ?");
    values.push(motivo_rechazo);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No hay campos por actualizar" });
  }

  const sql = `
    UPDATE tbd_reservaciones 
    SET ${updates.join(", ")}
    WHERE id = ?
  `;
  values.push(id);

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Error al actualizar estado",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Reservación no encontrada",
      });
    }

    res.json({
      message: "Actualizado correctamente",
    });
  });
};


// OBTENER HABITACIONES OCUPADAS
const getOccupiedRooms = (req, res) => {
  const { piso } = req.query;

  const sql = `
    SELECT habitacion 
    FROM tbd_reservaciones
    WHERE piso = ?
    AND estado NOT IN ('cancelada', 'rechazada', 'finalizada')
  `;

  db.query(sql, [piso], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Error al obtener habitaciones ocupadas",
      });
    }

    const ocupadas = results.map(r => r.habitacion);

    res.json(ocupadas);
  });
};

module.exports = {
  createReservationController,
  getMyReservation,
  getAllReservations,
  updateReservationStatus,
  getOccupiedRooms
};