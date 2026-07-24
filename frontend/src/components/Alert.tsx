import type { MessageType } from "../hooks/useTimedMessage";
import { CircleCheck, TriangleAlert, Info, X } from "lucide-react";

interface AlertProps {
  type: MessageType;
  children: React.ReactNode;
  /** Duración en ms usada para sincronizar la barra de progreso visual */
  duration?: number;
  /** Si se pasa, muestra un botón para cerrar manualmente antes de tiempo */
  onClose?: () => void;
}

const VARIANTS: Record<
  MessageType,
  { box: string; bar: string; icon: React.ElementType }
> = {
  error: {
    box: "bg-red-50 text-red-700 border-red-200",
    bar: "bg-red-400",
    icon: TriangleAlert,
  },
  success: {
    box: "bg-green-50 text-green-700 border-green-200",
    bar: "bg-green-400",
    icon: CircleCheck,
  },
  info: {
    box: "bg-blue-50 text-blue-700 border-blue-200",
    bar: "bg-blue-400",
    icon: Info,
  },
};

const Alert = ({ type, children, duration = 5000, onClose }: AlertProps) => {
  const variant = VARIANTS[type];
  const Icon = variant.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`relative overflow-hidden flex items-start gap-2 pl-3 py-3 border rounded-lg text-sm font-medium text-left animate-alert-in ${
        onClose ? "pr-8" : "pr-3"
      } ${variant.box}`}
    >
      <Icon className="w-5 h-5 shrink-0 mt-0.5" strokeWidth={2.25} />
      <span className="leading-snug flex-1">{children}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar mensaje"
          className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" strokeWidth={2.5} />
        </button>
      )}
      {duration > 0 && (
        <span
          key={duration}
          className={`absolute bottom-0 left-0 h-0.5 ${variant.bar} animate-alert-timer`}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

export default Alert;
