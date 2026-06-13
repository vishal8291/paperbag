"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

// Inspired by Shopify image 8 — colorful category icon wall
const CATS = [
  { icon: "🛍️", name: "Shopping Bags",   color: "#52b788" },
  { icon: "🎁", name: "Gift Bags",        color: "#c9a84c" },
  { icon: "📦", name: "Kraft Paper",      color: "#d4845a" },
  { icon: "💼", name: "Branded Bags",     color: "#6366f1" },
  { icon: "👗", name: "Fashion",          color: "#ec4899" },
  { icon: "🌸", name: "Floral",          color: "#f97316" },
  { icon: "🍃", name: "Organic",         color: "#74c69d" },
  { icon: "🧶", name: "Crafts",          color: "#a78bfa" },
  { icon: "📚", name: "Books",           color: "#60a5fa" },
  { icon: "🏡", name: "Home Décor",      color: "#fb923c" },
  { icon: "💍", name: "Jewellery",       color: "#fbbf24" },
  { icon: "🌿", name: "Sustainable",     color: "#34d399" },
  { icon: "🍫", name: "Food & Sweets",   color: "#b45309" },
  { icon: "🎨", name: "Art & Print",     color: "#e879f9" },
  { icon: "👶", name: "Kids & Toys",     color: "#38bdf8" },
  { icon: "💄", name: "Beauty",          color: "#f43f5e" },
  { icon: "⚽", name: "Sports",          color: "#22d3ee" },
  { icon: "🧴", name: "Wellness",        color: "#86efac" },
  { icon: "🎉", name: "Party",           color: "#fde68a" },
  { icon: "🐾", name: "Pet Products",    color: "#fdba74" },
  { icon: "✈️", name: "Travel",         color: "#67e8f9" },
  { icon: "🌍", name: "Global Sellers",  color: "#a3e635" },
  { icon: "🔧", name: "DIY & Tools",     color: "#94a3b8" },
  { icon: "📱", name: "Tech Covers",     color: "#818cf8" },
];

const ROW1 = [...CATS.slice(0, 13), ...CATS.slice(0, 13)];
const ROW2 = [...CATS.slice(12), ...CATS.slice(12)];

function CategoryTile({ icon, name, color }) {
  return (
    <Link href="/products">
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:scale-105 shrink-0"
        style={{
          background: `${color}12`,
          border: `1px solid ${color}25`,
          width: "110px",
          height: "110px",
        }}
      >
        <span className="text-3xl">{icon}</span>
        <p className="text-[10px] font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.8)" }}>
          {name}
        </p>
      </div>
    </Link>
  );
}

export default function CategoriesSection() {
  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--bg-1)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 40% at 50% 100%, rgba(82,183,136,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(201,168,76,0.1)", color: "#e8c97a", border: "1px solid rgba(201,168,76,0.2)" }}
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

      {/* Row 1 — scrolls left */}
      <div className="marquee-wrap mb-4">
        <div className="marquee-track animate-marquee gap-3 flex py-2">
          {ROW1.map((cat, i) => (
            <div key={i} className="mx-1.5">
              <CategoryTile {...cat} />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="marquee-wrap">
        <div className="marquee-track animate-marquee-rev gap-3 flex py-2">
          {ROW2.map((cat, i) => (
            <div key={i} className="mx-1.5">
              <CategoryTile {...cat} />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link href="/products">
          <button className="btn-white text-sm font-bold">Browse All Categories →</button>
        </Link>
      </motion.div>
    </section>
  );
}
