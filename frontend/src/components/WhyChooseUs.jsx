"use client";

import React from "react";
import { motion } from "framer-motion";
import { useStore } from "../context/StoreContext";

// Inspired by Shopify image 2 — "Sell everywhere eco buyers browse"
const CHANNELS = [
  { icon: "🤖", name: "Leaf AI",      color: "#52b788", desc: "AI-powered shopping" },
  { icon: "📱", name: "Instagram",    color: "#e1306c", desc: "Social discovery" },
  { icon: "💬", name: "WhatsApp",     color: "#25d366", desc: "Conversational buy" },
  { icon: "🔍", name: "Google",       color: "#4285f4", desc: "Search-first" },
  { icon: "🌿", name: "Paperbag App", color: "#c9a84c", desc: "Native experience" },
  { icon: "🏪", name: "Stores Page",  color: "#74c69d", desc: "Browse & discover" },
];

const FEATURES = [
  { icon: "🆓", title: "Zero Listing Fees",     desc: "List unlimited products — we only earn when you do." },
  { icon: "💰", title: "10% Commission Only",    desc: "The lowest split in India's eco-marketplace space." },
  { icon: "⚡", title: "Weekly Payouts",         desc: "Earnings transferred directly to your bank every week." },
  { icon: "🤖", title: "Leaf AI Assistant",      desc: "Our AI helps your buyers find exactly what they need." },
  { icon: "📊", title: "Analytics Dashboard",    desc: "Real-time sales, revenue, and product performance data." },
  { icon: "🌿", title: "Eco Community",          desc: "Reach millions of green-conscious buyers across India." },
];

export default function WhyChooseUs() {
  const { slug } = useStore();
  const isPaperbag = !slug || slug === "paperbag";

  return (
    <section
      className="section-xl relative overflow-hidden"
      style={{ background: "var(--bg-0)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "80vw", height: "50vh",
          background: "radial-gradient(ellipse, rgba(82,183,136,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section 1: Multi-channel ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          {/* Left: Channel cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="grid grid-cols-3 gap-3">
              {CHANNELS.map((ch, i) => (
                <motion.div
                  key={ch.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  className="dark-card p-4 flex flex-col items-center gap-2 text-center cursor-default"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${ch.color}18` }}
                  >
                    {ch.icon}
                  </div>
                  <p className="text-xs font-bold text-white">{ch.name}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{ch.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Live stat strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-4 dark-card p-4 flex items-center gap-4"
              style={{ border: "1px solid rgba(82,183,136,0.15)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(82,183,136,0.15)" }}
              >
                🛒
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-white">Kavita from Pune ordered an Eco Tote</p>
                <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>via Leaf AI · 30 seconds ago</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white">₹349</p>
                <p className="text-[9px]" style={{ color: "#52b788" }}>Paid ✓</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}
            >
              Multi-Channel
            </span>
            <h2 className="display-lg mb-6">
              Sell everywhere<br />
              <span style={{ color: "rgba(255,255,255,0.35)" }}>eco buyers browse.</span><br />
              Online and in chat.
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
              Your products appear on Google search, Leaf AI conversations, and our curated stores directory — all automatically, without any extra setup.
            </p>
            <div className="space-y-3">
              {[
                "Auto-indexed on Google & AI shopping",
                "Discoverable via Leaf AI chat assistant",
                "Featured in Paperbag Stores directory",
              ].map(text => (
                <div key={text} className="flex items-center gap-3 text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]"
                    style={{ background: "rgba(82,183,136,0.2)", color: "#74c69d" }}>✓</span>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Section 2: Seller perks grid ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="display-md mb-4">
              Everything you need to{" "}
              <span className="text-gradient">build your eco business</span>
            </h2>
            <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.5)" }}>
              From day one to your first thousand orders — Paperbag has the tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className="dark-card p-6 flex gap-4 items-start"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "rgba(82,183,136,0.1)" }}
                >
                  {icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
