"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    badge: null,
    price: { monthly: 0, yearly: 0 },
    desc: "Perfect for individuals and small shops trying out Paperbag.",
    color: "#f0f5f1",
    border: "#d4e6d9",
    btnStyle: "outline",
    features: [
      { text: "Up to 5 orders / month",       ok: true },
      { text: "Standard delivery (5–7 days)",  ok: true },
      { text: "Email support",                 ok: true },
      { text: "Access to all product catalog", ok: true },
      { text: "Order tracking",                ok: true },
      { text: "Bulk order discounts",          ok: false },
      { text: "Custom branding",               ok: false },
      { text: "Priority support",              ok: false },
      { text: "Dedicated account manager",     ok: false },
    ],
  },
  {
    name: "Business",
    badge: "Most Popular",
    price: { monthly: 999, yearly: 799 },
    desc: "For growing businesses that need reliability, discounts, and faster turnaround.",
    color: "#0d2b1a",
    border: "#1a3a2a",
    btnStyle: "solid",
    features: [
      { text: "Unlimited orders / month",             ok: true },
      { text: "Express delivery (2–3 days)",          ok: true },
      { text: "Priority email & chat support",        ok: true },
      { text: "10% discount on all orders",           ok: true },
      { text: "Order tracking + analytics dashboard", ok: true },
      { text: "Bulk order discounts (15% over 500u)", ok: true },
      { text: "Custom brand printing",                ok: true },
      { text: "Priority support (24h response)",      ok: false },
      { text: "Dedicated account manager",            ok: false },
    ],
  },
  {
    name: "Enterprise",
    badge: "Best Value",
    price: { monthly: 4999, yearly: 3999 },
    desc: "For large retailers, event companies, and brands needing white-label packaging at scale.",
    color: "#f9f5ee",
    border: "#c9a84c",
    btnStyle: "gold",
    features: [
      { text: "Unlimited orders / month",             ok: true },
      { text: "Same-day dispatch (select cities)",    ok: true },
      { text: "24/7 Priority support",                ok: true },
      { text: "20% discount on all orders",           ok: true },
      { text: "Full analytics & reporting",           ok: true },
      { text: "Bulk discounts (25% over 1000u)",      ok: true },
      { text: "White-label & custom branding",        ok: true },
      { text: "Priority support (2h response)",       ok: true },
      { text: "Dedicated account manager",            ok: true },
    ],
  },
];

