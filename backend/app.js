require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");

// 1. IMPORTAR MÓDULOS NATIVOS PARA HTTPS
const https = require("https");
const fs = require("fs");
const path = require("path");

const app = express();

// CONEXIÓN BD
require("./src/database/db");

// CORS - Actualizado a HTTPS para coincidir con tu nuevo frontend de Vite
app.use(
  cors({
    origin: "https://localhost:5173", // <-- Cambiado de http a https
    credentials: true,
  })
);

// MIDDLEWARES
app.use(express.json());

// SESSION - Configuración optimizada para HTTPS de producción/desarrollo local seguro
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secreto",
    resave: false,
    saveUninitialized: false,
    rolling: true, // Renueva la sesión cada vez que el usuario hace una petición
    cookie: {
      secure: true, // <-- CAMBIADO A TRUE: Las cookies ahora requieren HTTPS obligatoriamente
      httpOnly: true,
      sameSite: "none", // <-- CAMBIADO A NONE: Permite enviar la cookie de sesión entre diferentes puertos locales de forma segura
      maxAge: 5 * 60 * 1000, // 5 minutos exactos de inactividad
    },
  })
);

// RUTAS (DESPUÉS DE SESSION)
const authRoutes = require("./src/routes/auth.routes");
app.use("/api", authRoutes);

const reservationRoutes = require("./src/routes/reservation.routes");
app.use("/api", reservationRoutes);

const paymentRoutes = require("./src/routes/payment.routes");
app.use("/api/payment", paymentRoutes);

const roomRoutes = require("./src/routes/room.routes");
app.use("/api/rooms", roomRoutes);

const adminRoutes = require("./src/routes/admin.routes");
app.use("/api/admin", adminRoutes);

const adminController = require("./src/controllers/admin.controller");
app.get("/api/settings", adminController.getPublicSettings);

const externalRoutes = require("./src/routes/external.routes");
app.use("/api", externalRoutes);

// CONTROL DE USUARIOS POR DEFECTO
const createDefaultUsers = require("./src/utils/initUsers");
createDefaultUsers();

// 2. CONFIGURACIÓN DEL SERVIDOR HTTPS
const PORT = process.env.PORT || 3000;

// Leemos tus certificados locales generados con mkcert
// Asegúrate de que los archivos .pem estén en la raíz de tu proyecto backend
const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, "./localhost+2-key.pem")),
  cert: fs.readFileSync(path.resolve(__dirname, "./localhost+2.pem"))
};

// Envolvemos la app de Express en el servidor HTTPS de Node.js
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Servidor seguro corriendo en https://localhost:${PORT}`);
});
