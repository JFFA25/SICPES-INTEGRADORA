import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const AdminReservations = () => {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ piso: "", habitacion: "", monto: "" });

  const fetchReservations = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservations`, {
        credentials: "include",
      });

      if (!res.ok) {
        navigate("/login");
        return;
      }

      const data = await res.json();
      setReservations(data);
    } catch {
      setError("Error al cargar reservaciones");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateStatus = async (id: number, estado: string) => {
    try {
      let payload: any = { estado };

      if (estado === "rechazada") {
        const motivo = window.prompt("Especifique el motivo del rechazo (opcional):");
        if (motivo === null) return;
        if (motivo.trim() !== "") {
          payload.motivo_rechazo = motivo;
        }
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setError("Error al actualizar");
        return;
      }
      fetchReservations();
    } catch {
      setError("Error del servidor");
    }
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        setError("Error al actualizar");
        return;
      }
      setEditingId(null);
      fetchReservations();
    } catch {
      setError("Error del servidor");
    }
  };

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/login");
  };

  const counts = {
    Total: reservations.length,
    Pendientes: reservations.filter((r) => r.estado === "pendiente").length,
    Aceptadas: reservations.filter((r) => r.estado === "aceptada").length,
    Rechazadas: reservations.filter((r) => r.estado === "rechazada").length,
    Finalizadas: reservations.filter((r) => r.estado === "finalizada").length,
  };

  const filteredReservations = reservations.filter((r) => {
    let targetState = "";
    if (filter === "Pendientes") targetState = "pendiente";
    else if (filter === "Aceptadas") targetState = "aceptada";
    else if (filter === "Rechazadas") targetState = "rechazada";
    else if (filter === "Finalizadas") targetState = "finalizada";

    const matchesFilter = filter === "Todas" || r.estado === targetState;
    const searchString = `${r.nombre} ${r.id} ${r.tipo} ${r.estado}`.toLowerCase();
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 animate-page-transition">
      <nav className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <img src={icon} alt="SICPES" className="w-10 h-10 object-contain" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">SICPES</span>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/reservations" className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl text-sm transition">
            Reservaciones
          </Link>
          <Link to="/admin/payments" className="flex items-center gap-2 px-5 py-2.5 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Pagos
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-2 px-5 py-2.5 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Configuración
          </Link>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2 border border-pink-200 text-pink-500 font-semibold rounded-xl text-sm hover:bg-pink-50 transition"
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
              <h1 className="mt-3 text-3xl font-bold text-slate-900">Reservaciones</h1>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">Revisa y administra las solicitudes de reserva de los estudiantes.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <svg
                className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar reservaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white pl-11 pr-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {Object.entries(counts).map(([label, value]) => (
              <div key={label} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {['Todas', 'Pendientes', 'Aceptadas', 'Rechazadas', 'Finalizadas'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {f}
              </button>
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
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((r, index) => (
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
                            {[1, 2].map((num) => (
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
                            className="w-24 rounded-xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          `$${r.monto || "0.00"}`
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${r.estado === "pendiente"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.estado === "aceptada"
                                ? "bg-green-100 text-green-800"
                                : r.estado === "rechazada" || r.estado === "cancelada"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {String(r.estado).toUpperCase()}
                        </span>
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
                                    setEditData({ piso: r.piso, habitacion: r.habitacion, monto: r.monto });
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
                                  onClick={() => updateStatus(r.id, "rechazada")}
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
        </div>
      </main>
    </div>
  );
};

export default AdminReservations;
