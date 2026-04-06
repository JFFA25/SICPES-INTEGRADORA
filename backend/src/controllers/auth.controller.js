const { createUser } = require("../models/user.model");

const registerUser = (req, res) => {
  const { nombre, email, password } = req.body;

  // VALIDACIONES BACKEND
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // GUARDAR EN BD
  createUser({ nombre, email, password }, (err, result) => {
    if (err) {
      console.error(err);

      // email duplicado
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "El correo ya está registrado" });
      }

      return res.status(500).json({ error: "Error al registrar usuario" });
    }

    res.json({ message: "Usuario guardado en MySQL 🎉" });
  });
};

module.exports = {
  registerUser,
};