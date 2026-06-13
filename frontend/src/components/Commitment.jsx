"use client";

// Inspired by Shopify image 7 — "Meet your secret weapon, Sidekick"
// Leaf AI seller assistant showcase

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useStore } from "../context/StoreContext";

const CHAT_DEMO = [
  { role: "user",  text: "Show me my top 5 products this week" },
  { role: "ai",    text: "Here are your top sellers 🌿\n1. Kraft Tote (₹12,400)\n2. Gift Box Set (₹8,200)\n3. Cotton Handle Bag (₹6,100)" },
  { role: "user",  text: "Create a discount for my tote bags" },
  { role: "ai",    text: "Done! Created 'TOTE15' — 15% off all tote bags. Active for 7 days. Share it with your buyers!" },
];

const WIN_STORIES = [
  {
    name: "Priya's Eco Store",
    avatar: "P",
    color: "#52b788",
    quote: "Leaf AI told me to restock my kraft bags before Diwali. Made ₹40,000 in a week!",
    revenue: "₹40K",
    tag: "Peak Season Win",
  },
  {
    name: "Green Gifting Co.",
    avatar: "G",
    color: "#c9a84c",
    quote: "The analytics dashboard helped me identify my best-selling category. Sales up 3x in 2 months.",
    revenue: "3× Sales",
    tag: "Analytics Win",
  },
];

export default function Commitment() {
  const { slug } = useStore();
  const [chatStep, setChatStep] = useState(0);

  const handleNext = () => setChatStep(s => Math.min(s + 1, CHAT_DEMO.length - 1));

  return (
    <section
      className="section-xl relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #08090e 0%, #0c0d1a 40%, #080e09 100%)",
      }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(99,102,241,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 80% 50%, rgba(82,183,136,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6"
            style={{ background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.2)" }}
          >
            AI-Powered
          </span>
          <h2 className="display-lg mb-4">
            Meet <span style={{ color: "#a5b4fc" }}>Leaf AI</span> —<br />
            your seller sidekick
          </h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            Your very own commerce AI. Automate tasks, get smart insights, and let Leaf handle buyer queries — built into your seller dashboard.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Chat demo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: "#0d0f0e",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* Chat header */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(99,102,241,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ background: "linear-gradient(135deg, #6366f1, #52b788)" }}
                >
                  🌿
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Leaf AI</p>
                  <p className="text-[9px]" style={{ color: "#52b788" }}>● Online — always ready</p>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 min-h-[260px]">
                <AnimatePresence>
                  {CHAT_DEMO.slice(0, chatStep + 1).map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35 }}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "ai" && (
                        <div
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] mr-2 shrink-0 mt-0.5"
                          style={{ background: "linear-gradient(135deg, #6366f1, #52b788)" }}
                        >
                          🌿
                        </div>
                      )}
                      <div
                        className={`max-w-[78%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                          msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {chatStep < CHAT_DEMO.length - 1 && (
                  <div className="flex items-center gap-1.5 pl-8">
                    {[0, 0.2, 0.4].map((d, i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: d }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.3)" }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Input */}
              <div
                className="px-4 py-3 flex items-center gap-3"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="flex-1 px-3 py-2 rounded-xl text-[11px] cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.35)" }}
                  onClick={handleNext}
                >
                  {chatStep < CHAT_DEMO.length - 1
                    ? CHAT_DEMO[chatStep + 1]?.role === "user"
                      ? CHAT_DEMO[chatStep + 1].text
                      : "Ask Leaf AI anything..."
                    : "Ask Leaf AI anything..."}
                </div>
                <button
                  onClick={handleNext}
                  disabled={chatStep >= CHAT_DEMO.length - 1}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, #6366f1, #52b788)" }}
                >
                  ↑
                </button>
              </div>
            </div>
            <p className="text-xs text-center mt-3" style={{ color: "rgba(255,255,255,0.25)" }}>
              Click the input to play the demo
            </p>
          </motion.div>

          {/* Right: Stories + features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-5"
          >
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
              What winning looks like
            </p>
            {WIN_STORIES.map(({ name, avatar, color, quote, revenue, tag }) => (
              <div
                key={name}
                className="dark-card p-5"
                style={{ border: `1px solid ${color}20` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}80)` }}
                  >
                    {avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-white">{name}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                      {tag}
                    </span>
                  </div>
                  <p className="text-lg font-black" style={{ color }}>{revenue}</p>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>"{quote}"</p>
              </div>
            ))}

            <div className="space-y-3 pt-2">
              {[
                { icon: "📊", text: "Real-time sales insights & revenue forecasting" },
                { icon: "💬", text: "Answers buyer questions 24/7 automatically" },
                { icon: "🎯", text: "Smart restock alerts before you run out" },
                { icon: "📝", text: "Auto-generates product descriptions" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                  <span className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(99,102,241,0.1)" }}>
                    {icon}
                  </span>
                  {text}
                </div>
              ))}
            </div>

            <Link href="/seller/register">
              <button className="btn-white text-sm font-bold w-full mt-3">
                Get Leaf AI with your seller account →
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
