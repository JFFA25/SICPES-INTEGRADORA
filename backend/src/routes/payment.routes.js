const express = require("express");
const router = express.Router();
const { requestPayment, getMyPayments, getAdminPayments, updateStatus } = require("../controllers/payment.controller");

router.post("/request", requestPayment);
router.get("/me", getMyPayments);
router.get("/admin", getAdminPayments);
router.put("/admin/:id/status", updateStatus);

module.exports = router;
