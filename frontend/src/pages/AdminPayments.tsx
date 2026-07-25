import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminNavbar from "../components/admin/AdminNavbar";
import StatCard from "../components/admin/StatCard";
import Pagination from "../components/admin/Pagination";
import StatusBadge from "../components/StatusBadge";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

const FILTERS = ["Todas", "Pendiente", "Aprobado", "Rechazado"] as const;
type FilterValue = typeof FILTERS[number];

const AdminPayments = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { message, showError, clear } = useTimedMessage();
  const [filter, setFilter] = useState<FilterValue>("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments", {
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
      showError("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updatePaymentStatus = async (id: number, estado: string) => {
    try {
      const res = await fetch(`/api/admin/payments/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ estado }),
      });

      if (res.ok) {
        fetchPayments();
      } else {
        showError("Error al actualizar pago");
      }
    } catch {
      showError("Error al actualizar pago");
    }
  };

  const normalizedPayments = payments.map((payment) => ({
    ...payment,
    estado: String(payment.estado || "").toLowerCase(),
  }));

  const counts: Record<FilterValue, number> = {
    Todas: normalizedPayments.length,
    Pendiente: normalizedPayments.filter((p) => p.estado === "pendiente").length,
    Aprobado: normalizedPayments.filter((p) => p.estado === "pagado").length,
    Rechazado: normalizedPayments.filter((p) => p.estado === "rechazado" || p.estado === "atrasado").length,
  };

  const filteredPayments = normalizedPayments.filter((payment) => {
    const statusMatch =
      filter === "Todas" ||
      (filter === "Pendiente" && payment.estado === "pendiente") ||
      (filter === "Aprobado" && payment.estado === "pagado") ||
      (filter === "Rechazado" && (payment.estado === "rechazado" || payment.estado === "atrasado"));

    const searchValue = `${payment.nombre || ""} ${payment.email || ""} ${payment.id || ""} ${payment.estado || ""}`.toLowerCase();
    return statusMatch && searchValue.includes(searchTerm.toLowerCase());
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

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
      <AdminNavbar active="payments" />

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        {message && (
          <div className="mb-4">
            <Alert type={message.type} onClose={clear}>{message.text}</Alert>
          </div>
        )}

        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Pagos pendientes</h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">Revisa y administra las solicitudes de pago de tus estudiantes.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
              <label htmlFor="search-payments" className="sr-only">Buscar pagos</label>
              <input
                id="search-payments"
                type="text"
                placeholder="Buscar pagos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {FILTERS.map((f) => (
              <StatCard
                key={f}
                label={f}
                value={counts[f]}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
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
                {currentItems.length > 0 ? (
                  currentItems.map((payment) => (
                    <tr key={payment.id} className="bg-slate-50 rounded-3xl transition hover:-translate-y-0.5">
                      <td className="px-4 py-4 text-sm text-slate-700 font-semibold">#{payment.reservacion_id || payment.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div>{payment.nombre}</div>
                        <div className="text-xs text-slate-500">{payment.email}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{payment.mes}/{payment.anio}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">${(payment.monto ?? payment.monto_pagado ?? 0).toLocaleString('es-MX')}</td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={payment.estado} />
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
};

export default AdminPayments;
