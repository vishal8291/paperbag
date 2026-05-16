"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useUser }   from "../../context/UserContext";
import { useRouter } from "next/navigation";
import { orderApi }  from "../../lib/api";

const STATUS_MAP = {
  pending:    { bg: "#fef3c7", color: "#92400e", label: "Pending" },
  processing: { bg: "#dbeafe", color: "#1e40af", label: "Processing" },
  shipped:    { bg: "#ede9fe", color: "#5b21b6", label: "Shipped" },
  "out for delivery": { bg: "#fef3c7", color: "#b45309", label: "Out for Delivery" },
  delivered:  { bg: "#d1fae5", color: "#065f46", label: "Delivered" },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Cancelled" },
};

export default function MyOrdersPage() {
  const { user }         = useUser();
  const router           = useRouter();
  const [orders,  setOrders]   = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    orderApi.getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--cream)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black" style={{ color: "var(--green-900)" }}>My Orders 📦</h1>
            <p className="text-sm mt-1" style={{ color: "#6b7280" }}>Track all your purchases in one place</p>
          </div>
          <Link href="/track-order">
            <button className="btn-outline text-sm py-2 px-5">🔍 Track by ID</button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-36 rounded-2xl" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-16 text-center"
          >
            <span className="text-6xl block mb-4">📭</span>
            <h2 className="text-2xl font-black mb-2" style={{ color: "var(--green-900)" }}>No orders yet</h2>
            <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Place your first eco-friendly order today!</p>
            <Link href="/products">
              <button className="btn-primary">Shop Now →</button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {orders.map((order) => {
              const sc = STATUS_MAP[order.status?.toLowerCase()] || { bg: "#f3f4f6", color: "#4b5563", label: order.status };
              return (
                <motion.div
                  key={order._id}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  className="card p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="font-black" style={{ color: "var(--green-900)" }}>
                        Order #{String(order._id).slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-black"
                      style={{ background: sc.bg, color: sc.color }}
                    >
                      {sc.label}
                    </span>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                          )}
                          <span style={{ color: "#4b5563" }}>{item.name} <span style={{ color: "#9ca3af" }}>× {item.quantity}</span></span>
                        </div>
                        <span className="font-semibold" style={{ color: "var(--green-700)" }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {order.couponCode && (
                    <p className="text-xs mb-3 font-semibold" style={{ color: "#065f46" }}>
                      🏷️ Coupon applied: {order.couponCode}
                    </p>
                  )}

                  <div
                    className="flex flex-wrap items-center justify-between pt-3 border-t gap-3"
                    style={{ borderColor: "var(--cream-dark)" }}
                  >
                    <div className="text-xs flex items-center gap-2" style={{ color: "#6b7280" }}>
                      <span>{order.paymentMethod === "razorpay" ? "💳 Paid Online" : "🏠 Cash on Delivery"}</span>
                      {order.paymentStatus === "paid" && (
                        <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: "#d1fae5", color: "#065f46" }}>
                          Paid ✓
                        </span>
                      )}
                    </div>
                    <p className="font-black text-lg" style={{ color: "var(--green-700)" }}>
                      ₹{Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
