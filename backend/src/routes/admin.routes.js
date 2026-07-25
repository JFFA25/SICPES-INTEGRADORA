const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth.middleware");
const {
  getAllReservations,
  updateReservationStatus,
  getAllPayments,
  updatePaymentStatus,
  getSettings,
  updateSettings,
  generateMockData
} = require("../controllers/admin.controller");

// Todas las rutas de este router requieren sesión de administrador.
router.use(isAdmin);

// Rutas de reservaciones admin
router.get("/reservations", getAllReservations);
router.put("/reservations/:id", updateReservationStatus);

// Rutas de pagos admin
router.get("/payments", getAllPayments);
router.put("/payments/:id", updatePaymentStatus);

// Rutas de configuraciones admin
router.get("/settings", getSettings);
router.put("/settings", updateSettings);

// Ruta para generación de datos (Mocks) - solo disponible fuera de producción
if (process.env.NODE_ENV !== "production") {
  router.post("/generate-data", generateMockData);
}

module.exports = router;