"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "../context/StoreContext";

const WORDS = ["Shopping", "Gifting", "Branding", "Events", "Packaging"];

// Floating product card data
const FLOATING_CARDS = [
  {
    id: 1,
    name: "Luxury Kraft Tote",
    price: "₹299",
    tag: "Best Seller",
    tagColor: "#52b788",
    emoji: "🛍️",
    delay: "0s",
    cls: "animate-card-1",
    style: { top: "8%", right: "2%", width: "200px" },
  },
  {
    id: 2,
    name: "Eco Gift Box Set",
    price: "₹549",
    tag: "New",
    tagColor: "#c9a84c",
    emoji: "🎁",
    delay: "1.2s",
    cls: "animate-card-2",
    style: { top: "42%", right: "-2%", width: "190px" },
  },
  {
    id: 3,
    name: "Cotton Handle Bag",
    price: "₹189",
    tag: "Eco Pick",
    tagColor: "#74c69d",
    emoji: "♻️",
    delay: "2.4s",
    cls: "animate-card-3",
    style: { bottom: "14%", right: "8%", width: "180px" },
  },
];

// Order notification card
const ORDER_NOTIF = {
  name: "Priya from Mumbai",
  action: "just placed an order",
  time: "2 min ago",
};

export default function HeroSection() {
  const { store, slug } = useStore();
  const [wordIdx, setWordIdx] = useState(0);
  const [notifVisible, setNotifVisible] = useState(false);

  const isPaperbag = !slug || slug === "paperbag";

  useEffect(() => {
    const t = setInterval(() => setWordIdx(i => (i + 1) % WORDS.length), 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setNotifVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  const storeName = store?.name || "Paperbag";
  const storeDesc = store?.description
    || "India's marketplace for handcrafted eco-friendly bags. Buy from hundreds of sellers — or sell your own creations with zero listing fees.";

  return (
    <section
      className="relative min-h-[96vh] flex flex-col justify-center overflow-hidden noise"
      style={{ background: "var(--bg-eco)", paddingTop: "72px" }}
    >
      {/* ── Background ambient glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large green radial glow bottom-left */}
        <div
          className="absolute"
          style={{
            bottom: "-10%", left: "-5%",
            width: "55vw", height: "55vw",
            background: "radial-gradient(circle, rgba(82,183,136,0.10) 0%, transparent 65%)",
          }}
        />
        {/* Gold glow top-right */}
        <div
          className="absolute"
          style={{
            top: "5%", right: "10%",
            width: "35vw", height: "35vw",
            background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 65%)",
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8 w-fit"
              style={{
                background: "rgba(82,183,136,0.1)",
                border: "1px solid rgba(82,183,136,0.25)",
                color: "#74c69d",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping-slow inline-block" />
              🌿 500+ Eco Sellers Live
            </motion.div>

            {/* Heading */}
            <h1 className="display-xl mb-6 select-none" style={{ lineHeight: 0.92 }}>
              {isPaperbag ? (
                <>
                  Be the store<br />
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>they shop from for</span>
                  <br />
                  <span className="relative inline-block overflow-hidden" style={{ height: "1.1em", verticalAlign: "bottom" }}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={wordIdx}
                        initial={{ y: "100%", opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: "-100%", opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                        className="inline-block text-gradient"
                      >
                        {WORDS[wordIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </>
              ) : (
                storeName
              )}
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: "rgba(255,255,255,0.58)" }}
            >
              {storeDesc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 items-center mb-14">
              <Link href={isPaperbag ? "/products" : `/store/${slug}/products`}>
                <button className="btn-white text-sm font-bold">
                  Shop Now →
                </button>
              </Link>
              <Link href={isPaperbag ? "/seller/register" : `/store/${slug}/contact`}>
                <button className="btn-outline-white text-sm">
                  {isPaperbag ? "🚀 Start Selling" : "Contact Us"}
                </button>
              </Link>
            </div>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: "🌱", text: "100% Biodegradable" },
                { icon: "✋", text: "Handcrafted" },
                { icon: "🚚", text: "Pan-India Delivery" },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-xs font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  <span className="text-sm">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating product cards (desktop only) */}
          <div className="relative hidden lg:block h-[560px]">
            {FLOATING_CARDS.map((card) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.85, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.4 + card.id * 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className={`absolute dark-card p-4 ${card.cls}`}
                style={{ ...card.style, animationDelay: card.delay }}
              >
                {/* Product emoji visual */}
                <div
                  className="w-full h-24 rounded-xl mb-3 flex items-center justify-center text-4xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}
                >
                  {card.emoji}
                </div>
                {/* Tag */}
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 inline-block"
                  style={{ background: `${card.tagColor}20`, color: card.tagColor }}
                >
                  {card.tag}
                </span>
                <p className="text-xs font-semibold text-white truncate">{card.name}</p>
                <p className="text-sm font-black mt-0.5" style={{ color: "#e8c97a" }}>{card.price}</p>
                {/* Stars */}
                <div className="flex gap-0.5 mt-1.5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[10px]" style={{ color: "#c9a84c" }}>★</span>
                  ))}
                </div>
                {/* Add to cart btn */}
                <button
                  className="w-full mt-3 py-1.5 rounded-full text-[10px] font-bold text-white"
                  style={{ background: "rgba(82,183,136,0.2)", border: "1px solid rgba(82,183,136,0.3)" }}
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}

            {/* Stats badge floating */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute top-1/2 left-4 -translate-y-1/2 dark-card p-4 text-center"
              style={{ width: "130px" }}
            >
              <p className="text-2xl font-black text-white">500+</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Active Sellers</p>
              <div className="flex gap-1 mt-2 justify-center">
                {["🟢", "🟢", "🟢", "🟡"].map((c, i) => (
                  <span key={i} className="text-[8px]">{c}</span>
                ))}
              </div>
            </motion.div>

            {/* Live order notification */}
            <AnimatePresence>
              {notifVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 20, x: 20 }}
                  animate={{ opacity: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-8 left-0 dark-card px-4 py-3 flex items-center gap-3"
                  style={{ minWidth: "230px", border: "1px solid rgba(82,183,136,0.2)" }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                    style={{ background: "rgba(82,183,136,0.15)" }}
                  >
                    🛒
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{ORDER_NOTIF.name}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      {ORDER_NOTIF.action} · {ORDER_NOTIF.time}
                    </p>
                  </div>
                  <span
                    className="w-2 h-2 rounded-full shrink-0 animate-ping-slow"
                    style={{ background: "#52b788" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Bottom curve transition ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10"
        style={{
          background: "var(--bg-0)",
          borderRadius: "40px 40px 0 0",
        }}
      />
    </section>
  );
}
