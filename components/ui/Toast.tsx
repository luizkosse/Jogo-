"use client";

import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastItem {
  id: number;
  message: string;
  type?: "success" | "error";
}

interface ToastContextValue {
  toast: (message: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-5 sm:left-auto sm:right-5 sm:translate-x-0 z-50 flex flex-col gap-2 pointer-events-none w-[calc(100vw-2rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "wood-frame rounded-sm px-3 py-2.5 text-sm font-medium flex items-center gap-2 pointer-events-auto",
              t.type === "error"
                ? "!bg-berry/30 text-ink-shadow"
                : "text-ink"
            )}
          >
            <CheckCircle size={14} className={t.type === "error" ? "text-berry" : "text-grass-dark"} />
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
