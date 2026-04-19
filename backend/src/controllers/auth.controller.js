const { createUser } = require("../models/user.model");
const { sendConfirmationEmail, sendForgotPasswordEmail } = require("../utils/mailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");


const loginUser = (req, res) => {
  const { email, password } = req.body;

  // VALIDACIÓN BÁSICA
  if (!email || !password) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios",
    });
  }

  const sql = "SELECT * FROM tbd_usuarios WHERE email = ?";

  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        error: "Error del servidor",
      });
    }

    // USUARIO NO EXISTE
    if (results.length === 0) {
      return res.status(400).json({
        error: "Correo o contraseña incorrectos",
      });
    }

    const user = results[0];

    // COMPROBAR CONTRASEÑA EN TEXTO PLANO O CON BCRYPT
    bcrypt.compare(password, user.password, (errBcrypt, isMatch) => {
      const isValid = user.password === password || isMatch;

      if (!isValid) {
        return res.status(400).json({
          error: "Correo o contraseña incorrectos",
        });
      }

    // NO CONFIRMADO
    if (!user.confirmado) {
      return res.status(403).json({
        error: "Debes confirmar tu correo antes de iniciar sesión",
      });
    }

    // REGENERAR SESIÓN PARA EVITAR DATOS ANTIGUOS
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al crear la sesión" });
      }

      // CREAR SESIÓN
      req.session.user = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      };

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Error al guardar la sesión" });
        }
        
        return res.json({
          message: "Login exitoso",
        });
      });
    });
    }); // FIN BCRYPT COMPARE
  });
};

const getSession = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: "No autorizado",
    });
  }

  res.json(req.session.user);
};

const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  // VALIDACIÓN DE CAMPOS VACÍOS
  if (!nombre || !email || !password || nombre.trim() === "" || email.trim() === "" || password.trim() === "") {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // generar token
  const token = crypto.randomBytes(20).toString("hex");

  createUser({ nombre, email, password, token }, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al registrar" });
    }

    // enviar correo
    await sendConfirmationEmail(email, token);

    res.json({
      message: "Se ha enviado un correo de confirmación",
    });
  });
};




const db = require("../database/db");

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

    // Si no se actualizó ningún registro, el token es inválido
    if (result.affectedRows === 0) {
      return res.redirect("http://localhost:5173/error");
    }

    res.redirect("http://localhost:5173/confirmado");
  });
};


const logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
    res.clearCookie("connect.sid");
    res.json({ message: "Sesión cerrada correctamente" });
  });
};

const forgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  db.query("SELECT * FROM tbd_usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    if (results.length === 0) return res.status(400).json({ error: "Si el correo existe, recibirás un enlace." }); // Mensaje ambiguo de seguridad

    const token = crypto.randomBytes(20).toString("hex");
    
    db.query("UPDATE tbd_usuarios SET token = ? WHERE email = ?", [token, email], async (err2) => {
      if (err2) return res.status(500).json({ error: "Error generando token" });

      try {
        await sendForgotPasswordEmail(email, token);
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

module.exports = { loginUser, registerUser, confirmUser, getSession, logoutUser, forgotPassword, resetPassword, checkResetToken };