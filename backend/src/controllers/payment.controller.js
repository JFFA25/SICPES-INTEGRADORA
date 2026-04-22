const { createPayment, findPaymentByReservationPeriod, getPaymentById, getPaymentsByUser, getAllPaymentsAdmin, updatePaymentStatus } = require("../models/payment.model");
const { createQuota, findQuotaByReservationPeriod, updateQuotaStatusByReservationPeriod } = require("../models/quota.model");
const db = require("../database/db");

const requestPayment = (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No autenticado" });

  const { reservacion_id, monto, fecha_pago, mes, anio } = req.body;

  if (!reservacion_id || !monto || !fecha_pago || !mes || !anio) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  const mesNumber = Number(mes);
  const anioNumber = Number(anio);
  if (!Number.isInteger(mesNumber) || mesNumber < 1 || mesNumber > 12 || !Number.isInteger(anioNumber) || anioNumber < 2000) {
    return res.status(400).json({ error: "Mes o año inválido" });
  }

  const formattedFechaPago = `${anioNumber}-${String(mesNumber).padStart(2, "0")}-01`;

  db.query(
    `SELECT * FROM tbd_reservaciones WHERE id = ? LIMIT 1`,
    [reservacion_id],
    (err, reservationRows) => {
      if (err) {
        console.error("Error al buscar reservación:", err);
        return res.status(500).json({ error: "Error interno" });
      }

      const reservation = reservationRows?.[0];
      if (!reservation) {
        return res.status(404).json({ error: "Reservación no encontrada" });
      }

      if (req.session.user.rol !== "admin" && reservation.usuario_id !== req.session.user.id) {
        return res.status(403).json({ error: "No autorizado" });
      }

      const basePrice = reservation.tipo === "individual" ? 2000 : 1200;
      let startYear = 0;
      let startMonth = 0;
      let startDay = 0;
      if (reservation.fecha_ingreso) {
        const ingresoDate = new Date(reservation.fecha_ingreso);
        if (!Number.isNaN(ingresoDate.getTime())) {
          startYear = ingresoDate.getFullYear();
          startMonth = ingresoDate.getMonth() + 1;
          startDay = ingresoDate.getDate();
        }
      }

      const isProratedCondition = startYear === anioNumber && startMonth === mesNumber;
      const weekIndex = Math.min(4, Math.max(1, Math.ceil(startDay / 7)));
      
      // La regla de negocio solicitada para cobrar por semana de llegada (1=300, 2=600, 3=900, 4=1200)
      const montoProrrateado = (basePrice / 4) * weekIndex;

      // Consultar si es la primera vez que ests usuario paga históricamente 
      db.query(
        `SELECT COUNT(*) AS pagosPrevios FROM tbd_pagos WHERE reservacion_id IN (SELECT id FROM tbd_reservaciones WHERE usuario_id = ?)`,
        [reservation.usuario_id],
        (errPagos, resultPagos) => {
          if (errPagos) return res.status(500).json({ error: "Error verificando historial" });

          const esPrimerPagoHistorico = resultPagos[0].pagosPrevios === 0;
          const isProrated = isProratedCondition && esPrimerPagoHistorico;

          const montoCalculado = isProrated ? parseFloat(montoProrrateado.toFixed(2)) : basePrice;
          const tipo_pago = isProrated ? "prorrateo" : "mensual";

      findPaymentByReservationPeriod(reservacion_id, mesNumber, anioNumber, (err2, existing) => {
        if (err2) {
          console.error("Error al buscar pago existente:", err2);
          return res.status(500).json({ error: "Error interno" });
        }

        if (existing && existing.length > 0) {
          return res.status(400).json({ error: "Ya existe un pago para ese periodo" });
        }

        const quotaData = {
          reservacion_id,
          mes: mesNumber,
          anio: anioNumber,
          tipo_pago,
          monto_calculado: montoCalculado,
          estado: "pendiente",
          fecha_vencimiento: formattedFechaPago,
        };

        findQuotaByReservationPeriod(reservacion_id, mesNumber, anioNumber, (err3, quotaRows) => {
          if (err3) {
            console.error("Error al buscar cuota existente:", err3);
            return res.status(500).json({ error: "Error interno" });
          }

          const createPaymentRecord = () => {
            createPayment(
              {
                reservacion_id,
                monto,
                monto_calculado: montoCalculado,
                fecha_pago: formattedFechaPago,
                mes: mesNumber,
                anio: anioNumber,
                tipo_pago,
              },
              (err4) => {
                if (err4) {
                  console.error("Error al solicitar pago:", err4);
                  return res.status(500).json({ error: "Error al solicitar pago" });
                }
                res.json({ message: "Pago solicitado, esperando aprobación del admin" });
              }
            );
          };

          if (!quotaRows || quotaRows.length === 0) {
            createQuota(quotaData, (err4) => {
              if (err4) {
                console.error("Error al crear cuota:", err4);
                return res.status(500).json({ error: "Error interno" });
              }
              createPaymentRecord();
            });
          } else {
            createPaymentRecord();
          }
        });
      });
        } // Fin del callback de db.query(pagos previos)
      );
    }
  );
};

const getMyPayments = (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: "No autenticado" });

  getPaymentsByUser(req.session.user.id, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener historial" });
    res.json(results || []);
  });
};

const getAdminPayments = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") return res.status(403).json({ error: "Prohibido" });

  getAllPaymentsAdmin((err, results) => {
    if (err) return res.status(500).json({ error: "Error interno" });
    res.json(results || []);
  });
};

const updateStatus = (req, res) => {
  if (!req.session.user || req.session.user.rol !== "admin") return res.status(403).json({ error: "Prohibido" });

  const { id } = req.params;
  const { estado } = req.body;

  getPaymentById(id, (err, rows) => {
    if (err) {
      console.error("Error al buscar pago:", err);
      return res.status(500).json({ error: "Error interno" });
    }

    const payment = rows?.[0];
    if (!payment) {
      return res.status(404).json({ error: "Pago no encontrado" });
    }

    updatePaymentStatus(id, estado, (err2) => {
      if (err2) {
        console.error("Error al actualizar pago:", err2);
        return res.status(500).json({ error: "Error al actualizar" });
      }

      if (estado === "pagado") {
        updateQuotaStatusByReservationPeriod(payment.reservacion_id, payment.mes, payment.anio, "pagada", (err3) => {
          if (err3) console.error("Error al actualizar cuota:", err3);
          return res.json({ message: "Estado de pago actualizado" });
        });
      } else {
        res.json({ message: "Estado de pago actualizado" });
      }
    });
  });
};

module.exports = { requestPayment, getMyPayments, getAdminPayments, updateStatus };
