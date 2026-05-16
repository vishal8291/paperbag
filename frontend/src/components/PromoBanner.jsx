"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function getTimeLeft(target) {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

export default function PromoBanner() {
  const [visible, setVisible] = useState(true);
  // null on server — set only after mount to avoid hydration mismatch
  const [target,   setTarget]   = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const t = Date.now() + 24 * 3600 * 1000;
    setTarget(t);
    setTimeLeft(getTimeLeft(t));

    const iv = setInterval(() => {
      const tl = getTimeLeft(t);
      if (!tl) { clearInterval(iv); setTimeLeft(null); } else setTimeLeft(tl);
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{ background: "var(--green-900)", overflow: "hidden" }}
      >
        <div className="flex items-center justify-center gap-4 px-4 py-2.5 text-white text-sm font-semibold flex-wrap">
          <span className="text-yellow-300 text-base">🎉</span>
          <span>FREE SHIPPING on orders above ₹999 — Use code&nbsp;
            <span className="bg-yellow-300 text-green-900 px-2 py-0.5 rounded font-black text-xs tracking-wider">ECO20</span>
            &nbsp;for 20% off!
          </span>
          {timeLeft && (
            <span className="flex items-center gap-1.5">
              <span style={{ color: "rgba(255,255,255,0.65)" }}>Ends in:</span>
              {[pad(timeLeft.h), pad(timeLeft.m), pad(timeLeft.s)].map((v, i) => (
                <React.Fragment key={i}>
                  <span className="inline-flex items-center justify-center w-8 h-7 rounded font-black text-sm"
                    style={{ background: "rgba(255,255,255,0.15)" }}>
                    {v}
                  </span>
                  {i < 2 && <span style={{ color: "rgba(255,255,255,0.5)" }}>:</span>}
                </React.Fragment>
              ))}
            </span>
          )}
          <button
            onClick={() => setVisible(false)}
            aria-label="Close banner"
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px",
              position: "absolute", right: 16,
            }}
          >×</button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
