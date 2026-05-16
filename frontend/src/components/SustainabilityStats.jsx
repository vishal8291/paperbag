"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const STATS = [
  { icon: "🌳", end: 2500,  suffix: "+",   label: "Trees Planted",       desc: "Every order funds reforestation" },
  { icon: "🌍", end: 15,    suffix: " T",  label: "CO₂ Offset",          desc: "Tonnes of carbon saved yearly" },
  { icon: "♻️", end: 95,   suffix: "%",   label: "Waste Reduction",     desc: "Compared to plastic bags" },
  { icon: "😊", end: 5000,  suffix: "+",   label: "Happy Customers",     desc: "Across India" },
];

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

  return (
    <span>{count.toLocaleString()}{suffix}</span>
  );
}

export default function SustainabilityStats() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-pad" style={{ background: "var(--green-900)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(116,198,157,0.15)", color: "var(--green-400)" }}>
            Our Impact
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Every Bag Makes a Difference
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
            Our commitment to the planet goes beyond just materials — it's in every decision we make.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map(({ icon, end, suffix, label, desc }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="rounded-2xl p-6 text-center flex flex-col items-center gap-3 group transition-transform hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span className="text-4xl">{icon}</span>
                <div className="text-3xl md:text-4xl font-black" style={{ color: "var(--gold-light)" }}>
                  <AnimatedNumber end={end} suffix={suffix} active={inView} />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress bars */}
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {[
            { label: "Customer Satisfaction", value: 97 },
            { label: "On-Time Delivery",       value: 94 },
            { label: "Repeat Customers",       value: 78 },
          ].map(({ label, value }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-white">{label}</span>
                <span style={{ color: "var(--gold-light)" }}>{value}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--green-600), var(--gold))" }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
