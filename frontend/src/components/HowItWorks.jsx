"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    icon: "🛍️",
    title: "Browse & Select",
    desc: "Explore our curated range of eco-friendly paper bags. Filter by size, type, and purpose.",
    color: "#2d6a4f",
  },
  {
    step: "02",
    icon: "✏️",
    title: "Customize Your Order",
    desc: "Choose quantity, add your branding details, pick printing options — we handle the rest.",
    color: "#c9a84c",
  },
  {
    step: "03",
    icon: "🏭",
    title: "We Craft with Care",
    desc: "Your bags are handcrafted using 100% recycled materials in our eco-certified facility.",
    color: "#2d6a4f",
  },
  {
    step: "04",
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Packaged sustainably and shipped to your doorstep within 3–7 business days.",
    color: "#c9a84c",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-pad" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--green-100)", color: "var(--green-800)" }}
          >
            Simple Process
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mb-4"
            style={{ color: "var(--green-900)" }}
          >
            How It Works
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#6b7280" }}>
            From browsing to doorstep — your eco-friendly order in four easy steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="hidden md:block absolute top-10 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, var(--green-200), var(--green-300), var(--green-200))", top: 44 }}
          />

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {steps.map(({ step, icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                className="flex flex-col items-center text-center"
              >
                {/* Number badge */}
                <div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-5 shadow-lg"
                  style={{ background: "white", border: `3px solid ${color}`, zIndex: 1 }}
                >
                  <span>{icon}</span>
                  <span
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: color, fontSize: 10 }}
                  >
                    {step}
                  </span>
                </div>
                <h3 className="font-black text-lg mb-2" style={{ color: "var(--green-900)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="/products">
            <button className="btn-primary text-lg px-10">
              Start Your Order →
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
