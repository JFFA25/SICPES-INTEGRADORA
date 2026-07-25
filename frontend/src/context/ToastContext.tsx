import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { CircleCheck, TriangleAlert, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let idCounter = 0;

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const styles: Record<ToastType, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-800",
  };

  const icons: Record<ToastType, React.ElementType> = {
    success: CircleCheck,
    error: TriangleAlert,
    info: Info,
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              role="status"
              className={`pointer-events-auto flex items-center gap-3 min-w-[280px] max-w-sm px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-in-toast ${styles[toast.type]}`}
            >
              <Icon className="w-5 h-5 shrink-0" strokeWidth={2.25} />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-white/70 hover:text-white transition"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

