"use client";

import React from "react";
import { motion } from "framer-motion";

const features = [
  { icon: "🌱", title: "100% Biodegradable",   desc: "Every bag breaks down naturally — no plastic, no microplastics, no guilt.",       color: "#40916c" },
  { icon: "✋", title: "Handcrafted Quality",   desc: "Skilled artisans craft each bag with care, ensuring unique character and strength.", color: "#c9a84c" },
  { icon: "♻️", title: "Recycled Materials",   desc: "We source only responsibly recycled paper and soy-based inks for every order.",    color: "#52b788" },
  { icon: "🎨", title: "Custom Designs",        desc: "Your brand, your colors, your size. Full customisation for any occasion.",          color: "#e8c97a" },
  { icon: "🚚", title: "Pan-India Delivery",    desc: "Fast, reliable shipping to every corner of India. Track your order in real-time.", color: "#74c69d" },
  { icon: "⭐", title: "Satisfaction Guarantee",desc: "Not happy? We'll make it right — every single time, no questions asked.",         color: "#c9a84c" },
];

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const cardVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyChooseUs() {
  return (
    <section className="section-pad" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--green-100)", color: "var(--green-800)" }}>
            Why Paperbag?
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--green-900)" }}>
            Crafted With Purpose
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6b7280" }}>
            We combine traditional artisanship with modern sustainability — because beautiful packaging
            shouldn't cost the planet.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {features.map(({ icon, title, desc, color }, i) => (
            <motion.div key={i} variants={cardVariants}>
              <div className="card p-8 h-full flex flex-col gap-4 group cursor-default">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: `${color}18` }}>
                  {icon}
                </div>
                <h3 className="text-xl font-bold" style={{ color: "var(--green-900)" }}>{title}</h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#6b7280" }}>{desc}</p>
                <div className="w-10 h-1 rounded-full transition-all duration-300 group-hover:w-16"
                  style={{ background: color }} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
