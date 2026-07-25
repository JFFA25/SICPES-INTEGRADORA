const express = require("express");
const router = express.Router();
const { authLimiter, forgotPasswordLimiter } = require("../middlewares/rateLimiter");

const {loginUser, registerUser, confirmUser, verifyOtp, resendConfirmation, getSession, logoutUser, forgotPassword, resetPassword, checkResetToken} = require("../controllers/auth.controller.js");

router.post("/login", authLimiter, loginUser);
router.post("/auth/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.get("/session", getSession);
router.post("/register", authLimiter, registerUser);
router.post("/auth/register", authLimiter, registerUser);
router.get("/confirm/:token", confirmUser);
router.post("/verify-otp", authLimiter, verifyOtp);
router.post("/resend-confirmation", authLimiter, resendConfirmation);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.get("/reset-password/:token", checkResetToken);
router.post("/reset-password/:token", resetPassword);

module.exports = router;