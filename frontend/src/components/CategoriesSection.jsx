"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const categories = [
  { icon: "🎁", label: "Gift Bags",       desc: "Elegant wrapping",     color: "#fef3c7", border: "#fde68a", href: "/products?cat=gift" },
  { icon: "🛍️", label: "Shopping Bags",   desc: "Retail & boutique",    color: "#d1fae5", border: "#6ee7b7", href: "/products?cat=shopping" },
  { icon: "🎀", label: "Wedding Bags",     desc: "Celebrations & favors",color: "#fce7f3", border: "#f9a8d4", href: "/products?cat=wedding" },
  { icon: "📦", label: "Kraft Bags",       desc: "Heavy-duty carry",     color: "#fef3c7", border: "#fcd34d", href: "/products?cat=kraft" },
  { icon: "🏷️", label: "Custom Printed",  desc: "Brand your bags",      color: "#ede9fe", border: "#c4b5fd", href: "/products?cat=custom" },
  { icon: "🎄", label: "Festival Bags",    desc: "Seasonal specials",    color: "#d1fae5", border: "#34d399", href: "/products?cat=festival" },
  { icon: "🍱", label: "Food Bags",        desc: "Takeaway & delivery",  color: "#fef3c7", border: "#fbbf24", href: "/products?cat=food" },
  { icon: "✂️", label: "DIY Kits",        desc: "Make your own",        color: "#e0e7ff", border: "#a5b4fc", href: "/products?cat=diy" },
];

export default function CategoriesSection() {
  return (
    <section className="section-pad" style={{ background: "var(--cream-dark)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--green-100)", color: "var(--green-800)" }}
          >
            Shop by Type
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: "var(--green-900)" }}
          >
            Browse Categories
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            Find the perfect paper bag for every occasion.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {categories.map(({ icon, label, desc, color, border, href }, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } } }}
            >
              <Link href={href}>
                <div
                  className="group flex flex-col items-center text-center p-5 rounded-2xl cursor-pointer transition-all duration-200"
                  style={{
                    background: color,
                    border: `1.5px solid ${border}`,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                >
                  <span className="text-4xl mb-3">{icon}</span>
                  <p className="font-black text-sm" style={{ color: "var(--green-900)" }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
