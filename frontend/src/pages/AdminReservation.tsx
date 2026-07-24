import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search } from "lucide-react";
import AdminNavbar from "../components/admin/AdminNavbar";
import StatCard from "../components/admin/StatCard";
import Pagination from "../components/admin/Pagination";
import StatusBadge from "../components/StatusBadge";
import ConfirmModal from "../components/ConfirmModal";
import Alert from "../components/Alert";
import { useTimedMessage } from "../hooks/useTimedMessage";

interface Reservation {
  id: number;
  nombre: string;
  fecha_ingreso: string | null;
  tipo: string;
  piso: string;
  habitacion: string;
  monto: string | number;
  estado: string;
}

interface EditData {
  piso: string;
  habitacion: string;
  monto: string;
}

const FILTERS = ["Todas", "Pendientes", "Aceptadas", "Rechazadas", "Finalizadas"] as const;
type FilterValue = typeof FILTERS[number];

const FILTER_TO_ESTADO: Record<FilterValue, string | null> = {
  Todas: null,
  Pendientes: "pendiente",
  Aceptadas: "aceptada",
  Rechazadas: "rechazada",
  Finalizadas: "finalizada",
};

const AdminReservations = () => {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const { message, showError, clear } = useTimedMessage();
  const [filter, setFilter] = useState<FilterValue>("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<EditData>({ piso: "", habitacion: "", monto: "" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal de confirmación para el rechazo (reemplaza window.prompt)
  const [rejectingId, setRejectingId] = useState<number | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const fetchReservations = async () => {
    try {
      const res = await fetch(`/api/admin/reservations`, {
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setReservations(data);
    } catch {
      showError("Error al cargar reservaciones");
    }
  };

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (id: number, estado: string, motivoRechazo?: string) => {
    try {
      const payload: { estado: string; motivo_rechazo?: string } = { estado };

      if (estado === "rechazada" && motivoRechazo && motivoRechazo.trim() !== "") {
        payload.motivo_rechazo = motivoRechazo;
      }

      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        showError("Error al actualizar");
        return;
      }
      fetchReservations();
    } catch {
      showError("Error del servidor");
    }
  };

  const handleRejectConfirm = (motivo?: string) => {
    if (rejectingId !== null) {
      updateStatus(rejectingId, "rechazada", motivo);
    }
    setRejectingId(null);
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        showError("Error al actualizar");
        return;
      }
      setEditingId(null);
      fetchReservations();
    } catch {
      showError("Error del servidor");
    }
  };

  const counts: Record<FilterValue, number> = {
    Todas: reservations.length,
    Pendientes: reservations.filter((r) => r.estado === "pendiente").length,
    Aceptadas: reservations.filter((r) => r.estado === "aceptada").length,
    Rechazadas: reservations.filter((r) => r.estado === "rechazada").length,
    Finalizadas: reservations.filter((r) => r.estado === "finalizada").length,
  };

  const filteredReservations = reservations.filter((r) => {
    const targetState = FILTER_TO_ESTADO[filter];
    const matchesFilter = targetState === null || r.estado === targetState;
    const searchString = `${r.nombre} ${r.id} ${r.tipo} ${r.estado}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 animate-page-transition transition-colors">
      <AdminNavbar active="reservations" />

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
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Reservaciones</h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">Revisa y administra las solicitudes de reserva de los estudiantes.</p>
              <Link
                to="/admin/reports"
                className="inline-flex items-center gap-1 mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Ir a Reportes →
              </Link>
            </div>

            {/* Buscador */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={2} />
                <label htmlFor="search-reservations" className="sr-only">Buscar reservaciones</label>
                <input
                  id="search-reservations"
                  type="text"
                  placeholder="Buscar reservaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white text-gray-900 pl-11 pr-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition"
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
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
                  <th className="px-4 py-3">ID RESERVA</th>
                  <th className="px-4 py-3">USUARIO</th>
                  <th className="px-4 py-3">INGRESO</th>
                  <th className="px-4 py-3">TIPO DE CUARTO</th>
                  <th className="px-4 py-3">PISO</th>
                  <th className="px-4 py-3">HABITACIÓN</th>
                  <th className="px-4 py-3">MONTO</th>
                  <th className="px-4 py-3">ESTADO</th>
                  <th className="px-4 py-3">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((r, index) => (
                    <tr key={index} className="bg-slate-50 rounded-3xl transition hover:-translate-y-0.5">
                      <td className="px-4 py-4 text-sm text-slate-700 font-semibold">#{r.id}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        <div>{r.nombre}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">{r.fecha_ingreso || "N/A"}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">{r.tipo}</td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {editingId === r.id ? (
                          <select
                            value={editData.piso}
                            onChange={(e) => setEditData({ ...editData, piso: e.target.value })}
                            className="w-16 px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="" disabled>Piso</option>
                            {[1, 2, 3].map((num) => (
                              <option key={num} value={num.toString()}>{num}</option>
                            ))}
                          </select>
                        ) : (
                          r.piso
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700">
                        {editingId === r.id ? (
                          <select
                            value={editData.habitacion}
                            onChange={(e) => setEditData({ ...editData, habitacion: e.target.value })}
                            className="w-24 px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="" disabled>Cuarto</option>
                            {Array.from({ length: 4 }, (_, i) => {
                              const p = editData.piso || "1";
                              const roomNum = `${p}${(i + 1).toString().padStart(2, '0')}`;
                              return (
                                <option key={roomNum} value={roomNum}>{roomNum}</option>
                              );
                            })}
                          </select>
                        ) : (
                          r.habitacion
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 font-semibold">
                        {editingId === r.id ? (
                          <input
                            type="number"
                            value={editData.monto}
                            onChange={(e) => setEditData({ ...editData, monto: e.target.value })}
                            className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          />
                        ) : (
                          `$${r.monto || "0.00"}`
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={r.estado} />
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          {r.estado === "pendiente" ? (
                            editingId === r.id ? (
                              <>
                                <button
                                  onClick={() => saveEdit(r.id)}
                                  className="text-xs bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                  Guardar
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="text-xs bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                  Cancelar
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingId(r.id);
                                    setEditData({ piso: r.piso, habitacion: r.habitacion, monto: String(r.monto) });
                                  }}
                                  className="text-xs bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                  Editar
                                </button>
                                <button
                                  onClick={() => updateStatus(r.id, "aceptada")}
                                  className="text-xs bg-white border border-green-200 text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                  Aceptar
                                </button>
                                <button
                                  onClick={() => setRejectingId(r.id)}
                                  className="text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full font-semibold transition"
                                >
                                  Rechazar
                                </button>
                              </>
                            )
                          ) : r.estado === "aceptada" ? (
                            <button
                              onClick={() => updateStatus(r.id, "finalizada")}
                              className="text-xs bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full font-semibold transition"
                            >
                              Finalizar
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500">Sin acciones</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-slate-500">
                      No hay reservaciones para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredReservations.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>

      <ConfirmModal
        open={rejectingId !== null}
        title="Rechazar reservación"
        description="Puedes indicar un motivo de rechazo; el estudiante lo verá en su panel."
        confirmLabel="Rechazar"
        cancelLabel="Cancelar"
        tone="danger"
        requireInput={{
          label: "Motivo del rechazo",
          placeholder: "Ej: Documentación incompleta...",
          optional: true,
        }}
        onConfirm={handleRejectConfirm}
        onCancel={() => setRejectingId(null)}
      />
    </div>
  );
};

export default AdminReservations;
