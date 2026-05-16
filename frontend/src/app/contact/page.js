"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INFO_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .25h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.9v2.02z"/>
      </svg>
    ),
    label: "Phone",
    value: "+91-8291569470",
    link: "tel:+918291569470",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "vishaltiwari101999@gmail.com",
    link: "mailto:vishaltiwari101999@gmail.com",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
        <circle cx={12} cy={10} r={3}/>
      </svg>
    ),
    label: "Location",
    value: "Mumbai, Maharashtra, India",
    link: "https://maps.google.com/?q=Mumbai,India",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} width={20} height={20}>
        <circle cx={12} cy={12} r={10}/>
        <polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
    label: "Response Time",
    value: "Within 24 hours",
    link: null,
  },
];

const REASONS = [
  { icon: "📦", text: "Bulk order queries" },
  { icon: "🎨", text: "Custom print & design" },
  { icon: "🚚", text: "Shipping & delivery" },
  { icon: "♻️", text: "Eco certifications" },
];

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ContactPage() {
  const [form, setForm]       = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus]   = useState(""); // "success" | "error"
  const [resMsg, setResMsg]   = useState("");
  const [focused, setFocused] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true); setStatus(""); setResMsg("");
    try {
      const res = await fetch(`${BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message.");
      setStatus("success");
      setResMsg("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setResMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase = (name) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: `1.5px solid ${focused === name ? "#2d6a4f" : "#e5e7eb"}`,
    fontSize: "14px",
    color: "#1a3a2a",
    background: focused === name ? "#fff" : "#fafafa",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s",
    fontFamily: "inherit",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream,#faf7f2)" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg,#1a3a2a 0%,#2d6a4f 100%)",
        padding: "80px 24px 60px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative leaves */}
        <svg viewBox="0 0 200 200" style={{ position:"absolute", top:-40, left:-40, width:220, opacity:0.07 }} fill="none">
          <path d="M100 0C50 0 0 50 0 100s50 100 100 100c0-40 10-70 30-90 20-20 50-30 90-30C220 27 173 0 100 0z" fill="#fff"/>
        </svg>
        <svg viewBox="0 0 200 200" style={{ position:"absolute", bottom:-40, right:-40, width:220, opacity:0.07, transform:"rotate(180deg)" }} fill="none">
          <path d="M100 0C50 0 0 50 0 100s50 100 100 100c0-40 10-70 30-90 20-20 50-30 90-30C220 27 173 0 100 0z" fill="#fff"/>
        </svg>

        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.1)", color:"#a8d5b5", fontSize:"13px", fontWeight:600, padding:"6px 16px", borderRadius:"20px", marginBottom:"16px", border:"1px solid rgba(255,255,255,0.15)" }}>
            We're here to help
          </span>
          <h1 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, color:"#faf7f2", margin:"0 0 14px", letterSpacing:"-1px" }}>
            Get in Touch
          </h1>
          <p style={{ color:"#a8d5b5", fontSize:"17px", maxWidth:"500px", margin:"0 auto", lineHeight:1.6 }}>
            Whether you need a custom order, bulk quote, or just want to say hi — we'd love to hear from you.
          </p>
        </motion.div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"60px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"40px", alignItems:"start" }}>

          {/* ── Left info panel ── */}
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.1 }}>

            {/* Contact info cards */}
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", marginBottom:"32px" }}>
              {INFO_ITEMS.map(({ icon, label, value, link }) => (
                <div key={label} style={{
                  background:"#fff",
                  borderRadius:"14px",
                  padding:"16px 18px",
                  display:"flex",
                  alignItems:"center",
                  gap:"14px",
                  border:"1.5px solid #f0f0f0",
                  boxShadow:"0 1px 6px rgba(0,0,0,0.04)",
                }}>
                  <div style={{ width:"42px", height:"42px", borderRadius:"12px", background:"var(--green-100,#d1fae5)", display:"flex", alignItems:"center", justifyContent:"center", color:"var(--green-800,#166534)", flexShrink:0 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize:"11px", color:"#9ca3af", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"2px" }}>{label}</div>
                    {link ? (
                      <a href={link} style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a", textDecoration:"none" }}
                        onMouseEnter={(e) => (e.target.style.color = "#2d6a4f")}
                        onMouseLeave={(e) => (e.target.style.color = "#1a3a2a")}>
                        {value}
                      </a>
                    ) : (
                      <span style={{ fontSize:"14px", fontWeight:600, color:"#1a3a2a" }}>{value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reason chips */}
            <div style={{ background:"#fff", borderRadius:"16px", padding:"20px", border:"1.5px solid #f0f0f0" }}>
              <p style={{ fontSize:"13px", fontWeight:700, color:"#1a3a2a", margin:"0 0 12px", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                Common topics
              </p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                {REASONS.map(({ icon, text }) => (
                  <div key={text} style={{
                    display:"inline-flex", alignItems:"center", gap:"6px",
                    padding:"6px 12px", borderRadius:"20px",
                    background:"var(--cream,#faf7f2)",
                    border:"1.5px solid #e5e7eb",
                    fontSize:"13px", color:"#374151", fontWeight:500,
                  }}>
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>

            {/* Eco badge */}
            <div style={{ marginTop:"20px", background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)", borderRadius:"16px", padding:"20px 22px", color:"#a8d5b5", display:"flex", gap:"14px", alignItems:"center" }}>
              <span style={{ fontSize:"28px" }}>🌿</span>
              <div>
                <div style={{ color:"#faf7f2", fontWeight:700, fontSize:"14px", marginBottom:"3px" }}>Sustainable Business</div>
                <div style={{ fontSize:"13px", lineHeight:1.5 }}>We're committed to eco-friendly practices. Every bag we sell plants a tree.</div>
              </div>
            </div>
          </motion.div>

          {/* ── Right form ── */}
          <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5, delay:0.15 }}>
            <div style={{ background:"#fff", borderRadius:"20px", padding:"36px 32px", boxShadow:"0 4px 24px rgba(0,0,0,0.07)", border:"1.5px solid #f0f0f0" }}>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div key="success"
                    initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                    style={{ textAlign:"center", padding:"40px 20px" }}
                  >
                    <div style={{ fontSize:"60px", marginBottom:"16px" }}>✉️</div>
                    <h3 style={{ fontSize:"22px", fontWeight:800, color:"#1a3a2a", margin:"0 0 8px" }}>Message Sent!</h3>
                    <p style={{ color:"#6b7280", fontSize:"15px", lineHeight:1.6, margin:"0 0 24px" }}>
                      {resMsg}
                    </p>
                    <button onClick={() => setStatus("")}
                      style={{ background:"#1a3a2a", color:"#fff", border:"none", borderRadius:"10px", padding:"11px 28px", fontWeight:600, cursor:"pointer", fontSize:"14px" }}>
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
                    <div style={{ marginBottom:"24px" }}>
                      <h2 style={{ fontSize:"22px", fontWeight:800, color:"#1a3a2a", margin:"0 0 4px" }}>Send us a message</h2>
                      <p style={{ color:"#6b7280", fontSize:"14px", margin:0 }}>Fill out the form and we'll respond within 24 hours.</p>
                    </div>

                    {status === "error" && (
                      <div style={{ background:"#fef2f2", border:"1px solid #fca5a5", borderRadius:"8px", padding:"10px 12px", color:"#b91c1c", fontSize:"13px", marginBottom:"16px" }}>
                        ⚠️ {resMsg}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"14px" }}>
                        <div>
                          <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"#374151", marginBottom:"5px" }}>Full Name *</label>
                          <input type="text" required value={form.name} onChange={set("name")}
                            placeholder="Your name"
                            style={inputBase("name")}
                            onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
                        </div>
                        <div>
                          <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"#374151", marginBottom:"5px" }}>Email Address *</label>
                          <input type="email" required value={form.email} onChange={set("email")}
                            placeholder="you@example.com"
                            style={inputBase("email")}
                            onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
                        </div>
                      </div>

                      <div style={{ marginBottom:"14px" }}>
                        <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"#374151", marginBottom:"5px" }}>Subject</label>
                        <select value={form.subject} onChange={set("subject")}
                          style={{ ...inputBase("subject"), appearance:"none", backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat:"no-repeat", backgroundPosition:"right 12px center", backgroundSize:"16px" }}
                          onFocus={() => setFocused("subject")} onBlur={() => setFocused("")}>
                          <option value="">Select a topic…</option>
                          <option value="bulk-order">Bulk Order Enquiry</option>
                          <option value="custom-print">Custom Print & Design</option>
                          <option value="shipping">Shipping & Delivery</option>
                          <option value="eco-cert">Eco Certification</option>
                          <option value="return">Return / Refund</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div style={{ marginBottom:"20px" }}>
                        <label style={{ display:"block", fontSize:"12px", fontWeight:600, color:"#374151", marginBottom:"5px" }}>Message *</label>
                        <textarea required rows={5} value={form.message} onChange={set("message")}
                          placeholder="Describe your query in detail — product type, quantity, special requirements..."
                          style={{ ...inputBase("message"), resize:"vertical", lineHeight:1.6 }}
                          onFocus={() => setFocused("message")} onBlur={() => setFocused("")} />
                        <div style={{ textAlign:"right", fontSize:"11px", color:"#9ca3af", marginTop:"3px" }}>
                          {form.message.length} / 500
                        </div>
                      </div>

                      <button type="submit" disabled={submitting}
                        style={{
                          width:"100%", padding:"14px", borderRadius:"10px", border:"none",
                          background:"linear-gradient(135deg,#2d6a4f,#1a3a2a)",
                          color:"#fff", fontSize:"15px", fontWeight:700,
                          cursor:submitting ? "not-allowed" : "pointer",
                          opacity:submitting ? 0.7 : 1,
                          display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
                          transition:"all 0.2s",
                        }}>
                        {submitting ? (
                          <>
                            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
                              style={{ animation:"spin 1s linear infinite" }}>
                              <circle cx={12} cy={12} r={10} strokeOpacity={0.3}/>
                              <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>Send Message <span>→</span></>
                        )}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
