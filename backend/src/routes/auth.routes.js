const express = require("express");
const router = express.Router();

const {loginUser, registerUser, confirmUser, verifyOtp, resendConfirmation, getSession, logoutUser, forgotPassword, resetPassword, checkResetToken} = require("../controllers/auth.controller.js");

router.post("/login", loginUser);
router.post("/auth/login", loginUser);
router.post("/logout", logoutUser);
router.get("/session", getSession);
router.post("/register", registerUser);
router.post("/auth/register", registerUser);
router.get("/confirm/:token", confirmUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-confirmation", resendConfirmation);
router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", checkResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;