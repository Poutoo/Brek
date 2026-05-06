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
      <div className="toast-container" role="region" aria-live="polite" aria-label="Notifications">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast" role="alert">
            <div className="toast-icon">{icons[toast.type]}</div>
            <div className="toast-content">
              <p className="toast-title">{toast.title}</p>
              {toast.message && <p className="toast-message">{toast.message}</p>}
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Fermer la notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <style jsx>{`
        .toast {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
        }
        .toast-icon { flex-shrink: 0; margin-top: 1px; }
        .toast-content { flex: 1; min-width: 0; }
        .toast-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text);
        }
        .toast-message {
          font-size: 0.8125rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .toast-close {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          border-radius: 2px;
          flex-shrink: 0;
          transition: background 0.15s;
        }
        .toast-close:hover { background: var(--bg-secondary); }
      `}</style>
    </ToastContext.Provider>
  );
}
