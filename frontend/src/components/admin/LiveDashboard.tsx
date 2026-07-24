import { useCallback, useEffect, useRef, useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { RefreshCw, TriangleAlert } from "lucide-react";

interface DashboardStats {
  summary: {
    totalReservations: number;
    acceptedReservations: number;
    pendingReservations: number;
    totalPayments: number;
    paidPayments: number;
    totalAmount: string;
  };
  reservationsByStatus: { name: string; value: number }[];
  monthlyRevenue: { month: string; total: number }[];
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  Aceptadas: "#16a34a",
  Pendientes: "#eab308",
  Rechazadas: "#ef4444",
  Finalizadas: "#3b82f6",
  Canceladas: "#94a3b8",
};

const REFRESH_INTERVAL_MS = 10000;

const LiveDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/reportes/dashboard-stats", {
        credentials: "include",
      });

      if (!res.ok) {
        setError("No se pudieron cargar las estadísticas del dashboard.");
        return;
      }

      const data = await res.json();
      setStats(data);
      setError(null);
      setSecondsAgo(0);
    } catch {
      setError("No se pudo conectar con el servidor para actualizar el dashboard.");
    }
  }, []);

  useEffect(() => {
    fetchStats();
    intervalRef.current = setInterval(fetchStats, REFRESH_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchStats]);

  // Contador visual de "hace X segundos" independiente del polling real
  useEffect(() => {
    const tick = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, []);

  const hasReservations = stats && stats.reservationsByStatus.some((r) => r.value > 0);

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panorama en vivo</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">Dashboard</h2>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Actualizado hace {secondsAgo}s
          </span>
          <button
            onClick={fetchStats}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.25} />
            Actualizar ahora
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <TriangleAlert className="w-4 h-4 shrink-0" strokeWidth={2.25} />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* PASTEL: reservaciones por estado */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Reservaciones por estado</h3>

          {!stats ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">Cargando...</div>
          ) : hasReservations ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={stats.reservationsByStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {stats.reservationsByStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#cbd5e1"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              Aún no hay reservaciones registradas.
            </div>
          )}
        </div>

        {/* BARRAS: recaudación mensual */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Recaudación por mes (últimos 6 meses)</h3>

          {!stats ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">Cargando...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.monthlyRevenue}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString("es-MX")}`, "Recaudado"]} />
                <Bar dataKey="total" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDashboard;
