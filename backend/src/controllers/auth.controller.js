const { createUser } = require("../models/user.model");
const { sendConfirmationEmail } = require("../utils/mailer");
const crypto = require("crypto");

const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body;

  // generar token
  const token = crypto.randomBytes(20).toString("hex");

  createUser({ nombre, email, password, token }, async (err) => {
    if (err) {
      return res.status(500).json({ error: "Error al registrar" });
    }

    // enviar correo
    await sendConfirmationEmail(email, token);

    res.json({
      message: "Se ha enviado un correo de confirmación 📩",
    });
  });
};

module.exports = { registerUser };


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

    // AQUÍ ESTÁ LA CLAVE
    if (result.affectedRows === 0) {
      return res.redirect("http://localhost:5173/error");
    }

    res.redirect("http://localhost:5173/confirmado");
  });
};

module.exports = { confirmUser };
module.exports = { registerUser, confirmUser };