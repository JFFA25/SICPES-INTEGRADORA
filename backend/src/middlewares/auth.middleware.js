const isAdmin = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  if (req.session.user.rol !== "admin") {
    return res.status(403).json({ error: "No autorizado" });
  }

  next();
};

module.exports = { isAdmin };