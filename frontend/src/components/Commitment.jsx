"use client";

import React from "react";
import { motion } from "framer-motion";

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width={26} height={26}>
        <circle cx={20} cy={20} r={18} fill="#d1fae5" />
        <path d="M14 20l4 4 8-8" stroke="#2d6a4f" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M28 10a10 10 0 11-14 14" stroke="#2d6a4f" strokeWidth={1.5} strokeLinecap="round"/>
        <path d="M26 9l2 2-2 2" stroke="#2d6a4f" strokeWidth={1.5} strokeLinecap="round"/>
      </svg>
    ),
    title: "100% Recycled Materials",
    desc: "Every bag starts life as post-consumer recycled paper — conserving forests and diverting waste from landfill.",
    value: "100%",
    valueLabel: "Recycled",
    color: "#d1fae5",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width={26} height={26}>
        <circle cx={20} cy={20} r={18} fill="#dcfce7" />
        <path d="M20 30V18" stroke="#2d6a4f" strokeWidth={2} strokeLinecap="round"/>
        <path d="M20 18c0-5 4-8 7-9-1 4-3 7-7 9z" fill="#2d6a4f"/>
        <path d="M20 18c0-4-3-7-6-8 1 3 3 6 6 8z" fill="#52a878"/>
        <path d="M14 28h12" stroke="#2d6a4f" strokeWidth={2} strokeLinecap="round"/>
      </svg>
    ),
    title: "Fully Biodegradable",
    desc: "Breaks down naturally within 2–6 months in composting conditions, leaving zero harmful residue.",
    value: "0",
    valueLabel: "Landfill waste",
    color: "#dcfce7",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width={26} height={26}>
        <circle cx={20} cy={20} r={18} fill="#e0f2fe" />
        <path d="M20 12c0 0-6 5-6 10a6 6 0 0012 0c0-5-6-10-6-10z" fill="#0ea5e9" opacity=".3"/>
        <path d="M20 14c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z" stroke="#0369a1" strokeWidth={1.5} fill="none"/>
        <circle cx={20} cy={22} r={1.5} fill="#0369a1"/>
      </svg>
    ),
    title: "Water-Based Inks",
    desc: "Non-toxic, VOC-free inks — vibrant prints that are safe for your family and the environment.",
    value: "0%",
    valueLabel: "Toxins",
    color: "#e0f2fe",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" width={26} height={26}>
        <circle cx={20} cy={20} r={18} fill="#fef9c3" />
        <path d="M20 30V20" stroke="#854d0e" strokeWidth={2} strokeLinecap="round"/>
        <path d="M20 20c-3-4-8-5-10-4 2 4 6 6 10 4z" fill="#a3e635"/>
        <path d="M20 20c3-3 8-4 9-3-2 3-5 5-9 3z" fill="#84cc16"/>
        <path d="M16 28h8" stroke="#854d0e" strokeWidth={2} strokeLinecap="round"/>
      </svg>
    ),
    title: "Carbon Neutral",
    desc: "One tree planted for every 100 bags produced. 500+ trees planted to date, offsetting our full footprint.",
    value: "500+",
    valueLabel: "Trees planted",
    color: "#fef9c3",
  },
];

const stats = [
  { num: "10K+", label: "Bags produced" },
  { num: "500+", label: "Trees planted" },
  { num: "2T",   label: "Plastic replaced" },
  { num: "100%", label: "Eco-certified" },
];

