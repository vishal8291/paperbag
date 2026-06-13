"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

// Inspired by Shopify image 10 — "There's no better place for you to build"
// Big conversion stats + floating checkout card

function AnimatedNumber({ end, suffix, active }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

const BIG_STATS = [
  { value: 500,  suffix: "+",  label: "Active Sellers",    sub: "India's fastest growing eco marketplace" },
  { value: 12000, suffix: "+", label: "Products Listed",   sub: "Handpicked eco-friendly items" },
  { value: 95,   suffix: "%",  label: "Order Satisfaction", sub: "Verified buyer reviews" },
  { value: 50000, suffix: "+", label: "Happy Buyers",      sub: "Across India and growing" },
];

// Floating order summary card
function OrderCard() {
  return (
    <div
      className="dark-card p-5 w-full max-w-xs"
      style={{ border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black text-sm">
          P
        </div>
        <div>
          <p className="text-xs font-bold text-white">Priya's Eco Store</p>
          <p className="text-[10px]" style={{ color: "#52b788" }}>✓ Approved Seller</p>
        </div>
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
        Order Summary
      </p>
      {[
        { name: "Kraft Tote Bag ×3", price: "₹897" },
        { name: "Gift Box Set ×1",   price: "₹549" },
        { name: "Delivery",          price: "FREE" },
      ].map(({ name, price }) => (
        <div key={name} className="flex justify-between items-center py-1.5 text-[11px]">
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{name}</span>
          <span className="font-bold text-white">{price}</span>
        </div>
      ))}
      <div
        className="flex justify-between items-center pt-3 mt-3 text-sm font-black text-white"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        <span>Total</span>
        <span>₹1,446</span>
      </div>
      <button
        className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-white"
        style={{ background: "linear-gradient(135deg, #2d6a4f, #52b788)" }}
      >
        Pay Now →
      </button>
      {/* Payment icons */}
      <div className="flex gap-2 justify-center mt-3 flex-wrap">
        {["UPI", "Card", "COD", "EMI"].map(m => (
          <span
            key={m}
            className="px-2 py-0.5 rounded text-[9px] font-bold"
            style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SustainabilityStats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className="section-xl relative overflow-hidden"
      style={{ background: "var(--bg-eco-2)" }}
    >
      {/* Large ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(82,183,136,0.08) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy + stats */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
                style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}
              >
                Results
              </span>
              <h2 className="display-lg mb-6">
                There's no better<br />
                <span style={{ color: "rgba(255,255,255,0.3)" }}>marketplace for</span><br />
                eco buyers in India.
              </h2>
              <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.5)" }}>
                Paperbag connects buyers who care about the planet with sellers who make sustainable products.
                The result? Higher trust, better conversions, loyal customers.
              </p>
            </motion.div>

            {/* Big stat highlights */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { val: "3×", label: "Higher repeat purchase rate vs generic marketplaces" },
                { val: "₹0", label: "Listing fees — ever. We only earn when you do." },
              ].map(({ val, label }) => (
                <motion.div
                  key={val}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="dark-card p-5"
                  style={{ border: "1px solid rgba(82,183,136,0.15)" }}
                >
                  <p className="text-3xl font-black mb-2" style={{ color: "#e8c97a" }}>{val}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{label}</p>
                </motion.div>
              ))}
            </div>

            {/* Counter row */}
            <div className="grid grid-cols-2 gap-3">
              {BIG_STATS.map(({ value, suffix, label, sub }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="py-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <p className="text-2xl font-black text-white">
                    <AnimatedNumber end={value} suffix={suffix} active={inView} />
                  </p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{sub}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Floating order card */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 3 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 lg:items-end"
          >
            <OrderCard />

            {/* Eco impact badge */}
            <div
              className="eco-card px-5 py-3 flex items-center gap-3 max-w-xs w-full"
            >
              <span className="text-2xl">🌱</span>
              <div>
                <p className="text-xs font-bold text-white">2,500+ Trees Planted</p>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>Through our Green Seller program</p>
              </div>
            </div>

            {/* Progress bars */}
            <div className="w-full max-w-xs space-y-3">
              {[
                { label: "Customer Satisfaction", value: 97, color: "#52b788" },
                { label: "On-Time Delivery",       value: 94, color: "#c9a84c" },
                { label: "Eco Certification Rate", value: 88, color: "#74c69d" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span style={{ color: "rgba(255,255,255,0.6)" }}>{label}</span>
                    <span style={{ color }}>{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
