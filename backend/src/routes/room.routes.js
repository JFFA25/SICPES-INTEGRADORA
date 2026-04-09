const express = require("express");
const router = express.Router();
const roomController = require("../controllers/room.controller");
const { isAdmin } = require("../middlewares/auth.middleware");

// Rutas publicas (usuarios las necesitan para ver disponibles)
router.get("/", roomController.getRooms);

// Rutas admin
router.post("/", isAdmin, roomController.addRooms);
router.delete("/:piso", isAdmin, roomController.deleteFloor);

module.exports = router;
