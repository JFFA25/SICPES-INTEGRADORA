const { generatePDF } = require("../utils/pdfMonkey");
const db = require("../database/db");

const isValidDate = (d) => /^\d{4}-\d{2}-\d{2}$/.test(d || "");
const pct = (value, total) => (total > 0 ? Math.round((value / total) * 100) : 0);

exports.generarReporteGeneral = async (req, res) => {
    try {
        // Filtro opcional de rango de fechas (?desde=YYYY-MM-DD&hasta=YYYY-MM-DD)
        const { desde, hasta } = req.query;
        const useDateFilter = isValidDate(desde) && isValidDate(hasta);

        // 1. OBTENER LAS RESERVACIONES
        const reservationsFilter = useDateFilter
            ? `WHERE r.fecha_ingreso BETWEEN ? AND ?`
            : "";
        const [reservaciones] = await db.promise().query(`
            SELECT 
                r.id,
                u.nombre,
                r.tipo,
                r.piso,
                r.habitacion,
                r.fecha_ingreso,
                r.monto,
                r.estado
            FROM tbd_reservaciones r
            INNER JOIN tbd_usuarios u ON r.usuario_id = u.id
            ${reservationsFilter}
            ORDER BY r.id DESC
        `, useDateFilter ? [desde, hasta] : []);

        // 2. OBTENER LOS PAGOS
        const paymentsFilter = useDateFilter
            ? `WHERE p.fecha_pago BETWEEN ? AND ?`
            : "";
        const [pagos] = await db.promise().query(`
            SELECT 
                p.id,
                p.reservacion_id,
                u.nombre,
                p.mes,
                p.anio,
                p.monto_pagado,
                p.fecha_pago,
                p.estado
            FROM tbd_pagos p
            INNER JOIN tbd_reservaciones r ON p.reservacion_id = r.id
            INNER JOIN tbd_usuarios u ON r.usuario_id = u.id
            ${paymentsFilter}
            ORDER BY p.id DESC
        `, useDateFilter ? [desde, hasta] : []);

        // 3. CALCULAR LOS METRICS PARA EL "SUMMARY"
        const totalReservations = reservaciones.length;
        const acceptedReservations = reservaciones.filter(r => String(r.estado).toLowerCase() === 'aceptada').length;
        const pendingReservations = reservaciones.filter(r => String(r.estado).toLowerCase() === 'pendiente').length;
        const rejectedReservations = reservaciones.filter(r => String(r.estado).toLowerCase() === 'rechazada').length;
        const totalPayments = pagos.length;
        const paidPayments = pagos.filter(p => String(p.estado).toLowerCase() === 'pagado').length;
        const pendingPayments = pagos.filter(p => String(p.estado).toLowerCase() === 'pendiente').length;

        const totalAmount = pagos
            .filter(p => String(p.estado).toLowerCase() === 'pagado')
            .reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0);

        // 4. MAPEAR LOS DATOS AL IDIOMA Y CAMPOS EXACTOS DE LA PLANTILLA
        const payloadData = {
            generatedAt: new Date().toLocaleString("es-MX", {
                timeZone: "America/Mexico_City",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
            periodo: useDateFilter ? { desde, hasta } : { desde: null, hasta: null },
            summary: {
                totalReservations,
                acceptedReservations,
                pendingReservations,
                rejectedReservations,
                totalPayments,
                paidPayments,
                pendingPayments,
                totalAmount: totalAmount.toFixed(2)
            },
            charts: {
                reservations: [
                    { label: "Aceptadas", value: acceptedReservations, percent: pct(acceptedReservations, totalReservations) },
                    { label: "Pendientes", value: pendingReservations, percent: pct(pendingReservations, totalReservations) },
                    { label: "Rechazadas", value: rejectedReservations, percent: pct(rejectedReservations, totalReservations) }
                ],
                payments: [
                    { label: "Pagados", value: paidPayments, percent: pct(paidPayments, totalPayments) },
                    { label: "Pendientes", value: pendingPayments, percent: pct(pendingPayments, totalPayments) }
                ],
                paidPercent: pct(paidPayments, totalPayments)
            },
            reservations: reservaciones.map(r => ({
                id: r.id,
                nombre: r.nombre || "N/A",
                tipo: r.tipo || "N/A",
                habitacion: r.habitacion || "N/A",
                piso: r.piso || "N/A",
                fecha_ingreso: r.fecha_ingreso ? new Date(r.fecha_ingreso).toLocaleDateString("es-MX") : "N/A",
                monto: parseFloat(r.monto || 0).toFixed(2),
                estado: String(r.estado || "PENDIENTE").toUpperCase()
            })),
            payments: pagos.map(p => ({
                reservacion_id: p.reservacion_id,
                nombre: p.nombre || "N/A",
                mes: p.mes || 0,
                anio: p.anio || 0,
                monto: parseFloat(p.monto_pagado || 0).toFixed(2),
                estado: String(p.estado || "PENDIENTE").toUpperCase(),
                creado_en: p.fecha_pago ? new Date(p.fecha_pago).toLocaleDateString("es-MX") : "N/A"
            }))
        };

        // 5. MANDAR A GENERAR EL PDF CON EL PAYLOAD SINCRONIZADO
        const pdfResult = await generatePDF(payloadData);

        return res.status(200).json({
            success: true,
            url: pdfResult.url,
            summary: payloadData.summary,
            periodo: payloadData.periodo
        });

    } catch (error) {
        console.error("Error crítico en generarReporteGeneral:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error interno al compilar el reporte general.",
            details: error.message
        });
    }
};

