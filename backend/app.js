require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();

// CONEXIÓN BD
require("./src/database/db");

//  CORS (SOLO UNA VEZ Y BIEN CONFIGURADO)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// MIDDLEWARES
app.use(express.json());

// SESSION (ANTES DE RUTAS)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

// RUTAS (DESPUÉS DE SESSION)
const authRoutes = require("./src/routes/auth.routes");
app.use("/api", authRoutes);

// SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});