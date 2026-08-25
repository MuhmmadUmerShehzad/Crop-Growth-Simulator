import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Check, Info, Loader2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'loading';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, description, type = 'success', duration = 3500 }: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, description, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Top Right Fixed Toast Container */}
      <div
        className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-3 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-[#4A6741] border border-[#3A3830] text-white rounded-[2px] p-3.5 flex items-start justify-between gap-3 transition-all transform duration-200 ease-out translate-y-0 opacity-100"
            style={{
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}
            role="status"
          >
            <div className="flex items-start gap-2.5">
              {toast.type === 'loading' ? (
                <Loader2 className="w-4 h-4 text-white animate-spin mt-0.5 shrink-0" />
              ) : toast.type === 'info' ? (
                <Info className="w-4 h-4 text-white mt-0.5 shrink-0" />
              ) : (
                <Check className="w-4 h-4 text-white mt-0.5 shrink-0 stroke-[2.5]" />
              )}
              <div className="space-y-0.5">
                <p className="text-xs sm:text-sm font-mono font-semibold text-white tracking-wide">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-xs font-mono text-[#EDE8DD]/90 leading-tight">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[#EDE8DD]/80 hover:text-white transition-colors cursor-pointer p-0.5 -mr-1 -mt-0.5"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
