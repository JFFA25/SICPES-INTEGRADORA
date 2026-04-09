const express = require("express");
const router = express.Router();

const {loginUser, registerUser, confirmUser, getSession, logoutUser} = require("../controllers/auth.controller.js");

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/session", getSession);
router.post("/register", registerUser);
router.get("/confirm/:token", confirmUser);

module.exports = router;