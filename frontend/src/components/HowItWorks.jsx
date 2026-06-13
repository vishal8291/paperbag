"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

// Inspired by Shopify image 12 — "Build fast" split layout with numbered steps

const SELL_STEPS = [
  {
    num: "01",
    title: "Register your store",
    desc: "Create your seller profile in 3 minutes. Add your store name, category, and bio — that's all.",
    color: "#52b788",
    icon: "🏪",
  },
  {
    num: "02",
    title: "List your products",
    desc: "Upload photos, set prices, and describe your eco products. List as many as you want — free.",
    color: "#c9a84c",
    icon: "📦",
  },
  {
    num: "03",
    title: "Start selling & get paid",
    desc: "Receive orders, fulfill them, and get weekly payouts directly to your bank. Zero hassle.",
    color: "#74c69d",
    icon: "💸",
  },
];

const BUY_STEPS = [
  {
    num: "01",
    title: "Browse & discover",
    desc: "Search products or explore our curated eco-seller stores. Filter by category, price, or eco tag.",
    color: "#52b788",
    icon: "🔍",
  },
  {
    num: "02",
    title: "Add to cart",
    desc: "Pick quantities, check seller ratings, and add to cart. Items from multiple sellers in one cart.",
    color: "#c9a84c",
    icon: "🛒",
  },
  {
    num: "03",
    title: "Pay & track",
    desc: "Secure UPI, card, or COD checkout. Track your order from dispatch to doorstep in real-time.",
    color: "#74c69d",
    icon: "🚚",
  },
];

// Mini dashboard mockup as the visual
function DashboardMockup() {
  return (
    <div
      className="rounded-2xl overflow-hidden w-full max-w-sm"
      style={{
        background: "#0a0e0c",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Title bar */}
      <div
        className="px-4 py-3 flex items-center gap-2"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "#080c09" }}
      >
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
          paperbag.in/seller/dashboard
        </span>
      </div>

      <div className="p-5">
        {/* Welcome */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>Welcome back,</p>
            <p className="text-sm font-bold text-white">Priya's Eco Store 🌿</p>
          </div>
          <div
            className="px-2 py-0.5 rounded-full text-[9px] font-bold"
            style={{ background: "rgba(82,183,136,0.15)", color: "#52b788" }}
          >
            ✓ Approved
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { label: "Revenue",  val: "₹24,890", color: "#52b788" },
            { label: "Orders",   val: "134",      color: "#c9a84c" },
            { label: "Products", val: "28",        color: "#74c69d" },
          ].map(({ label, val, color }) => (
            <div
              key={label}
              className="rounded-xl p-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-sm font-black" style={{ color }}>{val}</p>
              <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Mini bar chart */}
        <div className="mb-5">
          <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Weekly Revenue
          </p>
          <div className="flex items-end gap-1.5 h-14">
            {[35, 55, 40, 80, 65, 90, 75].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-sm"
                style={{ background: i === 5 ? "#52b788" : "rgba(82,183,136,0.25)" }}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.6, ease: "easeOut" }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i} className="flex-1 text-center text-[8px]" style={{ color: "rgba(255,255,255,0.25)" }}>{d}</span>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>
            Recent Orders
          </p>
          {[
            { buyer: "Rahul S.", item: "Kraft Tote ×2", amt: "₹598", status: "Shipped", color: "#c9a84c" },
            { buyer: "Meera P.", item: "Gift Box Set",   amt: "₹549", status: "Pending", color: "#52b788" },
          ].map(({ buyer, item, amt, status, color }) => (
            <div
              key={buyer}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            >
              <div>
                <p className="text-[10px] font-semibold text-white">{buyer}</p>
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>{item}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-white">{amt}</p>
                <span
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const { slug } = useStore();
  const isPaperbag = !slug || slug === "paperbag";

  return (
    <section
      className="section-xl relative overflow-hidden"
      style={{ background: "var(--bg-0)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 80% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(201,168,76,0.1)", color: "#e8c97a", border: "1px solid rgba(201,168,76,0.2)" }}
          >
            Quick Start
          </span>
          <h2 className="display-lg mb-4">
            Build fast on{" "}
            <span className="text-gradient">Paperbag</span>
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Whether you're buying eco products or building your seller business — we make it effortless.
          </p>
        </motion.div>

        {/* Two column: Sell + Buy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* Left: Sell steps */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "rgba(82,183,136,0.15)" }}>
                🏪
              </div>
              <div>
                <p className="text-sm font-black text-white">For Sellers</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Start earning in minutes</p>
              </div>
            </div>

            <div className="space-y-0">
              {SELL_STEPS.map(({ num, title, desc, color, icon }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className="flex gap-5 pb-8 relative"
                  style={i < SELL_STEPS.length - 1 ? {} : {}}
                >
                  {/* Number + line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shrink-0"
                      style={{ background: color, boxShadow: `0 0 20px ${color}40` }}
                    >
                      {num}
                    </div>
                    {i < SELL_STEPS.length - 1 && (
                      <div className="w-px flex-1 mt-2" style={{ background: "rgba(255,255,255,0.07)" }} />
                    )}
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{icon}</span>
                      <h3 className="text-sm font-bold text-white">{title}</h3>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/seller/register">
              <button className="btn-eco text-sm font-bold">
                Register as Seller →
              </button>
            </Link>
          </div>

          {/* Right: Dashboard + buy steps */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <DashboardMockup />
            </motion.div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ background: "rgba(201,168,76,0.15)" }}>
                🛒
              </div>
              <div>
                <p className="text-sm font-black text-white">For Buyers</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Discover & shop sustainably</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {BUY_STEPS.map(({ num, title, desc, color }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-4 dark-card p-4"
                >
                  <span
                    className="text-xs font-black shrink-0 w-7 h-7 flex items-center justify-center rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {num}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white">{title}</p>
                    <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/products">
              <button className="btn-white text-sm font-bold">
                Shop Now →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
