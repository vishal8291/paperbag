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

// Alternate outer (tip) and inner (valley) radii to form a star shape
const OUTER_R = 230;
const INNER_R = 130;

function getStarPoints(count) {
  // count items alternating between outer and inner radius
  return Array.from({ length: count }, (_, i) => {
    const angle = (i * 360) / count - 90; // start from top
    const rad   = (angle * Math.PI) / 180;
    const r     = i % 2 === 0 ? OUTER_R : INNER_R;
    return { x: r * Math.cos(rad), y: r * Math.sin(rad), delay: i * 0.35 };
  });
}

const POINTS = getStarPoints(12);

export default function CategoriesSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--bg-1)", padding: "7rem 0" }}
    >
      {/* store.png background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/store.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.12,
        }}
      />
      {/* Dark overlay so star stays readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(82,183,136,0.07) 0%, transparent 70%)",
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

      {/* ── Star wheel (desktop) ── */}
      <div className="hidden md:flex justify-center items-center">
        <div
          className="relative star-spin"
          style={{ width: "560px", height: "560px" }}
        >
          {/* Decorative orbit rings */}
          <div className="absolute rounded-full pointer-events-none" style={{
            width: "480px", height: "480px", top: "40px", left: "40px",
            border: "1px dashed rgba(255,255,255,0.05)",
          }} />
          <div className="absolute rounded-full pointer-events-none" style={{
            width: "280px", height: "280px", top: "140px", left: "140px",
            border: "1px dashed rgba(82,183,136,0.1)",
          }} />

          {/* Star tip spokes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute pointer-events-none"
              style={{
                width: "1px",
                height: "240px",
                top: "50%",
                left: "50%",
                transformOrigin: "top center",
                transform: `translate(-50%, 0) rotate(${i * 30}deg)`,
                background: "linear-gradient(to bottom, transparent 5%, rgba(82,183,136,0.08) 50%, transparent 100%)",
              }}
            />
          ))}

          {/* Category tiles — each counter-rotates to stay upright, and floats */}
          {CATS.map((cat, i) => {
            const { x, y, delay } = POINTS[i];
            return (
              <Link key={i} href="/products">
                <div
                  className="absolute cat-tile counter-spin"
                  style={{
                    width: "92px",
                    height: "92px",
                    top: "50%",
                    left: "50%",
                    marginTop: "-46px",
                    marginLeft: "-46px",
                    "--tx": `${x}px`,
                    "--ty": `${y}px`,
                    "--float-delay": `${delay}s`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-2xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-110"
                    style={{
                      background: `${cat.color}14`,
                      border: `1px solid ${cat.color}30`,
                    }}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <p className="text-[9px] font-bold text-center leading-tight px-1"
                      style={{ color: "rgba(255,255,255,0.8)" }}>
                      {cat.name}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* Center */}
          <div
            className="absolute flex flex-col items-center justify-center rounded-full z-10"
            style={{
              width: "130px", height: "130px",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              background: "radial-gradient(circle, rgba(82,183,136,0.2) 0%, rgba(82,183,136,0.04) 70%)",
              border: "1px solid rgba(82,183,136,0.3)",
            }}
          >
            <span className="text-3xl mb-1">🌿</span>
            <p className="text-xs font-black text-white">Paperbag</p>
            <p className="text-[9px] mt-0.5" style={{ color: "#74c69d" }}>500+ Sellers</p>
          </div>
        </div>
      </div>

      {/* ── Mobile: simple grid ── */}
      <div className="md:hidden grid grid-cols-3 gap-3 px-6">
        {CATS.map(({ icon, name, color }) => (
          <Link key={name} href="/products">
            <div
              className="flex flex-col items-center gap-1.5 rounded-2xl p-3 text-center"
              style={{ background: `${color}12`, border: `1px solid ${color}25` }}
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

      <style>{`
        /* Whole star rotates slowly */
        @keyframes star-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .star-spin {
          animation: star-rotate 60s linear infinite;
        }

        /* Each tile translates to its star position, then counter-rotates to stay upright, then floats */
        @keyframes tile-float {
          0%, 100% { transform: translate(var(--tx), var(--ty)) rotate(var(--spin, 0deg)) translateY(0px); }
          50%       { transform: translate(var(--tx), var(--ty)) rotate(var(--spin, 0deg)) translateY(-10px); }
        }
        .cat-tile {
          animation: tile-float 4s ease-in-out infinite;
          animation-delay: var(--float-delay, 0s);
          transform: translate(var(--tx), var(--ty));
        }

        /* Counter-spin so tiles face upright while the star rotates */
        @keyframes counter-rotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .counter-spin > div {
          animation: counter-rotate 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
