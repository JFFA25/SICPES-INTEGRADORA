const express = require("express");
const router = express.Router();

const {
  createReservationController,
  getMyReservation,
} = require("../controllers/reservation.controller");

// crear reservación
router.post("/reservation", createReservationController);

// obtener reservación del usuario
router.get("/reservation/me", getMyReservation);

module.exports = router;