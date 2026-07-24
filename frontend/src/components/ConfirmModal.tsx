import { useState } from "react";
import { TriangleAlert, X } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
  /** Si se define, el modal pide un texto libre (reemplazo de window.prompt) */
  requireInput?: {
    label: string;
    placeholder?: string;
    optional?: boolean;
  };
  onConfirm: (inputValue?: string) => void;
  onCancel: () => void;
}

// Modal de confirmación reutilizable - reemplaza window.confirm() y window.prompt()
// en toda la app (ej. rechazar una reservación con motivo, cancelar acciones destructivas).
const ConfirmModal = ({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "default",
  requireInput,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const [inputValue, setInputValue] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm(requireInput ? inputValue : undefined);
    setInputValue("");
  };

  const handleCancel = () => {
    setInputValue("");
    onCancel();
  };

  const confirmButtonClasses =
    tone === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-blue-600 hover:bg-blue-700 text-white";

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl animate-zoom-fade-in">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {tone === "danger" && (
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-red-100">
                <TriangleAlert className="w-5 h-5 text-red-600" strokeWidth={2.25} />
              </span>
            )}
            <h2 id="confirm-modal-title" className="text-base font-bold text-slate-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            aria-label="Cerrar"
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {description && (
          <p className="text-sm text-slate-600 mb-4">{description}</p>
        )}

        {requireInput && (
          <div className="mb-4">
            <label htmlFor="confirm-modal-input" className="block text-xs font-medium text-slate-500 mb-1">
              {requireInput.label} {requireInput.optional && "(opcional)"}
            </label>
            <textarea
              id="confirm-modal-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={requireInput.placeholder}
              rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${confirmButtonClasses}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
