"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const WORDS = ["Shopping", "Gifting", "Branding", "Events", "Packaging"];

export default function HeroSection() {
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d2318 0%, #1a3a2a 50%, #2d6a4f 100%)" }}
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #74c69d, transparent)" }} />
        <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #c9a84c, transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: "radial-gradient(circle, #52b788, transparent)" }} />
      </div>

      {/* ── Floating leaf particles ── */}
      {["🌿","🍃","🌱","🌿","🍃"].map((leaf, i) => (
        <span key={i} className="absolute text-2xl opacity-20 animate-float pointer-events-none select-none"
          style={{
            top:  `${15 + i * 16}%`,
            left: `${5 + i * 18}%`,
            animationDelay: `${i * 0.8}s`,
            animationDuration: `${4 + i}s`,
          }}>
          {leaf}
        </span>
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center w-full">
        {/* ── Left: Text ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            style={{ background: "rgba(201,168,76,0.15)", color: "#e8c97a", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            🌿 100% Eco-Friendly &amp; Handmade
          </motion.div>

          {/* Headline */}
          <h1 className="text-white font-black leading-tight mb-6"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4.2rem)", letterSpacing: "-0.02em" }}>
            Paper Bags For<br />
            <span className="relative inline-block">
              <motion.span
                key={wordIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                style={{ color: "var(--gold-light)" }}
              >
                {WORDS[wordIdx]}
              </motion.span>
            </span>
          </h1>

          <p className="text-lg mb-10 leading-relaxed max-w-md" style={{ color: "rgba(255,255,255,0.72)" }}>
            Beautiful, sustainable paper bags crafted by skilled artisans.
            Custom branding, fast delivery, and zero plastic — because the planet deserves better.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-gold text-base px-8 py-3.5">
                Shop Now →
              </motion.button>
            </Link>
            <Link href="/contact">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="text-base px-8 py-3.5 rounded-full font-semibold border-2 transition"
                style={{ borderColor: "rgba(255,255,255,0.4)", color: "rgba(255,255,255,0.9)" }}
                onMouseEnter={e => { e.target.style.background="rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.target.style.background="transparent"; }}
              >
                Custom Order
              </motion.button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-10">
            {[
              { icon: "🌱", label: "Biodegradable" },
              { icon: "✋", label: "Handcrafted" },
              { icon: "🚚", label: "Pan-India Delivery" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                <span className="text-lg">{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: Visual ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="relative">
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full animate-ping-slow opacity-30"
              style={{ background: "radial-gradient(circle, rgba(82,183,136,0.4), transparent)", scale: 1.2 }} />

            <motion.div animate={{ y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}>
              <img
                src="/3d.png"
                alt="Eco Paper Bags"
                className="relative w-full max-w-sm drop-shadow-2xl"
                style={{ filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.5))" }}
              />
            </motion.div>

            {/* Floating stats card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-8 glass-dark rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="text-2xl font-black" style={{ color: "var(--gold-light)" }}>2,500+</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Happy Customers</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}
              className="absolute -top-4 -right-6 glass-dark rounded-2xl px-4 py-3 shadow-xl"
            >
              <p className="text-2xl font-black" style={{ color: "var(--green-400)" }}>100%</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Eco Certified</p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ── Wave bottom ── */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display:"block", height:"60px" }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--cream)" />
        </svg>
      </div>
    </section>
  );
}
