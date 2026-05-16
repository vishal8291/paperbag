"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ToastContext = createContext(null);

let toastId = 0;

const ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
  info:    "ℹ️",
};

const COLORS = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", bar: "#22c55e" },
  error:   { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", bar: "#ef4444" },
  warning: { bg: "#fffbeb", border: "#fde68a", text: "#92400e", bar: "#f59e0b" },
  info:    { bg: "var(--green-100)", border: "var(--green-200)", text: "var(--green-800)", bar: "var(--green-600)" },
};

function ToastItem({ toast, onRemove }) {
  const c = COLORS[toast.type] || COLORS.info;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      style={{
        background: c.bg,
        border: `1.5px solid ${c.border}`,
        color: c.text,
        minWidth: 280,
        maxWidth: 360,
        borderRadius: 14,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
      }}
      onClick={() => onRemove(toast.id)}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
        <span style={{ fontSize: 20, lineHeight: 1 }}>{ICONS[toast.type]}</span>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(toast.id); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.5, padding: 0, lineHeight: 1 }}
        >×</button>
      </div>
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: (toast.duration || 3500) / 1000, ease: "linear" }}
        style={{
          height: 3,
          background: c.bar,
          transformOrigin: "left",
        }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message, type = "info", duration = 3500) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    setTimeout(() => remove(id), duration + 300);
    return id;
  }, [remove]);

  const success = useCallback((msg, dur) => toast(msg, "success", dur), [toast]);
  const error   = useCallback((msg, dur) => toast(msg, "error",   dur), [toast]);
  const warning = useCallback((msg, dur) => toast(msg, "warning", dur), [toast]);
  const info    = useCallback((msg, dur) => toast(msg, "info",    dur), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast portal */}
      <div style={{
        position: "fixed",
        top: 80,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 10,
        pointerEvents: "none",
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <div key={t.id} style={{ pointerEvents: "all" }}>
              <ToastItem toast={t} onRemove={remove} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
