"use client";

import React from "react";
import { motion } from "framer-motion";

const badges = [
  { icon: "🔒", title: "100% Secure Payments", desc: "SSL + Razorpay encrypted",    color: "#d1fae5" },
  { icon: "♻️", title: "Eco Certified",         desc: "GreenGuard & FSC certified",  color: "#d1fae5" },
  { icon: "🚚", title: "Free Shipping",          desc: "On orders above ₹999",        color: "#fef3c7" },
  { icon: "↩️", title: "Easy Returns",           desc: "7-day hassle-free policy",    color: "#fce7f3" },
  { icon: "🌱", title: "Carbon Neutral",         desc: "1 tree per 100 bags",         color: "#d1fae5" },
  { icon: "🏆", title: "10,000+ Customers",      desc: "Trusted across India",        color: "#ede9fe" },
];

export default function TrustBadges() {
  return (
    <section
      className="py-10 border-t border-b"
      style={{ background: "white", borderColor: "var(--cream-dark)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {badges.map(({ icon, title, desc, color }, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } }}
              className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl"
              style={{ background: color }}
            >
              <span className="text-3xl">{icon}</span>
              <div>
                <p className="font-black text-xs leading-snug" style={{ color: "var(--green-900)" }}>{title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
