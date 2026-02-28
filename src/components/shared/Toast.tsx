"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Toast {
    id: string;
    type: "success" | "error";
    message: string;
}

// Simple global toast state
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

function notifyListeners() {
    toastListeners.forEach((listener) => listener([...toasts]));
}

export function showToast(type: "success" | "error", message: string) {
    const id = Math.random().toString(36).slice(2);
    toasts.push({ id, type, message });
    notifyListeners();

    setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id);
        notifyListeners();
    }, 5000);
}

export function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

    useEffect(() => {
        toastListeners.push(setCurrentToasts);
        return () => {
            toastListeners = toastListeners.filter((l) => l !== setCurrentToasts);
        };
    }, []);

    const dismiss = (id: string) => {
        toasts = toasts.filter((t) => t.id !== id);
        notifyListeners();
    };

    return (
        <div
            className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm"
            aria-live="polite"
            aria-label="Notifications"
        >
            <AnimatePresence mode="popLayout">
                {currentToasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg",
                            toast.type === "success"
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                                : "bg-red-500/10 border-red-500/30 text-red-400"
                        )}
                    >
                        {toast.type === "success" ? (
                            <CheckCircle size={18} className="mt-0.5 shrink-0" />
                        ) : (
                            <XCircle size={18} className="mt-0.5 shrink-0" />
                        )}
                        <p className="text-sm text-foreground flex-1">{toast.message}</p>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="text-foreground-muted hover:text-foreground transition-colors shrink-0"
                            aria-label="Dismiss notification"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
