"use client";

import React from "react";
import { motion } from "framer-motion";

// Inspired by Shopify image 11 — 3D globe "Rock steady. Blazing fast."
// Pure CSS 3D globe animation with orbiting store pins

const STORE_PINS = [
  { city: "Mumbai",    orders: "1,240", angle: 0,   delay: "0s" },
  { city: "Delhi",     orders: "980",   angle: 72,  delay: "0.4s" },
  { city: "Bangalore", orders: "870",   angle: 144, delay: "0.8s" },
  { city: "Chennai",   orders: "620",   angle: 216, delay: "1.2s" },
  { city: "Kolkata",   orders: "540",   angle: 288, delay: "1.6s" },
];

function GlobeCSS() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 380, height: 380 }}>
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(82,183,136,0.15) 0%, transparent 65%)",
          animation: "pulse-glow 4s ease-in-out infinite",
        }}
      />

      {/* Globe body */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: 240,
          height: 240,
          background: "radial-gradient(circle at 35% 35%, #1a4a32 0%, #0d2318 40%, #080e09 100%)",
          boxShadow: "0 0 60px rgba(82,183,136,0.25), inset -15px -15px 40px rgba(0,0,0,0.7), inset 8px 8px 20px rgba(82,183,136,0.1)",
          border: "1px solid rgba(82,183,136,0.2)",
        }}
      >
        {/* Latitude lines */}
        {[30, 60, 90, 120, 150].map(top => (
          <div
            key={top}
            className="absolute left-0 right-0 border-t"
            style={{ top: `${top}px`, borderColor: "rgba(82,183,136,0.08)" }}
          />
        ))}
        {/* Longitude lines */}
        {[48, 96, 144, 192].map(left => (
          <div
            key={left}
            className="absolute top-0 bottom-0 border-l"
            style={{ left: `${left}px`, borderColor: "rgba(82,183,136,0.08)" }}
          />
        ))}
        {/* India map shape (simplified SVG) */}
        <svg
          viewBox="0 0 240 240"
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.35 }}
        >
          <path
            d="M95 55 L120 50 L145 58 L155 75 L158 95 L150 115 L145 140 L135 165 L120 195 L105 165 L95 140 L88 115 L82 95 L85 75 Z"
            fill="rgba(82,183,136,0.6)"
            stroke="rgba(82,183,136,0.4)"
            strokeWidth="1"
          />
        </svg>
        {/* Pulsing center dot */}
        <div
          className="absolute"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative flex items-center justify-center">
            <div
              className="absolute w-8 h-8 rounded-full"
              style={{
                background: "rgba(82,183,136,0.3)",
                animation: "pulse-ring 2s ease-out infinite",
              }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: "#52b788", boxShadow: "0 0 12px #52b788" }}
            />
          </div>
        </div>
        {/* Specular highlight */}
        <div
          className="absolute top-3 left-4 w-16 h-16 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
      </div>

      {/* Orbiting store pins */}
      <div
        className="absolute"
        style={{ width: 240, height: 240, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        {STORE_PINS.map(({ city, orders, angle, delay }, i) => {
          const rad = (angle * Math.PI) / 180;
          const r   = 150;
          const x   = 120 + r * Math.cos(rad);
          const y   = 120 + r * Math.sin(rad) * 0.5; // ellipse for 3D feel
          return (
            <motion.div
              key={city}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
              className="absolute flex flex-col items-center"
              style={{
                left: x - 40,
                top: y - 20,
                width: 80,
              }}
            >
              <div
                className="px-2.5 py-1.5 rounded-xl text-[9px] font-bold text-white text-center whitespace-nowrap"
                style={{
                  background: "rgba(13,35,24,0.95)",
                  border: "1px solid rgba(82,183,136,0.3)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                }}
              >
                📍 {city}
                <br />
                <span style={{ color: "#74c69d" }}>{orders} orders</span>
              </div>
              {/* Connector line to globe */}
              <div className="w-px h-4 mt-0.5" style={{ background: "rgba(82,183,136,0.3)" }} />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function TrustBadges() {
  return (
    <section
      className="section-xl relative overflow-hidden"
      style={{ background: "var(--bg-eco)" }}
    >
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 60% 50%, rgba(13,35,24,0.8) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
              style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}
            >
              Infrastructure
            </span>
            <h2 className="display-lg mb-6">
              Rock steady.<br />
              <span className="text-gradient">Blazing fast.</span>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
              Your Paperbag store stays online even during your biggest product drops.
              99.9% uptime, sub-second load times, and auto-scaling — built for India's peak shopping seasons.
            </p>

            <div className="space-y-4">
              {[
                { icon: "⚡", label: "99.9% Uptime",           desc: "Enterprise-grade reliability" },
                { icon: "🌐", label: "Pan-India CDN",           desc: "Fast load times everywhere in India" },
                { icon: "🔒", label: "Secure by Default",       desc: "SSL, PCI-compliant payments, data encryption" },
                { icon: "📦", label: "Real-Time Order Tracking", desc: "From dispatch to doorstep" },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(82,183,136,0.1)" }}
                  >
                    <span className="text-lg">{icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{label}</p>
                    <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: CSS Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <GlobeCSS />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