// Inline eco product illustration — a row of paper bags & nature elements
function EcoIllustration() {
  return (
    <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%" }}>
      {/* Background */}
      <rect width={480} height={360} rx={24} fill="url(#bgGrad)"/>
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="480" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d1fae5"/>
          <stop offset="1" stopColor="#bbf7d0"/>
        </linearGradient>
        <linearGradient id="bagA" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#fef9c3"/>
          <stop offset="1" stopColor="#fde68a"/>
        </linearGradient>
        <linearGradient id="bagB" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#e8f5e9"/>
          <stop offset="1" stopColor="#c8e6c9"/>
        </linearGradient>
        <linearGradient id="bagC" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#fff"/>
          <stop offset="1" stopColor="#f0f0f0"/>
        </linearGradient>
      </defs>

      {/* Ground strip */}
      <rect x={0} y={280} width={480} height={80} rx={0} fill="#a7f3d0" opacity=".4"/>

      {/* Tree left */}
      <rect x={42} y={210} width={12} height={70} rx={4} fill="#92400e"/>
      <ellipse cx={48} cy={195} rx={30} ry={28} fill="#22c55e"/>
      <ellipse cx={38} cy={205} rx={20} ry={18} fill="#16a34a"/>
      <ellipse cx={60} cy={208} rx={18} ry={16} fill="#15803d"/>

      {/* Tree right */}
      <rect x={420} y={215} width={12} height={65} rx={4} fill="#92400e"/>
      <ellipse cx={426} cy={200} rx={28} ry={26} fill="#22c55e"/>
      <ellipse cx={416} cy={208} rx={18} ry={16} fill="#16a34a"/>

      {/* Small shrubs */}
      <ellipse cx={100} cy={278} rx={18} ry={12} fill="#4ade80" opacity=".7"/>
      <ellipse cx={380} cy={278} rx={16} ry={10} fill="#4ade80" opacity=".7"/>

      {/* ── Paper Bag 1 (kraft tall) ── */}
      <g transform="translate(130,120)">
        {/* body */}
        <rect x={0} y={20} width={70} height={140} rx={4} fill="#d97706"/>
        <rect x={0} y={20} width={70} height={140} rx={4} fill="url(#bagA)"/>
        {/* fold top */}
        <rect x={0} y={20} width={70} height={16} rx={4} fill="#fcd34d"/>
        <rect x={3} y={18} width={64} height={10} rx={2} fill="#fde68a"/>
        {/* handles */}
        <path d="M18 28 Q18 8 28 8 Q38 8 38 28" stroke="#a16207" strokeWidth={3} fill="none" strokeLinecap="round"/>
        <path d="M32 28 Q32 8 42 8 Q52 8 52 28" stroke="#a16207" strokeWidth={3} fill="none" strokeLinecap="round"/>
        {/* leaf print */}
        <path d="M28 75 Q35 60 42 75 Q35 90 28 75z" fill="#16a34a" opacity=".5"/>
        <path d="M35 75 V90" stroke="#16a34a" strokeWidth={1.5} opacity=".5"/>
        {/* eco badge */}
        <rect x={14} y={100} width={42} height={18} rx={9} fill="#16a34a" opacity=".9"/>
        <text x={35} y={113} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700">ECO</text>
      </g>

      {/* ── Paper Bag 2 (boutique black/white) ── */}
      <g transform="translate(215,140)">
        <rect x={0} y={16} width={60} height={120} rx={4} fill="#1a3a2a"/>
        <rect x={2} y={16} width={56} height={10} rx={2} fill="#2d6a4f"/>
        {/* ribbon */}
        <rect x={20} y={60} width={20} height={3} rx={1.5} fill="#c9a84c"/>
        <path d="M30 50 L23 65 M30 50 L37 65" stroke="#c9a84c" strokeWidth={1.5} fill="none"/>
        {/* handles */}
        <path d="M15 24 Q15 6 24 6 Q33 6 33 24" stroke="#c9a84c" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M27 24 Q27 6 36 6 Q45 6 45 24" stroke="#c9a84c" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        {/* branding line */}
        <rect x={10} y={90} width={40} height={2} rx={1} fill="#c9a84c" opacity=".5"/>
        <text x={30} y={108} textAnchor="middle" fill="#c9a84c" fontSize="8" fontWeight="600">PAPERBAG</text>
      </g>

      {/* ── Paper Bag 3 (gift/white) ── */}
      <g transform="translate(290,130)">
        <rect x={0} y={18} width={66} height={130} rx={4} fill="#fff"/>
        <rect x={0} y={18} width={66} height={130} rx={4} fill="url(#bagC)"/>
        <rect x={0} y={18} width={66} height={14} rx={4} fill="#e5e7eb"/>
        {/* polka dots */}
        {[{x:14,y:60},{x:30,y:55},{x:46,y:62},{x:22,y:78},{x:40,y:80}].map((d,i)=>(
          <circle key={i} cx={d.x} cy={d.y} r={4} fill="#d1fae5"/>
        ))}
        {/* twisted handles */}
        <path d="M16 26 Q16 8 26 8 Q36 8 36 26" stroke="#6b7280" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        <path d="M30 26 Q30 8 40 8 Q50 8 50 26" stroke="#6b7280" strokeWidth={2.5} fill="none" strokeLinecap="round"/>
        {/* sticker */}
        <circle cx={33} cy={108} r={18} fill="#fef9c3" stroke="#fcd34d" strokeWidth={1.5}/>
        <text x={33} y={105} textAnchor="middle" fill="#92400e" fontSize="8" fontWeight="700">100%</text>
        <text x={33} y={115} textAnchor="middle" fill="#92400e" fontSize="7">ECO</text>
      </g>

      {/* Recycling symbol floating */}
      <g transform="translate(90,165) rotate(-15)">
        <circle cx={18} cy={18} r={18} fill="#a7f3d0" opacity=".8"/>
        <path d="M18 8 L14 15 L22 15 Z" fill="#16a34a"/>
        <path d="M10 22 L14 15 L8 18 Z" fill="#16a34a"/>
        <path d="M26 22 L22 15 L28 18 Z" fill="#16a34a"/>
        <path d="M14 22 Q14 26 18 26 Q22 26 22 22" stroke="#16a34a" strokeWidth={2} fill="none"/>
      </g>

      {/* Stars / sparkles */}
      <g opacity=".6">
        <circle cx={90}  cy={80}  r={3} fill="#fcd34d"/>
        <circle cx={400} cy={90}  r={2} fill="#fcd34d"/>
        <circle cx={440} cy={160} r={3} fill="#86efac"/>
        <circle cx={75}  cy={160} r={2} fill="#86efac"/>
        <circle cx={240} cy={95}  r={2} fill="#fcd34d"/>
        <circle cx={370} cy={115} r={3} fill="#fcd34d"/>
      </g>

      {/* Leaf accent */}
      <g transform="translate(400,140) rotate(20)">
        <path d="M10 0 Q20 10 10 22 Q0 10 10 0z" fill="#4ade80" opacity=".6"/>
        <line x1={10} y1={2} x2={10} y2={20} stroke="#16a34a" strokeWidth={1} opacity=".6"/>
      </g>
      <g transform="translate(65,240) rotate(-10)">
        <path d="M8 0 Q16 8 8 18 Q0 8 8 0z" fill="#4ade80" opacity=".5"/>
        <line x1={8} y1={1} x2={8} y2={17} stroke="#16a34a" strokeWidth={1} opacity=".5"/>
      </g>

      {/* Cloud / CO2 badge */}
      <g transform="translate(370,50)">
        <rect x={0} y={4} width={70} height={26} rx={13} fill="#fff" opacity=".9"/>
        <text x={35} y={21} textAnchor="middle" fill="#1a3a2a" fontSize="10" fontWeight="700">🌿 Net Zero</text>
      </g>
    </svg>
  );
}

