"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart }   from "../../../../context/CartContext";
import { useUser }   from "../../../../context/UserContext";
import { useToast }  from "../../../../context/ToastContext";
import { useRouter, useParams } from "next/navigation";
import { paymentApi, orderApi, couponApi } from "../../../../lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const { slug } = useParams();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user }  = useUser();
  const router    = useRouter();
  const toast     = useToast();

  const [formData, setFormData] = useState({
    name:    user?.name  || "",
    email:   user?.email || "",
    address: "",
    city:    "",
    zipCode: "",
  });

  useEffect(() => {
    if (user) setFormData((f) => ({ ...f, name: user.name || "", email: user.email || "" }));
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);
  // Unique key per checkout session — prevents duplicate orders on double-submit
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  // Coupon state
  const [couponCode,     setCouponCode]     = useState("");
  const [couponLoading,  setCouponLoading]  = useState(false);
  const [appliedCoupon,  setAppliedCoupon]  = useState(null); // { code, discountAmount, finalTotal, message }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const subtotal = getCartTotal();
  const discount = appliedCoupon?.discountAmount || 0;
  const total    = Math.max(0, subtotal - discount);

  // ── Apply coupon ───────────────────────────────────────────
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponApi.validate({ code: couponCode.trim(), orderTotal: subtotal });
      setAppliedCoupon(res);
      toast.success(res.message || "Coupon applied! 🎉");
    } catch (err) {
      toast.error(err.message || "Invalid coupon code");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  // Load Razorpay script
  const loadRazorpay = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src   = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload  = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const orderPayload = () => ({
    customer: {
      name:    formData.name,
      email:   formData.email,
      address: formData.address,
      city:    formData.city,
      zipCode: formData.zipCode,
    },
    items: cartItems.map((item) => ({
      productId: item._id,
      name:      item.name,
      price:     item.price,
      quantity:  item.quantity,
      imageUrl:  item.imageUrl,
    })),
    total,
    couponCode:     appliedCoupon?.code || undefined,
    discountAmount: appliedCoupon?.discountAmount || 0,
    idempotencyKey,
  });

  // ── Razorpay flow ──────────────────────────────────────────
  const handleRazorpay = async () => {
    const ok = await loadRazorpay();
    if (!ok) { toast.error("Failed to load payment gateway. Check your internet."); return; }

    setLoading(true);
    try {
      const rzpOrder = await paymentApi.createOrder({ total });

      const options = {
        key:         rzpOrder.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount:      rzpOrder.amount,
        currency:    rzpOrder.currency || "INR",
        name:        "Paperbag",
        description: "Eco-friendly Paper Bags",
        order_id:    rzpOrder.orderId,
        prefill:     { name: formData.name, email: formData.email },
        theme:       { color: "#2d6a4f" },
        handler: async (response) => {
          try {
            const result = await paymentApi.verify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              orderData:           orderPayload(),
            });
            clearCart();
            toast.success("Payment successful! Order placed 🎉");
            router.push(`/store/${slug}/order-confirmation?orderId=${result.order._id}`);
          } catch (err) {
            toast.error(err.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment.");
      setLoading(false);
    }
  };

  // ── COD flow ───────────────────────────────────────────────
  const handleCOD = async () => {
    setLoading(true);
    try {
      const result = await orderApi.create(orderPayload());
      clearCart();
      toast.success("Order placed successfully! 🌿");
      router.push(`/store/${slug}/order-confirmation?orderId=${result.order._id}`);
    } catch (err) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod === "razorpay") handleRazorpay();
    else handleCOD();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 text-center max-w-md"
        >
          <span className="text-6xl mb-4 block">🛒</span>
          <h1 className="text-2xl font-black mb-3" style={{ color: "var(--green-900)" }}>Your Cart is Empty</h1>
          <p className="text-sm mb-6" style={{ color: "#6b7280" }}>Add some eco-friendly bags before checking out.</p>
          <Link href={`/store/${slug}/products`}>
            <button className="btn-primary">Continue Shopping →</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4" style={{ background: "var(--cream)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "#9ca3af" }}>
          <Link href={`/store/${slug}`} className="hover:text-green-700 transition">Home</Link>
          <span>/</span>
          <Link href={`/store/${slug}/cart`} className="hover:text-green-700 transition">Cart</Link>
          <span>/</span>
          <span style={{ color: "var(--green-800)" }} className="font-semibold">Checkout</span>
        </nav>

        <h1 className="text-3xl font-black mb-8" style={{ color: "var(--green-900)" }}>Checkout</h1>

        <div className="grid md:grid-cols-[1fr_400px] gap-8">

          {/* ── Left: Shipping form ── */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-black mb-5" style={{ color: "var(--green-900)" }}>
                📍 Shipping Information
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: "Full Name",   name: "name",    type: "text",  placeholder: "Your full name" },
                  { label: "Email",       name: "email",   type: "email", placeholder: "your@email.com" },
                  { label: "Address",     name: "address", type: "text",  placeholder: "Street address" },
                ].map(({ label, name, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      required
                      placeholder={placeholder}
                      value={formData[name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition"
                      style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--green-200)")}
                    />
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-4">
                  {[{ label: "City", name: "city", placeholder: "Mumbai" }, { label: "PIN Code", name: "zipCode", placeholder: "400001" }].map(({ label, name, placeholder }) => (
                    <div key={name}>
                      <label className="block text-sm font-bold mb-1.5" style={{ color: "var(--green-800)" }}>
                        {label}
                      </label>
                      <input
                        type="text"
                        name={name}
                        required
                        placeholder={placeholder}
                        value={formData[name]}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none"
                        style={{ border: "1.5px solid var(--green-200)", background: "var(--cream)" }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--green-500)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--green-200)")}
                      />
                    </div>
                  ))}
                </div>

                {/* Payment method */}
                <div>
                  <p className="text-sm font-bold mb-3" style={{ color: "var(--green-800)" }}>
                    💳 Payment Method
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: "razorpay", icon: "💳", label: "Pay Online", sub: "Cards / UPI / NetBanking" },
                      { val: "cod",      icon: "🏠", label: "Cash on Delivery", sub: "Pay when delivered" },
                    ].map(({ val, icon, label, sub }) => (
                      <label
                        key={val}
                        className="flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                        style={{
                          border: paymentMethod === val ? "2px solid var(--green-600)" : "1.5px solid var(--cream-dark)",
                          background: paymentMethod === val ? "var(--green-100)" : "white",
                        }}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={val}
                          checked={paymentMethod === val}
                          onChange={() => setPaymentMethod(val)}
                          className="sr-only"
                        />
                        <span className="text-2xl">{icon}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>{label}</p>
                          <p className="text-xs" style={{ color: "#6b7280" }}>{sub}</p>
                        </div>
                        {paymentMethod === val && (
                          <span className="ml-auto text-green-600 font-black text-lg">✓</span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-full font-black text-white text-base transition ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  style={{
                    background: paymentMethod === "razorpay"
                      ? "linear-gradient(135deg, #1e40af, #3b82f6)"
                      : "var(--green-700)",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : paymentMethod === "razorpay"
                    ? `💳 Pay ₹${total.toFixed(2)} Online`
                    : `🏠 Place COD Order — ₹${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="space-y-5">
            <div className="card p-6">
              <h2 className="text-lg font-black mb-5" style={{ color: "var(--green-900)" }}>
                🛍️ Order Summary
              </h2>

              {/* Cart items */}
              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: "var(--green-100)" }}
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: "var(--green-900)" }}>{item.name}</p>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-sm flex-shrink-0" style={{ color: "var(--green-700)" }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--cream-dark)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--green-700)" }}>🏷️ Coupon Code</p>
                <AnimatePresence mode="wait">
                  {appliedCoupon ? (
                    <motion.div
                      key="applied"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: "#d1fae5", border: "1px solid #6ee7b7" }}
                    >
                      <span className="text-green-700 text-sm">✅</span>
                      <div className="flex-1">
                        <p className="font-black text-sm" style={{ color: "#065f46" }}>{appliedCoupon.code}</p>
                        <p className="text-xs" style={{ color: "#047857" }}>
                          Saving ₹{appliedCoupon.discountAmount?.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: "rgba(0,0,0,0.08)", color: "#065f46", border: "none", cursor: "pointer" }}
                      >
                        Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter code (e.g. ECO20)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyCoupon())}
                        className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                        style={{ border: "1.5px solid var(--green-300)", background: "white" }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="btn-primary py-2.5 px-4 text-xs flex-shrink-0"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Totals */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between" style={{ color: "#4b5563" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-semibold" style={{ color: "#065f46" }}>
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>−₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ color: "#4b5563" }}>
                  <span>Shipping</span>
                  <span className="font-semibold" style={{ color: subtotal >= 999 ? "#065f46" : undefined }}>
                    {subtotal >= 999 ? "FREE" : "₹49"}
                  </span>
                </div>
                <div
                  className="flex justify-between text-base font-black pt-3 border-t"
                  style={{ borderColor: "var(--cream-dark)", color: "var(--green-900)" }}
                >
                  <span>Total</span>
                  <span style={{ color: "var(--green-700)" }}>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Eco message */}
              <div
                className="rounded-xl p-3 text-xs flex items-start gap-2"
                style={{ background: "var(--green-100)", color: "var(--green-800)" }}
              >
                <span>🌿</span>
                <span>Your order supports eco-friendly packaging. We plant a tree for every 100 bags ordered!</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="card p-4">
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["🔒", "Secure Checkout"],
                  ["📦", "Eco Packaging"],
                  ["🚚", "Fast Delivery"],
                  ["↩️", "Easy Returns"],
                ].map(([icon, label]) => (
                  <div key={label} className="flex items-center gap-2 text-xs" style={{ color: "#6b7280" }}>
                    <span>{icon}</span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
