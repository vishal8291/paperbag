"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { contactApi } from "../lib/api";

const LABELS = ["Terrible", "Bad", "Okay", "Good", "Excellent"];
const COLORS  = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#2d6a4f"];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;

  return (
    <div>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transform: active >= n ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.15s",
            }}
          >
            <svg viewBox="0 0 24 24" width={32} height={32}>
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={active >= n ? (COLORS[active - 1] || "#2d6a4f") : "#e5e7eb"}
                stroke={active >= n ? (COLORS[active - 1] || "#2d6a4f") : "#d1d5db"}
                strokeWidth={1}
              />
            </svg>
          </button>
        ))}

        <AnimatePresence mode="wait">
          {active > 0 && (
            <motion.span
              key={active}
              initial={{ opacity: 0, x: -8, scale: 0.85 }}
              animate={{ opacity: 1, x: 0,  scale: 1 }}
              exit={{ opacity: 0, x: 8,   scale: 0.85 }}
              transition={{ duration: 0.2 }}
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: COLORS[active - 1],
                minWidth: "62px",
              }}
            >
              {LABELS[active - 1]}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SubmitTestimonial({ onSuccess }) {
  const [form, setForm]       = useState({ name: "", role: "", review: "", rating: 0 });
  const [status, setStatus]   = useState(""); // "success" | "error" | ""
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) { setStatus("error"); setMessage("Please select a star rating."); return; }
    if (form.review.trim().length < 10) { setStatus("error"); setMessage("Review must be at least 10 characters."); return; }

    setLoading(true); setStatus(""); setMessage("");
    try {
      await contactApi.submitTestimonial(form);
      setStatus("success");
      setMessage("Thank you! Your review has been submitted.");
      setForm({ name: "", role: "", review: "", rating: 0 });
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    color: "#1a3a2a",
    background: "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background 0.2s",
    fontFamily: "inherit",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
    >
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "36px 32px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        border: "1.5px solid #f0f0f0",
        maxWidth: "520px",
        margin: "0 auto",
      }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--green-100,#d1fae5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
              ✍️
            </div>
            <h4 style={{ fontSize: "20px", fontWeight: 800, color: "var(--green-900,#1a3a2a)", margin: 0 }}>
              Share Your Experience
            </h4>
          </div>
          <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
            Your feedback helps us improve and inspires other eco-conscious shoppers.
          </p>
        </div>

        <AnimatePresence>
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "32px 16px" }}
            >
              <div style={{ fontSize: "52px", marginBottom: "12px" }}>🌿</div>
              <h5 style={{ fontSize: "18px", fontWeight: 700, color: "#1a3a2a", margin: "0 0 8px" }}>
                Thank you!
              </h5>
              <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 20px" }}>
                Your review has been submitted and will appear shortly.
              </p>
              <button
                onClick={() => setStatus("")}
                style={{ background: "var(--green-800,#1a3a2a)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px 24px", fontWeight: 600, cursor: "pointer", fontSize: "14px" }}
              >
                Write Another Review
              </button>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit}>
              {/* Star rating first */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#1a3a2a", marginBottom: "10px" }}>
                  How would you rate us? *
                </label>
                <StarRating value={form.rating} onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
              </div>

              {/* Name + Role row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
                    Your Name *
                  </label>
                  <input type="text" required value={form.name} onChange={set("name")}
                    placeholder="e.g. Priya Sharma"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2d6a4f"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
                    Your Role
                  </label>
                  <input type="text" value={form.role} onChange={set("role")}
                    placeholder="e.g. Boutique Owner"
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "#2d6a4f"; e.target.style.background = "#fff"; }}
                    onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
                  />
                </div>
              </div>

              {/* Review */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
                  Your Review * <span style={{ color: "#9ca3af", fontWeight: 400 }}>(min. 10 chars)</span>
                </label>
                <textarea required value={form.review} onChange={set("review")}
                  placeholder="What did you love about Paperbag? Quality, delivery, eco-friendliness..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  onFocus={(e) => { e.target.style.borderColor = "#2d6a4f"; e.target.style.background = "#fff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.background = "#fafafa"; }}
                />
                <div style={{ textAlign: "right", fontSize: "11px", color: "#9ca3af", marginTop: "3px" }}>
                  {form.review.length} characters
                </div>
              </div>

              {/* Error */}
              {status === "error" && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 12px", color: "#b91c1c", fontSize: "13px", marginBottom: "14px" }}>
                  ⚠️ {message}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                  background: "linear-gradient(135deg,#2d6a4f,#1a3a2a)",
                  color: "#fff", fontSize: "15px", fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                }}>
                {loading ? (
                  <>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                      style={{ animation: "spin 1s linear infinite" }}>
                      <circle cx={12} cy={12} r={10} strokeOpacity={0.3}/>
                      <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>Submit Review <span>🌿</span></>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
      <style jsx global>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
