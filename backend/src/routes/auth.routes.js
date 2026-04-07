const express = require("express");
const router = express.Router();

const {loginUser, registerUser, confirmUser ,getSession } = require("../controllers/auth.controller.js");

router.post("/login", loginUser);
router.get("/session", getSession);
router.post("/register", registerUser);
router.get("/confirm/:token", confirmUser);

module.exports = router;