const express = require("express");
const router = express.Router();

// IMPORTAR CONTROLLERS (TODOS)
const {
  createReservationController,
  getMyReservation,
  getAllReservations,
  updateReservationStatus,
  getOccupiedRooms
} = require("../controllers/reservation.controller");

// MIDDLEWARE ADMIN
const { isAdmin } = require("../middlewares/auth.middleware");

// USUARIO
router.post("/reservation", createReservationController);
router.get("/reservation/me", getMyReservation);
router.get("/reservation/occupied", getOccupiedRooms);

// ADMIN
router.get("/admin/reservations", isAdmin, getAllReservations);
router.put("/admin/reservations/:id", isAdmin, updateReservationStatus);

module.exports = router;