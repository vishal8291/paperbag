"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { newsletterApi } from "../lib/api";

export default function NewsletterSubscription() {
  const [email,  setEmail]  = useState("");
  const [status, setStatus] = useState(""); // "success" | "error" | ""
  const [msg,    setMsg]    = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await newsletterApi.subscribe({ email });
      setStatus("success");
      setMsg("You're in! 🎉 Watch your inbox for exclusive deals.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad" style={{ background: "var(--green-800)" }}>
      <div className="max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <span className="text-5xl mb-4 block">📬</span>
          <h2 className="text-4xl font-black text-white mb-3">
            Stay in the Loop
          </h2>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.72)" }}>
            Subscribe for exclusive deals, eco tips, and new product launches.
            No spam — ever.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}
            >
              <span className="text-2xl">✅</span>
              <span className="font-semibold">{msg}</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email" required
                placeholder="your@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full text-gray-900 text-sm focus:outline-none shadow-inner"
                style={{ background: "rgba(255,255,255,0.95)" }}
              />
              <button type="submit" disabled={loading} className="btn-gold py-3.5 px-7 whitespace-nowrap">
                {loading ? "Subscribing..." : "Subscribe →"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>{msg}</p>
          )}

          <p className="mt-5 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            🔒 We respect your privacy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
