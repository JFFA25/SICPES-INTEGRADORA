const express = require("express");
const router = express.Router();
const { geocodeAddress, fetchExchangeRate } = require("../utils/externalServices");
const { sendOtpCode } = require("../utils/notifications");

router.post("/notifications/otp", async (req, res) => {
  const { to, code, channel } = req.body;
  if (!to || !code) {
    return res.status(400).json({ error: "Faltan datos para enviar el código" });
  }

  const result = await sendOtpCode({ to, code, channel });
  return res.json({ ok: true, ...result });
});

router.get("/external/geocode", async (req, res) => {
  const { address } = req.query;
  const result = await geocodeAddress(address);
  res.json(result);
});

router.get("/external/exchange-rate", async (req, res) => {
  const { currency } = req.query;
  const result = await fetchExchangeRate(currency);
  res.json(result);
});

module.exports = router;