// ---------------------------------------------------------------------
// Estadísticas ligeras para el dashboard en vivo (sin generar PDF).
// Pensado para hacerse polling cada pocos segundos desde el frontend,
// ya que es la única forma de reflejar cambios hechos fuera de la app
// (por ejemplo, un stored procedure corrido directo en MySQL).
// ---------------------------------------------------------------------
const MESES_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

exports.getDashboardStats = async (req, res) => {
    try {
        const [reservaciones] = await db.promise().query(
            `SELECT estado, COUNT(*) AS total FROM tbd_reservaciones GROUP BY estado`
        );

        const [pagos] = await db.promise().query(
            `SELECT estado, COUNT(*) AS total FROM tbd_pagos GROUP BY estado`
        );

        const [pagosPorMes] = await db.promise().query(`
            SELECT MONTH(fecha_pago) AS mes, YEAR(fecha_pago) AS anio, SUM(monto_pagado) AS total
            FROM tbd_pagos
            WHERE estado = 'Pagado' AND fecha_pago >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(fecha_pago), MONTH(fecha_pago)
            ORDER BY anio, mes
        `);

        const countByEstado = (rows, estado) => {
            const row = rows.find(r => String(r.estado).toLowerCase() === estado);
            return row ? row.total : 0;
        };

        const reservationsByStatus = [
            { name: "Aceptadas", value: countByEstado(reservaciones, "aceptada") },
            { name: "Pendientes", value: countByEstado(reservaciones, "pendiente") },
            { name: "Rechazadas", value: countByEstado(reservaciones, "rechazada") },
            { name: "Finalizadas", value: countByEstado(reservaciones, "finalizada") },
            { name: "Canceladas", value: countByEstado(reservaciones, "cancelada") },
        ];

        // Últimos 6 meses (incluyendo el actual), rellenando con 0 los que no tienen pagos aún
        const now = new Date();
        const monthlyRevenue = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mes = d.getMonth() + 1;
            const anio = d.getFullYear();
            const match = pagosPorMes.find(p => p.mes === mes && p.anio === anio);
            monthlyRevenue.push({
                month: `${MESES_ES[mes - 1]} ${anio}`,
                total: match ? parseFloat(match.total) : 0
            });
        }

        const totalReservations = reservaciones.reduce((sum, r) => sum + r.total, 0);
        const totalPayments = pagos.reduce((sum, p) => sum + p.total, 0);
        const paidPayments = countByEstado(pagos, "pagado");

        return res.status(200).json({
            summary: {
                totalReservations,
                acceptedReservations: countByEstado(reservaciones, "aceptada"),
                pendingReservations: countByEstado(reservaciones, "pendiente"),
                totalPayments,
                paidPayments,
                totalAmount: monthlyRevenue.reduce((sum, m) => sum + m.total, 0).toFixed(2)
            },
            reservationsByStatus,
            monthlyRevenue,
            updatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error("Error en getDashboardStats:", error.message);
        return res.status(500).json({ message: "Error al obtener estadísticas del dashboard" });
    }
};