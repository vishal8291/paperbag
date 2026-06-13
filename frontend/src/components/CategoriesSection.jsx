"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const CATS = [
  { icon: "🛍️", name: "Shopping Bags",  color: "#52b788" },
  { icon: "🎁", name: "Gift Bags",       color: "#c9a84c" },
  { icon: "📦", name: "Kraft Paper",     color: "#d4845a" },
  { icon: "💼", name: "Branded Bags",    color: "#6366f1" },
  { icon: "👗", name: "Fashion",         color: "#ec4899" },
  { icon: "🌸", name: "Floral",          color: "#f97316" },
  { icon: "🍃", name: "Organic",         color: "#74c69d" },
  { icon: "🧶", name: "Crafts",          color: "#a78bfa" },
  { icon: "📚", name: "Books",           color: "#60a5fa" },
  { icon: "🏡", name: "Home Décor",      color: "#fb923c" },
  { icon: "💍", name: "Jewellery",       color: "#fbbf24" },
  { icon: "🌿", name: "Sustainable",     color: "#34d399" },
];

// Position n items evenly on a circle of given radius
// Star points: items at star-tip angles (every 360/n degrees)
function getStarPositions(count, radius) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i * 360) / count - 90; // start from top
    const rad = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
      angle,
    };
  });
}

// Inner ring (6 items, smaller radius) + outer ring (12 items, larger radius)
const INNER = CATS.slice(0, 6);
const OUTER = CATS.slice(6, 12);

const CENTER_SIZE = 140; // px for center circle

export default function CategoriesSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--bg-1)", padding: "7rem 0" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(82,183,136,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(201,168,76,0.1)",
              color: "#e8c97a",
              border: "1px solid rgba(201,168,76,0.2)",
            }}
          >
            Marketplace
          </span>
          <h2 className="display-md mb-4">
            Every eco category,{" "}
            <span className="text-gradient">all in one place</span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            From handmade crafts to branded packaging — our sellers cover it all.
          </p>
        </motion.div>
      </div>

      {/* Star wheel */}
      <div className="flex justify-center items-center">
        {/* Outer container — sized to fit both rings */}
        <div
          className="relative"
          style={{ width: "600px", height: "600px" }}
        >
          {/* ── Outer ring orbit lines ── */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "560px", height: "560px",
              top: "20px", left: "20px",
              border: "1px dashed rgba(255,255,255,0.06)",
            }}
          />
          {/* Inner ring orbit line */}
          <div
            className="absolute rounded-full pointer-events-none"
            style={{
              width: "320px", height: "320px",
              top: "140px", left: "140px",
              border: "1px dashed rgba(82,183,136,0.12)",
            }}
          />

          {/* ── Outer ring — 6 categories, slow clockwise ── */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          >
            {getStarPositions(6, 265).map(({ x, y }, i) => {
              const cat = OUTER[i];
              return (
                <Link key={i} href="/products">
                  {/* Counter-rotate the tile so it stays upright */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="absolute flex flex-col items-center justify-center gap-1.5 rounded-2xl cursor-pointer group"
                    style={{
                      width: "96px",
                      height: "96px",
                      top: "50%",
                      left: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      background: `${cat.color}14`,
                      border: `1px solid ${cat.color}28`,
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    whileHover={{
                      background: `${cat.color}28`,
                      borderColor: `${cat.color}55`,
                      scale: 1.1,
                    }}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p
                      className="text-[9px] font-semibold text-center leading-tight px-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {cat.name}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {/* ── Inner ring — 6 categories, slow counter-clockwise ── */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {getStarPositions(6, 148).map(({ x, y }, i) => {
              const cat = INNER[i];
              return (
                <Link key={i} href="/products">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="absolute flex flex-col items-center justify-center gap-1.5 rounded-xl cursor-pointer group"
                    style={{
                      width: "84px",
                      height: "84px",
                      top: "50%",
                      left: "50%",
                      transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                      background: `${cat.color}14`,
                      border: `1px solid ${cat.color}28`,
                      transition: "background 0.2s, border-color 0.2s",
                    }}
                    whileHover={{
                      background: `${cat.color}28`,
                      borderColor: `${cat.color}55`,
                      scale: 1.1,
                    }}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <p
                      className="text-[9px] font-semibold text-center leading-tight px-1"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {cat.name}
                    </p>
                  </motion.div>
                </Link>
              );
            })}
          </motion.div>

          {/* ── Center circle ── */}
          <div
            className="absolute flex flex-col items-center justify-center rounded-full"
            style={{
              width: `${CENTER_SIZE}px`,
              height: `${CENTER_SIZE}px`,
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(82,183,136,0.18) 0%, rgba(82,183,136,0.04) 70%)",
              border: "1px solid rgba(82,183,136,0.25)",
              zIndex: 10,
            }}
          >
            <span className="text-4xl mb-1">🌿</span>
            <p className="text-xs font-black text-white tracking-tight">Paperbag</p>
            <p className="text-[9px] mt-0.5" style={{ color: "#74c69d" }}>500+ Sellers</p>
          </div>

          {/* Star tip lines radiating from center (decorative) */}
          {getStarPositions(12, 265).map(({ x, y }, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: "1px",
                height: "265px",
                top: "50%",
                left: "50%",
                transformOrigin: "top center",
                transform: `translate(-50%, 0) rotate(${(i * 30)}deg)`,
                background: "linear-gradient(to bottom, transparent 10%, rgba(82,183,136,0.06) 50%, transparent 100%)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile fallback — simple grid */}
      <div className="md:hidden grid grid-cols-3 gap-3 px-6 mt-10">
        {CATS.map(({ icon, name, color }) => (
          <Link key={name} href="/products">
            <div
              className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center"
              style={{
                background: `${color}12`,
                border: `1px solid ${color}25`,
              }}
            >
              <span className="text-2xl">{icon}</span>
              <p className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>{name}</p>
            </div>
          </Link>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-14"
      >
        <Link href="/products">
          <button className="btn-white text-sm font-bold">Browse All Categories →</button>
        </Link>
      </motion.div>
    </section>
  );
}
