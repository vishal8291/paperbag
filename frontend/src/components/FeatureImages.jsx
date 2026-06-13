"use client";

import React from "react";
import { motion } from "framer-motion";

const IMAGES = [
  {
    src: "/bagmade.jpg",
    alt: "Handcrafted eco bags",
    tag: "Handcrafted",
    title: "Made by artisans,\nnot machines",
    desc: "Every bag is crafted by skilled artisans using sustainable materials sourced locally.",
    accent: "#52b788",
  },
  {
    src: "/commitment.jpg",
    alt: "Eco commitment",
    tag: "Sustainable",
    title: "Zero waste,\nmaximum impact",
    desc: "Our packaging is 100% biodegradable. When you shop with us, the planet wins too.",
    accent: "#c9a84c",
  },
  {
    src: "/bagmaking.png",
    alt: "Bag making process",
    tag: "Behind the craft",
    title: "From workshop\nto your door",
    desc: "Watch your bag come to life — from raw jute to finished product, shipped in 3 days.",
    accent: "#74c69d",
  },
];

export default function FeatureImages() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: "var(--bg-0)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 50%, rgba(82,183,136,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(82,183,136,0.1)",
              color: "#74c69d",
              border: "1px solid rgba(82,183,136,0.2)",
            }}
          >
            Why Paperbag
          </span>
          <h2
            className="text-white font-black mb-4"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1,
              letterSpacing: "-0.035em",
            }}
          >
            Crafted with{" "}
            <span className="text-gradient">purpose.</span>
            <br />
            Delivered with care.
          </h2>
        </motion.div>

        {/* 3-image grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {IMAGES.map(({ src, alt, tag, title, desc, accent }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-3xl overflow-hidden group"
              style={{
                height: "480px",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              {/* Image */}
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-cover"
                style={{
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onError={e => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback */}
              <div
                className="absolute inset-0 items-center justify-center text-6xl"
                style={{
                  display: "none",
                  background: `linear-gradient(135deg, ${accent}15, rgba(8,8,8,0.8))`,
                }}
              >
                🛍️
              </div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.3) 50%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 w-fit"
                  style={{
                    background: `${accent}20`,
                    color: accent,
                    border: `1px solid ${accent}35`,
                  }}
                >
                  {tag}
                </span>
                <h3
                  className="font-black text-white mb-2 whitespace-pre-line"
                  style={{ fontSize: "1.35rem", lineHeight: 1.15, letterSpacing: "-0.02em" }}
                >
                  {title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {desc}
                </p>

                {/* Accent line */}
                <div
                  className="mt-4 h-0.5 w-12 rounded-full"
                  style={{ background: accent }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
