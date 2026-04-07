const express = require("express");
const router = express.Router();

const { registerUser, confirmUser } = require("../controllers/auth.controller.js");

router.post("/register", registerUser);
router.get("/confirm/:token", confirmUser);

module.exports = router;