const FAQS = [
  { q: "Can I cancel my subscription anytime?", a: "Yes — cancel anytime from your account dashboard. You keep access until the end of your billing period. No cancellation fees." },
  { q: "Do unused orders roll over to next month?", a: "On the Starter plan, the 5-order limit resets monthly. Business and Enterprise have unlimited orders, so rollover doesn't apply." },
  { q: "Is there a free trial for paid plans?", a: "Yes! Business and Enterprise plans include a 14-day free trial. No credit card required to start." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, Net Banking, and Wallets via Razorpay." },
  { q: "Can I upgrade or downgrade my plan?", a: "Absolutely. You can switch plans anytime. Upgrades take effect immediately; downgrades apply at the next billing cycle." },
  { q: "Are the bag prices included in the plan?", a: "Plans cover subscription benefits (discounts, priority, support). Bag prices are charged per order — plans give you discounts on those." },
];

function CheckIcon({ ok }) {
  return ok ? (
    <svg viewBox="0 0 20 20" fill="none" width={16} height={16} style={{ flexShrink: 0 }}>
      <circle cx={10} cy={10} r={10} fill="#d1fae5"/>
      <path d="M6 10l3 3 5-5" stroke="#2d6a4f" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg viewBox="0 0 20 20" fill="none" width={16} height={16} style={{ flexShrink: 0 }}>
      <circle cx={10} cy={10} r={10} fill="#f3f4f6"/>
      <path d="M7 13l6-6M13 13L7 7" stroke="#d1d5db" strokeWidth={2} strokeLinecap="round"/>
    </svg>
  );
}

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream,#faf7f2)" }}>

      {/* Hero */}
      <div
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #1a3a2a 100%)" }}
      >
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-400/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">
            💎 Simple, Transparent Pricing
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4" style={{ letterSpacing: '-0.5px' }}>
            Plans for Every Business
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            From solo entrepreneurs to enterprise brands — pick the plan that fits your order volume and grow with us.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex bg-white/10 rounded-full p-1 gap-1">
            {["monthly", "yearly"].map((b) => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className="px-5 py-2 rounded-full font-bold text-sm transition-all"
                style={{
                  background: billing === b ? "#fff" : "transparent",
                  color: billing === b ? "#0d2b1a" : "rgba(255,255,255,0.7)",
                }}
              >
                {b.charAt(0).toUpperCase() + b.slice(1)}
                {b === "yearly" && (
                  <span className="ml-2 bg-amber-400 text-green-900 text-xs px-2 py-0.5 rounded-full font-extrabold">
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Plan cards */}
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const price = billing === "yearly" ? plan.price.yearly : plan.price.monthly;
            const isDark = plan.color === "#0d2b1a";
            const isGold = plan.btnStyle === "gold";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-7"
                style={{ background: plan.color, border: `2px solid ${plan.border}` }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className="absolute top-5 right-5 text-xs font-extrabold px-3 py-1 rounded-full"
                    style={{
                      background: isDark ? "#c9a84c" : isGold ? "#c9a84c" : "#2d6a4f",
                      color: isDark || isGold ? "#1a3a2a" : "#fff",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                {/* Plan name & price */}
                <div className="mb-5">
                  <h3
                    className="text-xl font-extrabold mb-2"
                    style={{ color: isDark ? "#faf7f2" : "#1a3a2a" }}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    {price === 0 ? (
                      <span className="text-4xl font-black" style={{ color: isDark ? "#fff" : "#1a3a2a" }}>Free</span>
                    ) : (
                      <>
                        <span className="text-sm font-semibold" style={{ color: isDark ? "#6ee7b7" : "#6b7280" }}>₹</span>
                        <span className="text-4xl font-black" style={{ color: isDark ? "#fff" : "#1a3a2a" }}>
                          {price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm" style={{ color: isDark ? "#6ee7b7" : "#6b7280" }}>/mo</span>
                      </>
                    )}
                  </div>
                  {billing === "yearly" && price > 0 && (
                    <div className="text-xs font-semibold mb-2" style={{ color: isDark ? "#6ee7b7" : "#2d6a4f" }}>
                      Billed yearly — save ₹{((plan.price.monthly - price) * 12).toLocaleString("en-IN")}/yr
                    </div>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "#6b7280" }}>
                    {plan.desc}
                  </p>
                </div>

                {/* CTA button */}
                <Link
                  href={price === 0 ? "/register" : "/checkout"}
                  className="block w-full text-center font-bold text-sm py-3 rounded-xl mb-6 transition hover:opacity-90"
                  style={
                    plan.btnStyle === "solid"
                      ? { background: "#c9a84c", color: "#1a3a2a" }
                      : plan.btnStyle === "gold"
                      ? { background: "#c9a84c", color: "#1a3a2a" }
                      : { background: "transparent", color: "#1a3a2a", border: "2px solid #d4e6d9" }
                  }
                >
                  {price === 0 ? "Get Started Free" : `Start ${plan.name} — Free 14-day Trial`}
                </Link>

                {/* Divider */}
                <div
                  className="mb-5"
                  style={{ height: 1, background: isDark ? "rgba(255,255,255,0.1)" : "#e5e7eb" }}
                />

                {/* Features */}
                <ul className="space-y-2.5">
                  {plan.features.map(({ text, ok }) => (
                    <li key={text} className="flex items-center gap-2.5">
                      <CheckIcon ok={ok} />
                      <span
                        className="text-sm"
                        style={{ color: isDark ? (ok ? "#d1ead9" : "rgba(255,255,255,0.3)") : (ok ? "#1a3a2a" : "#9ca3af") }}
                      >
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap justify-center gap-8 my-14 text-gray-500 text-sm">
          {[
            { icon: "🔒", text: "Secure Payments via Razorpay" },
            { icon: "🔄", text: "Cancel Anytime, No Lock-in" },
            { icon: "🆓", text: "14-Day Free Trial on Paid Plans" },
            { icon: "📞", text: "Dedicated Support Included" },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <span className="text-lg">{icon}</span> {text}
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl overflow-hidden shadow border border-green-100 mb-16"
        >
          <div className="px-8 py-6 border-b border-green-100">
            <h2 className="text-xl font-extrabold" style={{ color: '#1b4332' }}>Full Plan Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-6 py-4 text-left text-gray-500 font-semibold w-2/5">Feature</th>
                  {["Starter", "Business", "Enterprise"].map((n) => (
                    <th key={n} className="px-6 py-4 text-center font-bold" style={{ color: '#1b4332' }}>{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Orders per month",        "5",          "Unlimited",   "Unlimited"],
                  ["Delivery speed",          "5–7 days",   "2–3 days",    "Same day*"],
                  ["Order discount",          "—",          "10%",         "20%"],
                  ["Bulk discount (500u+)",   "—",          "15%",         "25%"],
                  ["Custom branding",         "—",          "✓",           "✓"],
                  ["Analytics dashboard",     "—",          "✓",           "✓"],
                  ["Support response time",   "48 hours",   "24 hours",    "2 hours"],
                  ["Dedicated manager",       "—",          "—",           "✓"],
                  ["White-label packaging",   "—",          "—",           "✓"],
                  ["Free trial",              "Forever",    "14 days",     "14 days"],
                ].map(([feature, s, b, e], i) => (
                  <tr key={feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td className="px-6 py-3.5 text-gray-700 font-medium">{feature}</td>
                    {[s, b, e].map((val, j) => (
                      <td
                        key={j}
                        className="px-6 py-3.5 text-center font-semibold"
                        style={{ color: val === "—" ? "#d1d5db" : "#1b4332" }}
                      >
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl font-extrabold text-center mb-8" style={{ color: '#1b4332' }}>
            Frequently Asked Questions
          </h2>
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl mb-3 border border-green-100 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-green-50/50 transition"
              >
                <span className="font-bold text-sm" style={{ color: '#1b4332' }}>{faq.q}</span>
                <span
                  className="text-xl text-gray-400 flex-shrink-0 ml-4 transition-transform duration-200"
                  style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden text-center py-16 px-8 mb-20"
          style={{ background: "linear-gradient(135deg, #0d2b1a, #1a3a2a)" }}
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">
            🚀 Get Started
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-3">Start Free Today</h2>
          <p className="text-white/60 text-base mb-8 max-w-md mx-auto leading-relaxed">
            No credit card required. 14-day free trial on Business &amp; Enterprise plans.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="font-extrabold text-sm py-3.5 px-8 rounded-xl hover:opacity-90 transition"
              style={{ background: "#c9a84c", color: "#1a3a2a" }}
            >
              Get Started Free →
            </Link>
            <Link
              href="/contact"
              className="font-bold text-sm py-3.5 px-8 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
            >
              Talk to Sales
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
