"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { contactApi } from "../lib/api";

const FALLBACK = [
  { name: "Priya Sharma",  role: "Boutique Owner",      rating: 5, review: "Absolutely stunning bags! My customers love the eco-friendly packaging. Orders come fast and quality is top-notch." },
  { name: "Rahul Mehta",   role: "Event Planner",        rating: 5, review: "Used Paperbag for a 500-person wedding. Every bag was perfect. Will definitely order again for all future events." },
  { name: "Sneha Patel",   role: "Retail Store Manager", rating: 5, review: "Switched from plastic bags 6 months ago. Best decision ever. Customers appreciate it and so does the planet!" },
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    contactApi.getTestimonials()
      .then(data => setTestimonials(data.length ? data : FALLBACK))
      .catch(() => setTestimonials(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const list = testimonials.length ? testimonials : FALLBACK;
  const avg  = list.length
    ? (list.reduce((a, t) => a + (t.rating || 5), 0) / list.length).toFixed(1)
    : "5.0";

  return (
    <section className="section-pad" style={{ background: "var(--cream-dark)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--green-100)", color: "var(--green-800)" }}>
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--green-900)" }}>
            Loved by Thousands
          </h2>
          <div className="flex items-center justify-center gap-2 text-lg">
            <span className="text-yellow-400 text-2xl">★</span>
            <span className="font-black" style={{ color: "var(--green-900)" }}>{avg}</span>
            <span style={{ color: "#6b7280" }}>out of 5 — from {list.length}+ reviews</span>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(n => <div key={n} className="skeleton h-48 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {list.map((t, i) => (
              <motion.div key={t._id || i}
                variants={{ hidden: { opacity:0, y:24 }, visible: { opacity:1, y:0, transition:{ duration:0.5 } } }}>
                <div className="card p-6 h-full flex flex-col gap-4">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating || 5 }).map((_, j) => (
                      <span key={j} className="text-yellow-400 text-lg">★</span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed italic" style={{ color: "#4b5563" }}>
                    "{t.review}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: "var(--cream-dark)" }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                      style={{ background: `hsl(${(i * 60) + 140}, 50%, 45%)` }}>
                      {t.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>{t.name}</p>
                      <p className="text-xs" style={{ color: "#6b7280" }}>{t.role || "Customer"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
