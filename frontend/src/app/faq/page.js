"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FAQS = [
  {
    cat: "Ordering",
    items: [
      {
        q: "What is the minimum order quantity (MOQ)?",
        a: "Our minimum order quantity is just 10 pieces per product. For custom printed bags, MOQ is 50 pieces to ensure consistent print quality.",
      },
      {
        q: "Can I get a sample before placing a bulk order?",
        a: "Yes! We offer sample kits for ₹199 (includes 5 bags of your chosen type). The sample cost is refunded on your first bulk order of 100+ units.",
      },
      {
        q: "How do I place a custom printing order?",
        a: "Add the product to your cart, choose quantity, and mention your branding requirements in the order notes. Our design team will reach out within 24 hours to finalize artwork.",
      },
      {
        q: "Can I mix different bag types in one order?",
        a: "Absolutely! You can add multiple product types to your cart and check out together. Each product maintains its own MOQ.",
      },
    ],
  },
  {
    cat: "Shipping & Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–7 business days across India. Express delivery (1–3 days) is available for select pincodes at an additional charge.",
      },
      {
        q: "Is free shipping available?",
        a: "Yes! Orders above ₹999 qualify for free standard shipping. Use code ECO20 for an additional 20% off your first order.",
      },
      {
        q: "Do you ship internationally?",
        a: "We currently ship only within India. International shipping is coming soon — subscribe to our newsletter to be notified when it launches.",
      },
      {
        q: "How do I track my order?",
        a: "Visit our Track Order page and enter your order ID or the email address used at checkout. You'll see real-time delivery updates.",
      },
    ],
  },
  {
    cat: "Products & Quality",
    items: [
      {
        q: "Are your bags really eco-friendly?",
        a: "100% yes. Our bags are made from post-consumer recycled paper (300 GSM), printed with water-based non-toxic inks, and are FSC and GreenGuard certified. They biodegrade naturally within 2–6 months.",
      },
      {
        q: "How much weight can the bags hold?",
        a: "Standard bags hold up to 3 kg. Our premium and jumbo variants hold up to 5–8 kg respectively. All bags are load-tested before shipment.",
      },
      {
        q: "Can I choose custom sizes?",
        a: "Yes! We offer custom sizing for orders of 100+ pieces. Contact our team with your exact dimensions and we'll provide a quote.",
      },
      {
        q: "What printing options are available?",
        a: "We offer CMYK full-color digital printing, single-color spot printing, and embossing/debossing for premium brands. All prints use water-based, non-toxic inks.",
      },
    ],
  },
  {
    cat: "Payments & Returns",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit/debit cards, UPI (PhonePe, GPay, Paytm), net banking, and Cash on Delivery — all via our secure Razorpay gateway.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All transactions are processed through Razorpay's PCI-DSS compliant gateway with 256-bit SSL encryption. We never store your card details.",
      },
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days for damaged or incorrect items. Custom printed bags are non-returnable unless there's a printing defect on our end.",
      },
      {
        q: "How long does a refund take?",
        a: "Refunds are processed within 5–7 business days to your original payment method. For COD orders, refunds are processed as bank transfers within 7–10 days.",
      },
    ],
  },
];

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden mb-3"
      style={{ background: isOpen ? "var(--green-100)" : "white", border: "1px solid var(--cream-dark)", transition: "background 0.2s" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        <span className="font-bold text-sm pr-4" style={{ color: "var(--green-900)" }}>{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--green-600)", fontSize: 20, flexShrink: 0 }}
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#4b5563" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState(null);
  const [search, setSearch] = useState("");

  const toggle = (key) => setOpenKey((k) => (k === key ? null : key));

  const filtered = FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      ({ q, a }) =>
        search === "" ||
        q.toLowerCase().includes(search.toLowerCase()) ||
        a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Hero */}
      <div className="py-16 text-center px-6" style={{ background: "var(--green-900)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-5xl mb-4 block">❓</span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg mb-8" style={{ color: "rgba(255,255,255,0.7)" }}>
            Everything you need to know about Paperbag
          </p>
          {/* Search */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center gap-3 px-4 py-3 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
              <span style={{ color: "rgba(255,255,255,0.5)" }}>🔍</span>
              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-opacity-50 focus:outline-none text-sm"
                style={{ color: "white" }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🤷</p>
            <p className="font-bold" style={{ color: "var(--green-900)" }}>No results for "{search}"</p>
            <p className="text-sm mt-2" style={{ color: "#6b7280" }}>Try a different search term or browse all categories</p>
            <button onClick={() => setSearch("")} className="btn-primary mt-4">Clear Search</button>
          </div>
        ) : (
          filtered.map(({ cat, items }) => (
            <div key={cat} className="mb-10">
              <h2 className="text-lg font-black mb-4 flex items-center gap-2" style={{ color: "var(--green-900)" }}>
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-black"
                  style={{ background: "var(--green-600)" }}
                >
                  {items.length}
                </span>
                {cat}
              </h2>
              {items.map(({ q, a }, i) => {
                const key = `${cat}-${i}`;
                return (
                  <FAQItem
                    key={key}
                    q={q}
                    a={a}
                    isOpen={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          ))
        )}

        {/* CTA */}
        <div
          className="rounded-3xl p-8 text-center mt-4"
          style={{ background: "var(--green-900)" }}
        >
          <p className="text-white font-black text-xl mb-2">Still have questions?</p>
          <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>
            Our team is here to help. Reach out via chat or contact form.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/#contact">
              <button className="btn-gold">📩 Contact Us</button>
            </Link>
            <button
              onClick={() => document.getElementById("ai-chat-btn")?.click()}
              style={{
                background: "rgba(255,255,255,0.15)", color: "white", border: "1.5px solid rgba(255,255,255,0.3)",
                padding: "10px 24px", borderRadius: 999, cursor: "pointer", fontWeight: 700, fontSize: 14,
              }}
            >
              🌿 Chat with Leaf AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
