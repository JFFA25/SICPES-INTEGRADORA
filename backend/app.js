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
    rolling: true, // Renueva la sesión cada vez que el usuario hace una petición (interactúa)
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
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

// SERVIDOR
const PORT = process.env.PORT || 3000;

const createDefaultUsers = require("./src/utils/initUsers");
createDefaultUsers();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});