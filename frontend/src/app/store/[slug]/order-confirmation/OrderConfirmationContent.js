"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { orderApi } from "../../../../lib/api";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "../../../../context/UserContext";

export default function OrderConfirmationContent() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const orderId      = searchParams.get("orderId");
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    orderApi.getById(orderId)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const printInvoice = () => { window.print(); };

  return (
    <>
      <style>{`
        @media print {
          body > *:not(#order-confirmation-root) { display: none !important; }
          #order-confirmation-root { display: block !important; }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          header, footer, nav { display: none !important; }
        }
      `}</style>

      <div id="order-confirmation-root" className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(135deg, var(--cream) 0%, var(--green-100) 100%)" }}>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-10 max-w-lg w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-7xl mb-5"
          >
            ✅
          </motion.div>

          <h1 className="text-3xl font-black mb-2" style={{ color: "var(--green-900)" }}>
            Order Confirmed!
          </h1>
          <p className="mb-6" style={{ color: "#6b7280" }}>
            Thank you for shopping with Paperbag 🌿 A confirmation email is on its way.
          </p>

          {loading ? (
            <div className="skeleton h-28 rounded-2xl mb-6" />
          ) : order ? (
            <div className="rounded-2xl p-5 text-left mb-6 space-y-2"
              style={{ background: "var(--green-100)" }}>
              <p className="font-black text-sm" style={{ color: "var(--green-800)" }}>
                Order #{String(order._id).slice(-8).toUpperCase()}
              </p>
              <div className="text-sm space-y-1" style={{ color: "#4b5563" }}>
                <p><b>Customer:</b> {order.customer.name}</p>
                <p><b>Total:</b> ₹{Number(order.total).toFixed(2)}</p>
                <p><b>Payment:</b> {order.paymentMethod === "razorpay" ? "💳 Paid Online" : "🏠 Cash on Delivery"}</p>
              </div>
            </div>
          ) : null}

          <div className="flex gap-3 justify-center flex-wrap no-print">
            <Link href={`/store/${slug}/products`}>
              <button className="btn-primary">Continue Shopping →</button>
            </Link>
            <Link href={`/store/${slug}/orders`}>
              <button className="btn-outline">View My Orders</button>
            </Link>
            <button onClick={printInvoice} className="btn-outline text-sm py-2 px-5 flex items-center gap-2">
              🖨️ Download Invoice
            </button>
          </div>

          {/* Referral section */}
          <div className="mt-6 rounded-2xl p-4 text-center no-print" style={{ background: "var(--green-100)" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "var(--green-800)" }}>
              🎁 Refer a friend, both get ₹50 off!
            </p>
            <p className="text-xs mb-3" style={{ color: "#6b7280" }}>Share your referral link:</p>
            <div className="flex gap-2 justify-center">
              <input
                readOnly
                value={typeof window !== "undefined" ? `${window.location.origin}/register?ref=${user?._id?.slice(-8)}` : ""}
                className="flex-1 max-w-xs text-xs px-3 py-2 rounded-lg border border-green-200 bg-white text-green-800"
              />
              <button
                onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?._id?.slice(-8)}`); }}
                className="btn-primary text-xs py-2 px-4"
              >
                Copy
              </button>
            </div>
          </div>

          <p className="text-xs mt-6" style={{ color: "#9ca3af" }}>
            🌿 Thank you for choosing eco-friendly packaging!
          </p>
        </motion.div>
      </div>
    </>
  );
}
