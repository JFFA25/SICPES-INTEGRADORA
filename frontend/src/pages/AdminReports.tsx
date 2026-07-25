import { useEffect } from "react";
import { FileText, ListChecks, CreditCard } from "lucide-react";
import AdminNavbar from "../components/admin/AdminNavbar";
import ReportGenerator from "../components/admin/ReportGenerator";
import LiveDashboard from "../components/admin/LiveDashboard";

// Estructura pensada para escalar: cada entrada es un reporte disponible.
// Hoy solo existe "general" (una sola plantilla en PDFMonkey); cuando se agreguen
// plantillas separadas para reservaciones/pagos, basta con sumar un objeto aquí
// y su propio generador, sin tocar el resto de la página.
const AVAILABLE_REPORTS = [
  {
    key: "general",
    title: "Reporte general",
    description: "Incluye reservaciones y pagos en un solo PDF. Puedes acotarlo a un rango de fechas específico.",
    icon: FileText,
  },
];

const UPCOMING_REPORTS = [
  { key: "reservations", title: "Reporte de reservaciones", icon: ListChecks },
  { key: "payments", title: "Reporte de pagos", icon: CreditCard },
];

const AdminReports = () => {
  useEffect(() => {
    document.title = "Reportes | Panel administrativo";
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 animate-page-transition transition-colors">
      <AdminNavbar active="reports" />

      <main className="px-8 py-10 max-w-[1400px] mx-auto w-full">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Panel administrativo</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Reportes</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl">
            Genera y descarga reportes en PDF con la información de tu sistema.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.key}
                className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-50">
                    <Icon className="w-5 h-5 text-blue-600" strokeWidth={2.25} />
                  </span>
                  <h2 className="text-base font-bold text-slate-900">{report.title}</h2>
                </div>
                <p className="text-sm text-slate-500 mb-5">{report.description}</p>
                <ReportGenerator />
              </div>
            );
          })}

          {UPCOMING_REPORTS.map((report) => {
            const Icon = report.icon;
            return (
              <div
                key={report.key}
                className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-6 flex flex-col items-start"
              >
                <span className="flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-100 mb-3">
                  <Icon className="w-5 h-5 text-slate-400" strokeWidth={2.25} />
                </span>
                <h2 className="text-base font-bold text-slate-500 mb-1">{report.title}</h2>
                <p className="text-sm text-slate-400">Próximamente</p>
              </div>
            );
          })}
        </div>

        <LiveDashboard />
      </main>
    </div>
  );
};

export default AdminReports;
