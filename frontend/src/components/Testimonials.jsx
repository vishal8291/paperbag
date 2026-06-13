"use client";

// Shopify image 6 style — "For anyone from entrepreneurs to enterprise"
// Success story cards with seller photos and stories

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const STORIES = [
  {
    name: "Priya Sharma",
    store: "Priya's Eco Store",
    city: "Mumbai",
    avatar: "P",
    color: "#52b788",
    revenue: "₹2.4L / month",
    tag: "Top Seller",
    quote: "I started with 3 products and zero experience. Paperbag's seller tools and Leaf AI helped me scale to 28 products and consistent monthly revenue. Best decision I made.",
    products: 28,
    orders: 450,
    since: "Jan 2024",
  },
  {
    name: "Arjun Nair",
    store: "Green Gifting Co.",
    city: "Bangalore",
    avatar: "A",
    color: "#c9a84c",
    revenue: "₹80K / month",
    tag: "Rising Star",
    quote: "The zero listing fee model is game-changing. I listed 15 gift products on day one and got my first order within 48 hours. The platform just works.",
    products: 15,
    orders: 180,
    since: "Mar 2024",
  },
  {
    name: "Kavitha Reddy",
    store: "KraftKraft",
    city: "Chennai",
    avatar: "K",
    color: "#74c69d",
    revenue: "₹45K / month",
    tag: "Craft Maker",
    quote: "As a small craft maker, I never thought I could compete. But Paperbag's eco community connects me with buyers who actually care about handmade products.",
    products: 9,
    orders: 95,
    since: "Feb 2024",
  },
];

export default function Testimonials() {
  return (
    <section
      className="section-xl relative overflow-hidden"
      style={{ background: "var(--bg-1)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(82,183,136,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}
          >
            Seller Stories
          </span>
          <h2 className="display-lg mb-4">
            For anyone from<br />
            <span style={{ color: "rgba(255,255,255,0.35)" }}>
              first-time sellers to
            </span>{" "}
            <span className="text-gradient">thriving businesses</span>
          </h2>
          <p className="text-base max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Real sellers, real revenue, real impact on the planet.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {STORIES.map(({ name, store, city, avatar, color, revenue, tag, quote, products, orders, since }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="dark-card p-6 flex flex-col gap-4"
            >
              {/* Visual header */}
              <div
                className="w-full h-32 rounded-xl flex items-center justify-center text-5xl relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${color}20, ${color}08)`,
                  border: `1px solid ${color}20`,
                }}
              >
                <span className="text-5xl">{["🛍️", "🎁", "✋"][i]}</span>
                <div
                  className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[9px] font-bold"
                  style={{ background: `${color}20`, color }}
                >
                  {tag}
                </div>
              </div>

              {/* Seller info */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                  style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
                >
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{name}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{store} · {city}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-xs leading-relaxed flex-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                "{quote}"
              </p>

              {/* Stats */}
              <div
                className="grid grid-cols-3 gap-2 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                {[
                  { val: revenue,         label: "Revenue" },
                  { val: `${products}`,   label: "Products" },
                  { val: `${orders}+`,    label: "Orders" },
                ].map(({ val, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xs font-black" style={{ color }}>{val}</p>
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                Seller since {since}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/seller/register">
            <button className="btn-eco text-sm font-bold">
              Pick a plan that fits →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
