const { generatePDF } = require("../utils/pdfMonkey");
const db = require("../database/db"); 

exports.generarReporteGeneral = async (req, res) => {
    try {
        // 1. OBTENER LAS RESERVACIONES
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
            ORDER BY r.id DESC
        `);

        // 2. OBTENER LOS PAGOS
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
            ORDER BY p.id DESC
        `);

        // 3. CALCULAR LOS METRICS PARA EL "SUMMARY"
        const totalReservations = reservaciones.length;
        const acceptedReservations = reservaciones.filter(r => String(r.estado).toLowerCase() === 'aceptada').length;
        const pendingReservations = reservaciones.filter(r => String(r.estado).toLowerCase() === 'pendiente').length;
        const totalPayments = pagos.length;
        
        const totalAmount = pagos
            .filter(p => String(p.estado).toLowerCase() === 'pagado')
            .reduce((sum, p) => sum + parseFloat(p.monto_pagado || 0), 0);

        // 4. MAPEAR LOS DATOS AL IDIOMA Y CAMPOS EXACTOS DE LA PLANTILLA
        const payloadData = {
            summary: {
                totalReservations,
                acceptedReservations,
                pendingReservations,
                totalPayments,
                totalAmount: totalAmount.toFixed(2)
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
            url: pdfResult.url
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