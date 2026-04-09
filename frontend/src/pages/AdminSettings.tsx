import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import icon from "../assets/images/icon.ico";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    precioIndividual: 2500,
    precioCompartida: 1800,
    emailAdmin: "admin@sicpes.com"
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [rooms, setRooms] = useState<any[]>([]);
  const [newFloor, setNewFloor] = useState("");
  const [newRooms, setNewRooms] = useState("");
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsMessage, setRoomsMessage] = useState("");

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) navigate("/login");
        return;
      }

      const data = await res.json();
      setSettings(data);
    } catch {
      setMessage("No se pudieron cargar las configuraciones");
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) navigate("/login");
        return;
      }

      const data = await res.json();
      setRooms(data.lista || []);
    } catch {
      setRoomsMessage("No se pudieron cargar los pisos y habitaciones");
    }
  };

  const handleAddRooms = async () => {
    if (!newFloor || !newRooms.trim()) {
      setRoomsMessage("Debes indicar piso y habitaciones");
      return;
    }

    setRoomsLoading(true);
    setRoomsMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ piso: newFloor, habitaciones: newRooms }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRoomsMessage(data.error || "Error al agregar habitaciones");
        setRoomsLoading(false);
        return;
      }

      setRoomsMessage(data.message || "Piso y habitaciones agregados");
      setNewFloor("");
      setNewRooms("");
      fetchRooms();
    } catch {
      setRoomsMessage("Error al agregar habitaciones");
    }

    setRoomsLoading(false);
  };

  const handleDeleteFloor = async (piso: string) => {
    const confirmed = window.confirm(`¿Eliminar el piso ${piso} y todas sus habitaciones?`);
    if (!confirmed) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms/${encodeURIComponent(piso)}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setRoomsMessage(data.error || "Error al eliminar piso");
        return;
      }

      setRoomsMessage(data.message || "Piso eliminado");
      fetchRooms();
    } catch {
      setRoomsMessage("Error al eliminar piso");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        setMessage("No se pudieron guardar las configuraciones");
        setLoading(false);
        return;
      }

      setMessage("Configuraciones guardadas exitosamente");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Error al guardar configuraciones");
    }

    setLoading(false);
  };

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
          <Link to="/admin/payments" className="flex items-center gap-2 px-5 py-2.5 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition">
            Pagos
          </Link>
          <Link to="/admin/settings" className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 font-semibold rounded-xl text-sm transition">
            Configuración
          </Link>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2 border border-pink-200 text-pink-500 font-semibold rounded-xl text-sm hover:bg-pink-50 transition"
          onClick={async () => {
            await fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
              method: "POST",
              credentials: "include",
            });
            navigate("/login");
          }}
        >
          Cerrar sesión
        </button>
      </nav>

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Configuración global</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">Ajusta precios, correo de administración y parámetros generales del sistema.</p>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-2xl ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
            {message}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
            <p className="text-sm text-slate-500">Precio individual</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">${settings.precioIndividual.toLocaleString("es-MX")}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
            <p className="text-sm text-slate-500">Precio compartida</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900">${settings.precioCompartida.toLocaleString("es-MX")}</p>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1">
            <p className="text-sm text-slate-500">Email de contacto</p>
            <p className="mt-3 text-xl font-semibold text-slate-900">{settings.emailAdmin}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Precio de habitación individual</p>
              <input
                type="number"
                value={settings.precioIndividual}
                onChange={(e) => setSettings({ ...settings, precioIndividual: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-slate-700">Precio de habitación compartida</p>
              <input
                type="number"
                value={settings.precioCompartida}
                onChange={(e) => setSettings({ ...settings, precioCompartida: Number(e.target.value) })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <p className="text-sm font-medium text-slate-700">Correo electrónico del administrador</p>
            <input
              type="email"
              value={settings.emailAdmin}
              onChange={(e) => setSettings({ ...settings, emailAdmin: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <section className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Pisos y habitaciones</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Agregar nuevos pisos y habitaciones</h2>
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">Los datos se guardan en la tabla <span className="font-semibold">tbd_habitaciones</span>.</p>
            </div>
          </div>

          {roomsMessage && (
            <div className={`mb-6 p-4 rounded-2xl ${roomsMessage.toLowerCase().includes("error") ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
              {roomsMessage}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700">Piso</label>
              <input
                type="text"
                value={newFloor}
                onChange={(e) => setNewFloor(e.target.value)}
                placeholder="Ej. 1"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div className="md:col-span-2 space-y-3">
              <label className="text-sm font-medium text-slate-700">Habitaciones</label>
              <input
                type="text"
                value={newRooms}
                onChange={(e) => setNewRooms(e.target.value)}
                placeholder="Ej. 101, 102, 103"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition"
              />
              <p className="text-sm text-slate-500">Separar con coma para agregar varias habitaciones en el mismo piso.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAddRooms}
              disabled={roomsLoading}
              className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {roomsLoading ? "Guardando..." : "Agregar habitaciones"}
            </button>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Pisos existentes</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-4 py-3">Piso</th>
                    <th className="px-4 py-3">Habitaciones</th>
                    <th className="px-4 py-3">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.length > 0 ? (
                    rooms.map((row: any) => (
                      <tr key={row.piso} className="bg-slate-50 rounded-3xl transition hover:-translate-y-0.5">
                        <td className="px-4 py-4 text-sm text-slate-700 font-semibold">{row.piso}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">{row.habitaciones}</td>
                        <td className="px-4 py-4 text-sm text-slate-700">
                          <button
                            onClick={() => handleDeleteFloor(row.piso)}
                            className="text-xs bg-white border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full font-semibold transition"
                          >
                            Eliminar piso
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-16 text-center text-slate-500">
                        No hay pisos registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminSettings;
