const rateLimit = require("express-rate-limit");

// Limita intentos de login/registro para mitigar ataques de fuerza bruta.
// 15 minutos de ventana, 10 intentos por IP.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo en unos minutos." },
});

// Límite más estricto para recuperación de contraseña (evita abuso de envío de correos/SMS).
const forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes de recuperación. Intenta más tarde." },
});

// Límite general para el resto de la API (protección básica anti-abuso).
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, forgotPasswordLimiter, apiLimiter };
