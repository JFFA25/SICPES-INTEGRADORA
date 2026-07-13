const { createUser } = require("../models/user.model");
const { sendConfirmationEmail, sendForgotPasswordEmail } = require("../utils/mailer");
const { sendOtpCode } = require("../utils/notifications");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const db = require("../database/db");

// GLOBAL MAP TO TRACK USER SESSIONS
const activeSessions = new Map();
const pendingVerifications = new Map();
const OTP_TTL_MS = 10 * 60 * 1000;

const normalizeEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));
const passwordMatches = async (storedPassword, suppliedPassword) => {
  if (!storedPassword || !suppliedPassword) return false;

  if (typeof storedPassword === "string" && (storedPassword.startsWith("$2") || storedPassword.startsWith("$2a") || storedPassword.startsWith("$2b"))) {
    return bcrypt.compare(suppliedPassword, storedPassword);
  }

  return storedPassword === suppliedPassword;
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = "SELECT * FROM tbd_usuarios WHERE email = ?";

  db.query(sql, [normalizeEmail(email)], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }

    const user = results[0];
    const isValid = await passwordMatches(user.password, password);

    if (!isValid) {
      return res.status(400).json({ error: "Correo o contraseña incorrectos" });
    }

    if (!user.confirmado) {
      return res.status(403).json({ error: "Debes confirmar tu correo antes de iniciar sesión" });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al crear la sesión" });
      }

      if (activeSessions.has(user.id)) {
        const oldSessionId = activeSessions.get(user.id);
        if (req.sessionStore && req.sessionStore.destroy) {
          req.sessionStore.destroy(oldSessionId, (err) => {
            if (err) console.error("Error al destruir sesión antigua:", err);
          });
        }
      }

      activeSessions.set(user.id, req.session.id);
      req.session.user = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Error al guardar la sesión" });
        }

        return res.json({ message: "Login exitoso" });
      });
    });
  });
};

const getSession = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autorizado" });
  }

  res.json(req.session.user);
};

const registerUser = async (req, res) => {
  const { nombre, email, password, telefono, phone } = req.body;

  if (!nombre || !email || !password || nombre.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const normalizedEmail = normalizeEmail(email);
  const token = crypto.randomBytes(20).toString("hex");
  const otp = generateOtp();
  const phoneValue = telefono || phone || "";

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    createUser({ nombre, email: normalizedEmail, password: hashedPassword, token, telefono: phoneValue }, async (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al registrar" });
      }

      pendingVerifications.set(normalizedEmail, {
        email: normalizedEmail,
        otp,
        expiresAt: Date.now() + OTP_TTL_MS,
        phone: phoneValue,
      });

      // await sendConfirmationEmail(normalizedEmail, token); // Disabled automatically on registration as requested

      if (phoneValue) {
        await sendOtpCode({ to: phoneValue, code: otp, channel: phoneValue.includes("whatsapp") ? "whatsapp" : "sms" });
      }

      res.json({
        message: "Registro exitoso. Revisa tu correo para confirmar tu cuenta y/o tu código de verificación.",
        requiresVerification: true,
        email: normalizedEmail,
      });
    });
  } catch (error) {
    console.error("Error al hashear contraseña:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

const confirmUser = (req, res) => {
  const { token } = req.params;

  const sql = `
    UPDATE tbd_usuarios 
    SET confirmado = 1, token = NULL 
    WHERE token = ?
  `;

  db.query(sql, [token], (err, result) => {
    if (err) {
      console.error(err);
      return res.redirect("http://localhost:5173/error");
    }

    if (result.affectedRows === 0) {
      return res.redirect("http://localhost:5173/error");
    }

    res.redirect("http://localhost:5173/confirmado");
  });
};

const verifyOtp = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email y código son obligatorios" });
  }

  const normalizedEmail = normalizeEmail(email);
  const pending = pendingVerifications.get(normalizedEmail);

  if (!pending) {
    return res.status(400).json({ error: "No hay un código de verificación activo para este correo" });
  }

  if (Date.now() > pending.expiresAt) {
    pendingVerifications.delete(normalizedEmail);
    return res.status(400).json({ error: "El código ha expirado. Solicita uno nuevo" });
  }

  if (String(code) !== String(pending.otp)) {
    return res.status(400).json({ error: "Código de verificación incorrecto" });
  }

  const sql = "UPDATE tbd_usuarios SET confirmado = 1, token = NULL WHERE email = ?";
  db.query(sql, [normalizedEmail], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al verificar la cuenta" });
    }

    pendingVerifications.delete(normalizedEmail);
    return res.json({ message: "Cuenta verificada correctamente" });
  });
};

const resendConfirmation = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const normalizedEmail = normalizeEmail(email);
  db.query("SELECT * FROM tbd_usuarios WHERE email = ?", [normalizedEmail], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    if (results.length === 0) return res.status(404).json({ error: "No se encontró el usuario" });

    const token = crypto.randomBytes(20).toString("hex");
    db.query("UPDATE tbd_usuarios SET token = ? WHERE email = ?", [token, normalizedEmail], async (err2) => {
      if (err2) return res.status(500).json({ error: "Error generando token" });

      await sendConfirmationEmail(normalizedEmail, token);
      res.json({ message: "Se ha reenviado el correo de confirmación" });
    });
  });
};

const logoutUser = (req, res) => {
  if (req.session.user && activeSessions.has(req.session.user.id)) {
    activeSessions.delete(req.session.user.id);
  }
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  db.query("SELECT * FROM tbd_usuarios WHERE email = ?", [normalizeEmail(email)], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    if (results.length === 0) return res.status(400).json({ error: "Si el correo existe, recibirás un enlace." });

    const token = crypto.randomBytes(20).toString("hex");

    db.query("UPDATE tbd_usuarios SET token = ? WHERE email = ?", [token, normalizeEmail(email)], async (err2) => {
      if (err2) return res.status(500).json({ error: "Error generando token" });

      try {
        await sendForgotPasswordEmail(normalizeEmail(email), token);
        res.json({ message: "Si el correo existe, recibirás un enlace de recuperación." });
      } catch (e) {
        res.status(500).json({ error: "Error enviando correo" });
      }
    });
  });
};

const resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: "La contraseña debe tener mínimo 8 caracteres." });
  }

  db.query("SELECT * FROM tbd_usuarios WHERE token = ?", [token], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    if (results.length === 0) return res.status(400).json({ error: "Token inválido o expirado." });

    const user = results[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query("UPDATE tbd_usuarios SET password = ?, token = NULL WHERE id = ?", [hashedPassword, user.id], (err2) => {
      if (err2) return res.status(500).json({ error: "Error actualizando contraseña" });
      res.json({ message: "Contraseña actualizada correctamente" });
    });
  });
};

const checkResetToken = (req, res) => {
  const { token } = req.params;
  db.query("SELECT * FROM tbd_usuarios WHERE token = ?", [token], (err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    if (results.length === 0) return res.status(400).json({ error: "Token inválido o expirado." });
    res.json({ message: "Token válido" });
  });
};

module.exports = { loginUser, registerUser, confirmUser, verifyOtp, resendConfirmation, getSession, logoutUser, forgotPassword, resetPassword, checkResetToken };