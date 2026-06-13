"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../context/StoreContext";

const WORDS = ["Shopping", "Gifting", "Branding", "Events", "Packaging", "Everyone"];

const ORDER_NOTIF = {
  name: "Priya from Mumbai",
  action: "just placed an order",
  time: "2 min ago",
};

export default function HeroSection() {
  const { store, slug } = useStore();
  const [wordIdx, setWordIdx] = useState(0);
  const [notifVisible, setNotifVisible] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);

  const isPaperbag = !slug || slug === "paperbag";

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setNotifVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const storeName = store?.name || "Paperbag";
  const storeDesc = store?.description
    || "India's marketplace for handcrafted eco-friendly bags. Buy from hundreds of sellers — or sell your own creations with zero listing fees.";

  return (
    <section
      className="relative min-h-[100vh] flex flex-col justify-center overflow-hidden"
      style={{ paddingTop: "72px" }}
    >
      {/* ── Video Background ── */}
      <div className="absolute inset-0 z-0">
        {/* HTML5 Video — drop hero-bg.mp4 in /public/ to activate */}
        {!videoError && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.45 }}
            onError={() => setVideoError(true)}
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
            <source src="/hero-bg.webm" type="video/webm" />
          </video>
        )}

        {/* CSS animated gradient fallback (also shown as base layer always) */}
        <div
          className="absolute inset-0"
          style={{
            background: videoError
              ? "linear-gradient(135deg, #080e09 0%, #0d2318 30%, #1a3a2a 60%, #080808 100%)"
              : "#080e09",
            animation: videoError ? "gradient-shift 8s ease-in-out infinite" : "none",
          }}
        />

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              bottom: "-10%", left: "-5%",
              width: "60vw", height: "60vw",
              background: "radial-gradient(circle, rgba(82,183,136,0.12) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "5%", right: "8%",
              width: "40vw", height: "40vw",
              background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
            }}
          />
          {/* Subtle grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Dark overlay to ensure text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.35) 40%, rgba(8,8,8,0.7) 85%, #080808 100%)",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center min-h-[76vh]">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 w-fit"
              style={{
                background: "rgba(82,183,136,0.1)",
                border: "1px solid rgba(82,183,136,0.3)",
                color: "#74c69d",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow inline-block" />
              🌿 500+ Eco Sellers Live
            </motion.div>

            {/* Heading */}
            <h1
              className="select-none mb-6"
              style={{
                fontSize: "clamp(2.8rem, 7vw, 6rem)",
                lineHeight: 0.92,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#fff",
              }}
            >
              {isPaperbag ? (
                <>
                  Be the store<br />
                  <span style={{ color: "rgba(255,255,255,0.32)" }}>they shop from for</span>
                  <br />
                  <span
                    className="relative inline-block overflow-hidden"
                    style={{ height: "1.08em", verticalAlign: "bottom" }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIdx}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block text-gradient"
                      >
                        {WORDS[wordIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </>
              ) : (
                storeName
              )}
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {storeDesc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center mb-14">
              <Link href={isPaperbag ? "/products" : `/store/${slug}/products`}>
                <button className="btn-white text-sm font-bold">
                  Shop Now →
                </button>
              </Link>
              <Link href={isPaperbag ? "/seller/register" : `/store/${slug}/contact`}>
                <button className="btn-outline-white text-sm">
                  {isPaperbag ? "🚀 Start Selling" : "Contact Us"}
                </button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: "🌱", text: "100% Biodegradable" },
                { icon: "✋", text: "Handcrafted" },
                { icon: "🚚", text: "Pan-India Delivery" },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-2 text-xs font-medium"
                  style={{ color: "rgba(255,255,255,0.42)" }}
                >
                  <span className="text-sm">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating stats + notification (desktop) */}
          <div className="hidden lg:flex flex-col items-end gap-5">
            {/* Stats cards */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-2 gap-3 w-64"
            >
              {[
                { val: "500+",  label: "Sellers",     color: "#52b788" },
                { val: "12K+",  label: "Products",    color: "#c9a84c" },
                { val: "95%",   label: "Satisfaction", color: "#74c69d" },
                { val: "₹0",    label: "Listing Fee", color: "#e8c97a" },
              ].map(({ val, label, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="dark-card p-4 text-center"
                >
                  <p className="text-xl font-black" style={{ color }}>{val}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Live order notification */}
            <AnimatePresence>
              {notifVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="dark-card px-4 py-3 flex items-center gap-3 w-64"
                  style={{ border: "1px solid rgba(82,183,136,0.2)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: "rgba(82,183,136,0.15)" }}
                  >
                    🛒
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{ORDER_NOTIF.name}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {ORDER_NOTIF.action} · {ORDER_NOTIF.time}
                    </p>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 animate-ping-slow"
                    style={{ background: "#52b788" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)" }}>
          Scroll
        </p>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
        />
      </motion.div>

      {/* ── Bottom curve ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12"
        style={{ background: "var(--bg-0)", borderRadius: "48px 48px 0 0" }}
      />

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { filter: hue-rotate(0deg); }
          50% { filter: hue-rotate(15deg); }
        }
      `}</style>
    </section>
  );
}
