const express = require("express");
const router = express.Router();
const { isAdmin } = require("../middlewares/auth.middleware");

const reportsController = require("../controllers/reports.controller");

router.get(
    "/general",
    isAdmin,
    reportsController.generarReporteGeneral
);

router.get(
    "/dashboard-stats",
    isAdmin,
    reportsController.getDashboardStats
);

module.exports = router;