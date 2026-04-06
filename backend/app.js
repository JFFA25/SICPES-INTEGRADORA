require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// IMPORTAR CONEXIÓN A BD (ESTO FALTABA)
require("./src/database/db");

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS
const authRoutes = require("./src/routes/auth.routes");
app.use("/api", authRoutes);

// PUERTO DINÁMICO
const PORT = process.env.PORT || 3000;

// INICIAR SERVIDOR
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});