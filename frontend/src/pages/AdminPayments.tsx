import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const AdminPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) navigate("/login");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setPayments(data);
    } catch {
      setError("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updatePaymentStatus = async (id: number, estado: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ estado }),
      });

      if (res.ok) {
        fetchPayments();
      } else {
        setError("Error al actualizar pago");
      }
    } catch {
      setError("Error al actualizar pago");
    }
  };

  const normalizedPayments = payments.map((payment) => ({
    ...payment,
    estado: String(payment.estado || "").toLowerCase(),
  }));

  const counts = {
    Total: normalizedPayments.length,
    Pendiente: normalizedPayments.filter((p) => p.estado === "pendiente").length,
    Aprobado: normalizedPayments.filter((p) => p.estado === "pagado").length,
    Rechazado: normalizedPayments.filter((p) => p.estado === "rechazado" || p.estado === "atrasado").length,
  };

  const filteredPayments = normalizedPayments.filter((payment) => {
    const statusMatch =
      filter === "Todas" ||
      (filter === "Pendiente" && payment.estado === "pendiente") ||
      (filter === "Aprobado" && payment.estado === "pagado") ||
      (filter === "Rechazado" && payment.estado === "atrasado");

    const searchValue = `${payment.nombre || ""} ${payment.email || ""} ${payment.id || ""} ${payment.estado || ""}`.toLowerCase();
    return statusMatch && searchValue.includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "pagado":
        return "bg-green-100 text-green-800";
      case "atrasado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate-page-transition">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 animate-page-transition">
      <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={icon} alt="SICPES" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">SICPES</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reservations" className="flex items-center gap-2 px-5 py-2.5 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Reservaciones
          </Link>
          <Link to="/admin/payments" className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl text-sm transition">
            Pagos
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-2 px-5 py-2.5 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Configuración
          </Link>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2 border border-pink-200 text-pink-500 font-semibold rounded-xl text-sm hover:bg-pink-50 transition"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Pagos pendientes</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">Revisa y administra las solicitudes de pago de tus estudiantes.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar pagos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition"
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {Object.entries(counts).map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-sm text-slate-500">{label}</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {["Todas", "Pendiente", "Aprobado", "Rechazado"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  filter === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">ID reserva</th>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3">Vencimiento</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Solicitado</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} className="bg-slate-50 rounded-3xl transition hover:-translate-y-0.5">
                      <td className="px-4 py-4 text-sm text-slate-700 font-semibold">#{payment.reservacion_id || payment.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div>{payment.nombre}</div>
                        <div className="text-xs text-slate-500">{payment.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{payment.mes}/{payment.anio}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">${(payment.monto ?? payment.monto_pagado ?? 0).toLocaleString('es-MX')}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(payment.estado)}`}>
                          {payment.estado.charAt(0).toUpperCase() + payment.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">{payment.creado_en ? new Date(payment.creado_en).toLocaleDateString('es-MX') : '-'}</td>
                      <td className="px-4 py-4 text-sm font-medium space-x-2">
                        {payment.estado === 'pendiente' ? (
                          <>
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'pagado')}
                              className="text-xs bg-white border border-green-200 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-full font-semibold transition"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => updatePaymentStatus(payment.id, 'rechazado')}
                              className="text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full font-semibold transition"
                            >
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500">Sin acciones</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-slate-500">
                      No hay pagos para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPayments;
