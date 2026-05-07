"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const icons = {
    success: <CheckCircle size={16} style={{ color: "#16a34a" }} />,
    error: <AlertCircle size={16} style={{ color: "#c83c3c" }} />,
    info: <Info size={16} style={{ color: "#2563eb" }} />,
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div 
        className="fixed bottom-8 right-8 z-[2000] flex flex-col gap-3 pointer-events-none" 
        role="region" 
        aria-live="polite" 
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-[var(--bg-card)] border border-[var(--divider)] shadow-xl rounded min-w-[300px] max-w-[420px] animate-[slideUp_0.4s_var(--ease-luxury)]" 
            role="alert"
          >
            <div className="shrink-0 mt-[1px]">{icons[toast.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text)]">{toast.title}</p>
              {toast.message && <p className="text-[0.8125rem] text-[var(--text-muted)] mt-0.5">{toast.message}</p>}
            </div>
            <button
              className="flex items-center justify-center w-6 h-6 bg-transparent border-none text-[var(--text-muted)] cursor-pointer rounded shrink-0 transition-colors hover:bg-[var(--bg-secondary)]"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
