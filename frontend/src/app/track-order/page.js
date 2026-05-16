"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { orderApi } from "../../lib/api";

const STATUS_STEPS = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

const STATUS_MAP = {
  pending:    0,
  processing: 1,
  shipped:    2,
  "out for delivery": 3,
  delivered:  4,
};

function OrderTimeline({ status }) {
  const currentStep = STATUS_MAP[status?.toLowerCase()] ?? 0;
  return (
    <div className="flex items-start justify-between relative mt-6 mb-2">
      {/* Line */}
      <div
        className="absolute top-4 left-0 right-0 h-1 rounded"
        style={{ background: "var(--cream-dark)", zIndex: 0 }}
      />
      <motion.div
        className="absolute top-4 left-0 h-1 rounded"
        initial={{ width: 0 }}
        animate={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        style={{ background: "var(--green-600)", zIndex: 1 }}
      />
      {STATUS_STEPS.map((step, i) => {
        const done    = i <= currentStep;
        const current = i === currentStep;
        return (
          <div key={i} className="flex flex-col items-center" style={{ zIndex: 2, flex: 1 }}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * i + 0.3 }}
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm"
              style={{
                background: done ? "var(--green-600)" : "white",
                color: done ? "white" : "#9ca3af",
                border: current ? "3px solid var(--green-400)" : done ? "none" : "2px solid var(--cream-dark)",
                boxShadow: current ? "0 0 0 4px rgba(45,106,79,0.15)" : "none",
              }}
            >
              {done ? "✓" : i + 1}
            </motion.div>
            <p
              className="text-xs font-semibold mt-2 text-center"
              style={{ color: done ? "var(--green-800)" : "#9ca3af", maxWidth: 60 }}
            >
              {step}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function TrackOrderPage() {
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [order,   setOrder]   = useState(null);
  const [error,   setError]   = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const result = await orderApi.getById(query.trim());
      setOrder(result);
    } catch {
      setError("Order not found. Please check your Order ID and try again.");
    } finally {
      setLoading(false);
    }
  };

  const STATUS_COLORS = {
    pending:    { bg: "#fef3c7", color: "#92400e" },
    processing: { bg: "#dbeafe", color: "#1e40af" },
    shipped:    { bg: "#ede9fe", color: "#5b21b6" },
    delivered:  { bg: "#d1fae5", color: "#065f46" },
    cancelled:  { bg: "#fee2e2", color: "#991b1b" },
  };

  const sc = STATUS_COLORS[order?.status?.toLowerCase()] || { bg: "#f3f4f6", color: "#4b5563" };

  return (
    <div className="min-h-screen" style={{ background: "var(--cream)" }}>
      {/* Header */}
      <div className="py-16 text-center px-6" style={{ background: "var(--green-900)" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-5xl mb-4 block">📦</span>
          <h1 className="text-4xl font-black text-white mb-3">Track Your Order</h1>
          <p style={{ color: "rgba(255,255,255,0.7)" }}>
            Enter your Order ID to see real-time delivery status
          </p>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2" style={{ color: "var(--green-800)" }}>
                Order ID
              </label>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. 6847abc123def456..."
                className="w-full px-5 py-3.5 rounded-2xl text-sm focus:outline-none"
                style={{ border: "1.5px solid var(--green-300)", background: "var(--cream)" }}
              />
              <p className="text-xs mt-1.5" style={{ color: "#9ca3af" }}>
                You can find your Order ID in the confirmation email or on the Order Confirmation page.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="btn-primary w-full py-3.5"
            >
              {loading ? "Searching..." : "🔍 Track Order"}
            </button>
          </form>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl p-5 mb-6 text-center"
              style={{ background: "#fee2e2", border: "1px solid #fecaca" }}
            >
              <p className="text-2xl mb-2">😕</p>
              <p className="font-bold text-sm" style={{ color: "#991b1b" }}>{error}</p>
              <p className="text-xs mt-1" style={{ color: "#b91c1c" }}>
                Check your email for the correct Order ID or{" "}
                <Link href="/#contact" className="underline">contact us</Link>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card p-8"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div>
                  <p className="text-xs font-semibold mb-0.5" style={{ color: "#9ca3af" }}>ORDER</p>
                  <p className="font-black text-lg" style={{ color: "var(--green-900)" }}>
                    #{String(order._id).slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <span
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase"
                  style={{ background: sc.bg, color: sc.color }}
                >
                  {order.status}
                </span>
              </div>

              {/* Timeline */}
              <OrderTimeline status={order.status} />

              {/* Divider */}
              <div className="my-6 border-t" style={{ borderColor: "var(--cream-dark)" }} />

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div className="rounded-2xl p-4" style={{ background: "var(--cream-dark)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "var(--green-700)" }}>👤 Customer</p>
                  <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>{order.customer?.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{order.customer?.email}</p>
                </div>
                <div className="rounded-2xl p-4" style={{ background: "var(--cream-dark)" }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "var(--green-700)" }}>📍 Delivery To</p>
                  <p className="text-sm" style={{ color: "#4b5563" }}>
                    {order.customer?.address}, {order.customer?.city} — {order.customer?.zipCode}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid var(--cream-dark)" }}>
                <p className="px-4 py-3 text-xs font-bold" style={{ background: "var(--cream-dark)", color: "var(--green-700)" }}>
                  ORDER ITEMS
                </p>
                <div className="divide-y" style={{ borderColor: "var(--cream-dark)" }}>
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: "var(--green-900)" }}>{item.name}</p>
                        <p className="text-xs" style={{ color: "#9ca3af" }}>Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-sm" style={{ color: "var(--green-700)" }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between px-4 py-3 font-black" style={{ background: "var(--cream-dark)", color: "var(--green-900)" }}>
                  <span>Total</span>
                  <span>₹{Number(order.total).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment */}
              <div className="flex items-center gap-2 text-sm" style={{ color: "#6b7280" }}>
                <span>{order.paymentMethod === "razorpay" ? "💳" : "🏠"}</span>
                <span>
                  {order.paymentMethod === "razorpay" ? "Paid online via Razorpay" : "Cash on Delivery"}
                </span>
                {order.paymentStatus === "paid" && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#d1fae5", color: "#065f46" }}>
                    Paid ✓
                  </span>
                )}
              </div>

              <div className="mt-6 text-center">
                <Link href="/products">
                  <button className="btn-primary">Continue Shopping →</button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logged in users shortcut */}
        <p className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
          Have an account?{" "}
          <Link href="/orders" className="font-bold" style={{ color: "var(--green-700)" }}>
            View all your orders →
          </Link>
        </p>
      </div>
    </div>
  );
}
