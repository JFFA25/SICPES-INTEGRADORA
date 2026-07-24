import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/admin/AdminNavbar";
import StatCard from "../components/admin/StatCard";
import Alert from "../components/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { useTimedMessage } from "../hooks/useTimedMessage";

const AdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    precioIndividual: 2500,
    precioCompartida: 1800,
    emailAdmin: "admin@sicpes.com"
  });
  const [loading, setLoading] = useState(false);
  const { message: settingsMessage, showError: showSettingsError, showSuccess: showSettingsSuccess, clear: clearSettingsMessage } = useTimedMessage();

  const [rooms, setRooms] = useState<any[]>([]);
  const [newFloor, setNewFloor] = useState("");
  const [newRooms, setNewRooms] = useState("");
  const [roomsLoading, setRoomsLoading] = useState(false);
  const { message: roomsMessage, showError: showRoomsError, showSuccess: showRoomsSuccess, clear: clearRoomsMessage } = useTimedMessage();

  // Modal de confirmación para eliminar un piso (reemplaza window.confirm)
  const [deletingFloor, setDeletingFloor] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/admin/settings`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) navigate("/login");
        return;
      }

      const data = await res.json();
      setSettings(data);
    } catch {
      showSettingsError("No se pudieron cargar las configuraciones");
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch(`/api/rooms`, {
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) navigate("/login");
        return;
      }

      const data = await res.json();
      setRooms(data.lista || []);
    } catch {
      showRoomsError("No se pudieron cargar los pisos y habitaciones");
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddRooms = async () => {
    if (!newFloor || !newRooms.trim()) {
      showRoomsError("Debes indicar piso y habitaciones");
      return;
    }

    setRoomsLoading(true);

    try {
      const res = await fetch(`/api/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ piso: newFloor, habitaciones: newRooms }),
      });

      const data = await res.json();
      if (!res.ok) {
        showRoomsError(data.error || "Error al agregar habitaciones");
        setRoomsLoading(false);
        return;
      }

      showRoomsSuccess(data.message || "Piso y habitaciones agregados");
      setNewFloor("");
      setNewRooms("");
      fetchRooms();
    } catch {
      showRoomsError("Error al agregar habitaciones");
    }

    setRoomsLoading(false);
  };

  const handleDeleteFloor = async (piso: string) => {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(piso)}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        showRoomsError(data.error || "Error al eliminar piso");
        return;
      }

      showRoomsSuccess(data.message || "Piso eliminado");
      fetchRooms();
    } catch {
      showRoomsError("Error al eliminar piso");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        showSettingsError("No se pudieron guardar las configuraciones");
        setLoading(false);
        return;
      }

      showSettingsSuccess("Configuraciones guardadas exitosamente");
    } catch {
      showSettingsError("Error al guardar configuraciones");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-page-transition">
      <AdminNavbar active="settings" />

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Configuración global</h1>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">Ajusta precios, correo de administración y parámetros generales del sistema.</p>
          </div>
        </div>

        {settingsMessage && (
          <div className="mb-6">
            <Alert type={settingsMessage.type} onClose={clearSettingsMessage}>{settingsMessage.text}</Alert>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <StatCard label="Precio individual" value={`$${settings.precioIndividual.toLocaleString("es-MX")}`} />
          <StatCard label="Precio compartida" value={`$${settings.precioCompartida.toLocaleString("es-MX")}`} />
          <StatCard label="Email de contacto" value={settings.emailAdmin} />
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
              <p className="mt-2 text-sm text-slate-600 max-w-2xl">Los datos se guardan en la tabla <span className="font-semibold">tbi_habitaciones</span>.</p>
            </div>
          </div>

          {roomsMessage && (
            <div className="mb-6">
              <Alert type={roomsMessage.type} onClose={clearRoomsMessage}>{roomsMessage.text}</Alert>
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
                            onClick={() => setDeletingFloor(row.piso)}
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

      <ConfirmModal
        open={deletingFloor !== null}
        title="Eliminar piso"
        description={deletingFloor ? `¿Eliminar el piso ${deletingFloor} y todas sus habitaciones? Esta acción no se puede deshacer.` : undefined}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        tone="danger"
        onConfirm={() => {
          if (deletingFloor) handleDeleteFloor(deletingFloor);
          setDeletingFloor(null);
        }}
        onCancel={() => setDeletingFloor(null)}
      />
    </div>
  );
};

export default AdminSettings;
