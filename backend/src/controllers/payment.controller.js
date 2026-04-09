const { createPayment, getPaymentsByUser, getAllPaymentsAdmin, updatePaymentStatus } = require("../models/payment.model");

const requestPayment = (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No autenticado" });
  
  const { reservacion_id, monto, mes, anio } = req.body;
  const usuario_id = req.session.user.id;

  if (!reservacion_id || !monto || !mes || !anio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  createPayment({ reservacion_id, usuario_id, monto, mes, anio }, (err) => {
    if (err) return res.status(500).json({ error: "Error al solicitar pago" });
    res.json({ message: "Pago solicitado, esperando aprobación del admin" });
  });
}

const getMyPayments = (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No autenticado" });
  
  getPaymentsByUser(req.session.user.id, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener historial" });
    res.json(results || []);
  });
}

const getAdminPayments = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") return res.status(403).json({ error: "Prohibido" });
  
  getAllPaymentsAdmin((err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    res.json(results || []);
  });
}

const updateStatus = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") return res.status(403).json({ error: "Prohibido" });
  
  const { id } = req.params;
  const { estado } = req.body;

  updatePaymentStatus(id, estado, (err) => {
    if (err) return res.status(500).json({ error: "Error al actualizar" });
    res.json({ message: "Estado de pago actualizado" });
  });
}

module.exports = { requestPayment, getMyPayments, getAdminPayments, updateStatus };
