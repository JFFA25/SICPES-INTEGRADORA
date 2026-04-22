import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import icon from "../assets/images/icon.png";

const Payments = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState<any>(null);
    const [reservation, setReservation] = useState<any>(null);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [payments, setPayments] = useState<any[]>([]);
    const [currentMonthStatus, setCurrentMonthStatus] = useState<string | null>(null);
    const [isProrated, setIsProrated] = useState(false);
    const [paymentMonth, setPaymentMonth] = useState<number | null>(null);
    const [paymentYear, setPaymentYear] = useState<number | null>(null);
    const [paymentLabel, setPaymentLabel] = useState("MES ACTUAL");

    useEffect(() => {
        document.title = "Pagos";

        const fetchData = async () => {
            let reservationData: any = null;
            try {
                // SESIÓN
                const sessionRes = await fetch(`${import.meta.env.VITE_API_URL}/api/session`, {
                    credentials: "include",
                });

                if (!sessionRes.ok) {
                    navigate("/login");
                    return;
                }
                const sessionData = await sessionRes.json();
                setUser(sessionData);

                // RESERVACIÓN
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reservation/me`, {
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    reservationData = data;
                    setReservation(data);
                    
                    if (data && data.estado === "aceptada") {
                        calculatePayment(data);
                    }
                }

                // PAGOS
                const payRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/me`, {
                    credentials: "include",
                });
                if (payRes.ok) {
                        const pData = await payRes.json();
                    const normalizedPayments = pData.map((p: any) => ({
                        ...p,
                        mes: Number(p.mes),
                        anio: Number(p.anio),
                        estado: String(p.estado || "").toLowerCase(),
                    }));
                    setPayments(normalizedPayments);

                    const today = new Date();
                    const currentMonth = today.getMonth() + 1;
                    const currentYear = today.getFullYear();

                    const currentPayment = normalizedPayments.find((p: any) => p.mes === currentMonth && p.anio === currentYear);
                    let targetMonth = currentMonth;
                    let targetYear = currentYear;
                    let targetStatus = currentPayment?.estado ?? null;
                    let label = "MES ACTUAL";

                    if (currentPayment?.estado === "pagado") {
                        targetMonth = currentMonth === 12 ? 1 : currentMonth + 1;
                        targetYear = currentMonth === 12 ? currentYear + 1 : currentYear;
                        const nextPayment = normalizedPayments.find((p: any) => p.mes === targetMonth && p.anio === targetYear);
                        targetStatus = nextPayment?.estado ?? null;
                        label = "SIGUIENTE PAGO";
                    }

                    setPaymentMonth(targetMonth);
                    setPaymentYear(targetYear);
                    setPaymentLabel(label);
                    setCurrentMonthStatus(targetStatus);

                    if (reservationData && reservationData.estado === "aceptada") {
                        calculatePayment(reservationData, targetMonth, targetYear);
                    }
                }
            } catch {
                console.log("Error al cargar datos");
            }
        };

        fetchData();
    }, [navigate]);

    const calculatePayment = (res: any, targetMonth?: number, targetYear?: number) => {
        const basePrice = res.tipo === "individual" ? 2000 : 1200;
        
        const dateStr = res.fecha_ingreso ? res.fecha_ingreso.split("T")[0] : "";
        if (!dateStr) {
            setPaymentAmount(basePrice);
            setIsProrated(false);
            return;
        }

        const [year, month, day] = dateStr.split("-").map(Number);
        
        const today = new Date();
        const currentMonth = targetMonth ?? today.getMonth() + 1;
        const currentYear = targetYear ?? today.getFullYear();

        if (currentYear === year && currentMonth === month) {
            const weekIndex = Math.min(4, Math.max(1, Math.ceil(day / 7)));
            const prorated = parseFloat(((basePrice / 4) * weekIndex).toFixed(2));
            setPaymentAmount(prorated);
            setIsProrated(true);
        } else {
            setPaymentAmount(basePrice);
            setIsProrated(false);
        }
    };

    const handleRequestPayment = async () => {
        if (!reservation || !paymentMonth || !paymentYear) return;
        
        const fecha_pago = `${paymentYear}-${String(paymentMonth).padStart(2, "0")}-01`;
        const body = {
            reservacion_id: reservation.id,
            monto: paymentAmount,
            fecha_pago,
            mes: paymentMonth,
            anio: paymentYear,
        };
        
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(body)
            });
            
            if (res.ok) {
                setCurrentMonthStatus("pendiente");
                const pRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/me`, { credentials: "include" });
                if (pRes.ok) setPayments(await pRes.json());
            } else {
                const errorData = await res.json().catch(() => ({ error: "Error desconocido" }));
                console.error("Solicitud de pago fallida:", errorData);
            }
        } catch(e) {
            console.error(e);
        }
    };

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
            method: "POST",
            credentials: "include",
        });
        navigate("/login");
    };

    const isProratedPaymentRecord = (payment: any) => {
        if (!reservation?.fecha_ingreso) return false;
        const [year, month] = reservation.fecha_ingreso.split("T")[0].split("-").map(Number);
        const basePrice = reservation.tipo === "individual" ? 2000 : 1200;
        const amount = Number(payment.monto ?? payment.monto_pagado ?? 0);
        return payment.mes === month && payment.anio === year && amount < basePrice;
    };

    if (!user) return null;

    const formatter = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
    });

    const isPending = reservation?.estado === "aceptada";

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col animate-page-transition">
            <nav className="bg-green-600 text-white px-8 py-4 flex justify-between items-center shadow-md z-10">
                <Link to="/dashboard" className="flex items-center gap-3 font-bold text-lg tracking-wide">
                    <img src={icon} alt="logo" className="w-8 drop-shadow-sm" />
                    SICPES
                </Link>

                <div className="flex gap-8 items-center text-sm font-medium">
                    <Link to="/dashboard" className="hover:text-green-200 transition">Inicio</Link>
                    <Link to="/reservation" className="hover:text-green-200 transition">Peticiones</Link>
                    <Link to="/payments" className="text-green-100 border-b-2 border-white pb-1">Pagos</Link>

                    <button onClick={handleLogout} className="bg-gray-900 border border-gray-800 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition shadow-sm ml-2">
                        Cerrar sesión
                    </button>
                </div>
            </nav>

            <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Gestión de Pagos</h1>
                    <p className="text-slate-500 mt-2 text-sm max-w-xl mx-auto">
                        Consulta tus cuotas mensuales. El primer mes realiza un cálculo prorrateado dependiendo del día de tu ingreso a las residencias.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start">
                    {/* PRÓXIMO PAGO */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-bl-lg">
                            {paymentLabel}
                        </div>

                        <h3 className="font-bold text-slate-800 mb-6 text-lg">Tu Próximo Pago</h3>

                        {isPending ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Monto del corte:</span>
                                    <strong className="text-2xl text-slate-800">{formatter.format(paymentAmount)}</strong>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-slate-500 font-medium">Fecha límite:</span>
                                    <strong className="text-slate-800">1ro de c/ mes</strong>
                                </div>

                                {paymentMonth && paymentYear && (
                                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                        <span className="text-slate-500 font-medium">Periodo:</span>
                                        <strong className="text-slate-800">{paymentMonth}/{paymentYear}</strong>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500 font-medium">Estado:</span>
                                    {currentMonthStatus === "pagado" ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Pagado</span>
                                    ) : currentMonthStatus === "pendiente" ? (
                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">En revisión</span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Por realizar</span>
                                    )}
                                </div>

                                {isProrated && (
                                    <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 uppercase tracking-wide">
                                        Prorrateo aplicado
                                    </div>
                                )}

                                {!currentMonthStatus ? (
                                    <button onClick={handleRequestPayment} className="w-full mt-6 bg-green-600 text-white font-semibold py-3 rounded-xl hover:bg-green-700 hover:-translate-y-0.5 transition-all shadow-md focus:ring-4 focus:ring-green-500/30">
                                        Proceder al Pago
                                    </button>
                                ) : (
                                    <button disabled className="w-full mt-6 bg-gray-100 text-gray-400 font-semibold py-3 rounded-xl transition-all shadow-none cursor-not-allowed border border-gray-200">
                                        {currentMonthStatus === "pagado" ? "Pago Completo" : "Pago Solicitado"}
                                    </button>
                                )}
                                
                                <p className="text-xs text-slate-400 text-center mt-3 leading-relaxed">
                                    El prorrateo aplica solo tu primer mes. Luego será cuota íntegra.
                                </p>
                            </div>
                        ) : (
                            <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-500 text-sm">No tienes estancias activas asociadas a cobros pendientes.</p>
                            </div>
                        )}
                    </div>

                    {/* HISTORIAL */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 text-lg">Historial de Transacciones</h3>

                        {payments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-500 text-sm">No hay registros de pagos anteriores.</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                                {payments.map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 transition hover:border-slate-200">
                                        <div>
                                            <p className="font-bold text-slate-700">{formatter.format(p.monto)}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                                                Periodo: {p.mes}/{p.anio} {p.tipo_pago === "prorrateo" ? "· Prorrateo" : ""}
                                            </p>
                                            {isProratedPaymentRecord(p) && (
                                                <p className="text-xs text-sky-700 font-semibold mt-1 uppercase tracking-wide">Prorrateado</p>
                                            )}
                                        </div>
                                        <div>
                                            {p.estado === "pagado" ? (
                                                <span className="text-xs font-bold tracking-wide text-green-700 bg-green-100 px-3 py-1.5 rounded-full uppercase">Completado</span>
                                            ) : p.estado === "pendiente" ? (
                                                <span className="text-xs font-bold tracking-wide text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full uppercase">Revisión</span>
                                            ) : (
                                                <span className="text-xs font-bold tracking-wide text-red-700 bg-red-100 px-3 py-1.5 rounded-full uppercase">Rechazado</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Payments;