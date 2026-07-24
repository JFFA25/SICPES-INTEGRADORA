import { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useToast } from "../../context/ToastContext";

interface ReportSummary {
  totalReservations: number;
  acceptedReservations: number;
  pendingReservations: number;
  totalPayments: number;
  totalAmount: string;
}

const toApiDate = (d: Date) => d.toISOString().split("T")[0];

// Generador de reporte con selector de rango de fechas y feedback visual (toast + resumen).
// Antes era un solo botón que descargaba "todo el historial" sin ningún filtro ni confirmación.
const ReportGenerator = () => {
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [useRange, setUseRange] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSummary, setLastSummary] = useState<ReportSummary | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const generateReport = async () => {
    if (isGenerating) return;

    if (useRange && (!startDate || !endDate)) {
      showToast("Selecciona ambas fechas del rango antes de generar el reporte.", "error");
      return;
    }

    setIsGenerating(true);

    try {
      const params = new URLSearchParams();
      if (useRange && startDate && endDate) {
        params.set("desde", toApiDate(startDate));
        params.set("hasta", toApiDate(endDate));
      }
      const qs = params.toString() ? `?${params.toString()}` : "";

      const res = await fetch(`/api/admin/reportes/general${qs}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Error interno del servidor.");
      }

      const data = await res.json();

      if (!data || !data.url) {
        throw new Error("La respuesta del servidor no contiene una URL válida.");
      }

      const response = await fetch(data.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const fecha = new Date().toISOString().split("T")[0];
      link.download = `reporte_SICPES_${fecha}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setLastSummary(data.summary || null);
      showToast("Reporte generado y descargado correctamente.", "success");
      setOpen(false);
    } catch (err: any) {
      showToast(err.message || "Ocurrió un error inesperado al generar el PDF.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isGenerating}
        className={`flex items-center justify-center gap-2 px-5 py-3 text-white rounded-full text-sm font-semibold transition shadow-sm w-full sm:w-auto ${
          isGenerating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generando PDF...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
            </svg>
            Generar reporte PDF
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 sm:right-auto z-30 mt-2 w-80 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl">
          <p className="text-sm font-semibold text-slate-700 mb-3">Periodo del reporte</p>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setUseRange(false)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold transition ${
                !useRange ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              Todo el historial
            </button>
            <button
              onClick={() => setUseRange(true)}
              className={`flex-1 px-3 py-2 rounded-full text-xs font-semibold transition ${
                useRange ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              Rango de fechas
            </button>
          </div>

          {useRange && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Desde</label>
                <DatePicker
                  selected={startDate}
                  onChange={(d) => setStartDate(d)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={endDate || new Date()}
                  placeholderText="Selecciona una fecha"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Hasta</label>
                <DatePicker
                  selected={endDate}
                  onChange={(d) => setEndDate(d)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || undefined}
                  maxDate={new Date()}
                  placeholderText="Selecciona una fecha"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold py-2.5 rounded-full transition"
          >
            {isGenerating ? "Generando..." : "Descargar PDF"}
          </button>
        </div>
      )}

      {lastSummary && !open && (
        <div className="absolute right-0 sm:right-auto z-20 mt-2 w-72 rounded-xl border border-green-100 bg-green-50 p-4 text-xs text-green-800 shadow-sm">
          <p className="font-semibold mb-1">Último reporte generado</p>
          <p>{lastSummary.totalReservations} reservaciones · {lastSummary.acceptedReservations} aceptadas · ${lastSummary.totalAmount} recaudado</p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
