type BadgeTone = "yellow" | "green" | "red" | "blue" | "gray" | "sky";

const TONE_CLASSES: Record<BadgeTone, string> = {
  yellow: "bg-yellow-100 text-yellow-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  blue: "bg-blue-100 text-blue-800",
  gray: "bg-gray-100 text-gray-800",
  sky: "bg-sky-100 text-sky-800",
};

// Mapea estados de negocio (español) a un tono visual consistente en toda la app.
const STATUS_TONE: Record<string, BadgeTone> = {
  pendiente: "yellow",
  aceptada: "green",
  aprobado: "green",
  pagado: "green",
  rechazada: "red",
  rechazado: "red",
  cancelada: "red",
  atrasado: "red",
  finalizada: "gray",
};

interface StatusBadgeProps {
  status: string;
  label?: string;
}

const StatusBadge = ({ status, label }: StatusBadgeProps) => {
  const normalized = String(status || "").toLowerCase();
  const tone = STATUS_TONE[normalized] || "gray";
  const text = label || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A");

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${TONE_CLASSES[tone]}`}>
      {text}
    </span>
  );
};

export default StatusBadge;