export default function Commitment() {
  return (
    <section className="section-pad" style={{ background: "var(--cream)" }}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "var(--green-100)", color: "var(--green-800)" }}>
            Our Promise
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4" style={{ color: "var(--green-900)" }}>
            Our Commitment to Sustainability
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "#6b7280" }}>
            Every decision is guided by environmental responsibility. Here's how we make a real difference.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.1 }}
        >
          {stats.map(({ num, label }) => (
            <div key={label} className="text-center p-5 rounded-2xl"
              style={{ background: "#fff", border: "1.5px solid var(--green-100)" }}>
              <div className="text-3xl font-black mb-1" style={{ color: "var(--green-700)" }}>{num}</div>
              <div className="text-sm" style={{ color: "#6b7280" }}>{label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Eco Product Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: "4/3", position: "relative" }}>
              <EcoIllustration />
            </div>
          </motion.div>

          {/* Pillar cards */}
          <motion.div
            className="flex flex-col gap-4"
            initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          >
            {pillars.map(({ icon, title, desc, value, valueLabel, color }, i) => (
              <motion.div key={i}
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
              >
                <div className="card p-5 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: color }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base mb-1" style={{ color: "var(--green-900)" }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#6b7280" }}>{desc}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="font-black text-sm" style={{ color: "var(--green-700)" }}>{value}</div>
                    <div className="text-xs" style={{ color: "#9ca3af" }}>{valueLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
