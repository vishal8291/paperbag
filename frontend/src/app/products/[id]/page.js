"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../context/CartContext";
import { useUser } from "../../../context/UserContext";
import { useToast } from "../../../context/ToastContext";
import { productApi, wishlistApi } from "../../../lib/api";

// ── Display-only stars (small, inline) ───────────────────────
function Stars({ rating = 5, size = 15 }) {
  return (
    <div style={{ display: "flex", gap: 1.5, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={n <= rating ? "#f59e0b" : "#e5e7eb"}
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Interactive star picker (write a review) ──────────────────
function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  const COLORS  = ["", "#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${n}`}
          style={{
            background: "none", border: "none",
            padding: "4px", cursor: "pointer", lineHeight: 1,
          }}
        >
          <svg width={32} height={32} viewBox="0 0 24 24"
            fill={n <= active ? COLORS[active] : "none"}
            stroke={n <= active ? COLORS[active] : "#d1d5db"}
            strokeWidth={1.6}
            style={{ display: "block", transition: "all 0.12s ease", transform: n === active ? "scale(1.2)" : "scale(1)" }}
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
          </svg>
        </button>
      ))}
      {active > 0 && (
        <span style={{
          marginLeft: 4, fontSize: 13, fontWeight: 700,
          color: COLORS[active],
          background: active <= 2 ? "#fee2e2" : active === 3 ? "#fef9c3" : "#dcfce7",
          padding: "3px 12px", borderRadius: 999,
        }}>
          {LABELS[active]}
        </span>
      )}
    </div>
  );
}


// ── Bulk pricing table ────────────────────────────────────────
const BULK = [
  { qty: "1–9",    label: "Standard",    disc: 0 },
  { qty: "10–49",  label: "Small Bulk",  disc: 5 },
  { qty: "50–199", label: "Medium Bulk", disc: 10 },
  { qty: "200+",   label: "Wholesale",   disc: 18 },
];

const SAMPLE_REVIEWS = [
  { name: "Priya S.", rating: 5, date: "May 2025", review: "Excellent quality! The bags are sturdy and look premium. Used them for my boutique packaging — customers love them!" },
  { name: "Rahul M.", rating: 4, date: "Apr 2025", review: "Great eco-friendly option. Delivery was fast. Slightly thinner than expected but overall very good for the price." },
  { name: "Sneha K.", rating: 5, date: "Mar 2025", review: "Ordered 200 pcs for a wedding. Every single bag was perfect. Will definitely reorder for my next event!" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user } = useUser();
  const toast = useToast();

  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [imgError, setImgError]     = useState(false);
  const [related, setRelated]       = useState([]);
  const [quantity, setQuantity]     = useState(1);
  const [activeImg, setActiveImg]   = useState(0);
  const [zoomed, setZoomed]         = useState(false);
  const [zoomPos, setZoomPos]       = useState({ x: 50, y: 50 });
  const [tab, setTab]               = useState("desc"); // desc | specs | reviews
  const [inWishlist, setInWishlist] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [pincode, setPincode]       = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [reviews, setReviews]       = useState([]);
  const [sizeGuide, setSizeGuide]   = useState(false);
  const addToCartRef = useRef(null);

  // Sticky bar on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!addToCartRef.current) return;
      const rect = addToCartRef.current.getBoundingClientRect();
      setStickyVisible(rect.bottom < 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/products/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        // fetch related filtered by category
        return fetch(`${base}/api/products?limit=8&category=${encodeURIComponent(data.category || "")}`).then((r) => r.json());
      })
      .then((payload) => {
        const all = Array.isArray(payload) ? payload : (payload.products || []);
        setRelated(all.filter((p) => p._id !== params.id).slice(0, 4));
      })
      .catch(() => {
        toast.error("Product not found");
        router.push("/products");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  // Fetch real reviews
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/reviews/${params.id}`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, [params.id]);

  // Wishlist status
  useEffect(() => {
    if (!user) return;
    wishlistApi.get()
      .then((list) => setInWishlist(list.some((p) => p._id === params.id)))
      .catch(() => {});
  }, [user, params.id]);

  const images = product
    ? [product.imageUrl, product.imageUrl, product.imageUrl].filter(Boolean)
    : [];

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({ ...product, quantity });
    toast.success(`${quantity}× ${product.name} added to cart! 🛍️`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  const toggleWishlist = async () => {
    if (!user) { toast.info("Please log in to save items to wishlist"); return; }
    setWishLoading(true);
    try {
      await wishlistApi.toggle(params.id);
      setInWishlist((v) => !v);
      toast.success(inWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch {
      toast.error("Wishlist update failed");
    } finally {
      setWishLoading(false);
    }
  };

  const checkPincode = () => {
    if (pincode.length !== 6) { toast.warning("Enter a valid 6-digit pincode"); return; }
    // Simulate check — in prod call a real API
    setTimeout(() => {
      const deliverable = parseInt(pincode) % 2 === 0;
      setPincodeResult(
        deliverable
          ? { ok: true,  msg: "✅ Delivery available — arrives in 3–5 days" }
          : { ok: false, msg: "⚠️ Express delivery not available. Standard: 7–10 days" }
      );
    }, 600);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.info("Please log in to write a review"); return; }
    if (!reviewForm.review.trim()) { toast.warning("Write something in your review"); return; }
    setSubmittingReview(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      await fetch(`${base}/api/reviews/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ rating: reviewForm.rating, review: reviewForm.review, name: user.name })
      });
      toast.success("Review submitted! Thank you 🌿");
      setReviewForm({ rating: 5, review: "" });
      // Refresh reviews
      const res = await fetch(`${base}/api/reviews/${params.id}`);
      const data = res.ok ? await res.json() : [];
      setReviews(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const discountedPrice = (price, disc) => price * (1 - disc / 100);

  const displayReviews = reviews.length > 0 ? reviews : SAMPLE_REVIEWS;

  // ── Loading skeleton ─────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen px-6 py-12" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="skeleton h-5 w-48 rounded mb-8" />
          <div className="grid md:grid-cols-2 gap-10">
            <div className="skeleton h-96 rounded-3xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/3 rounded" />
              <div className="skeleton h-20 rounded" />
              <div className="skeleton h-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const finalPrice = product.price * quantity;

  return (
    <>
      {/* ── Sticky add-to-cart bar ─────────────────── */}
      <AnimatePresence>
        {stickyVisible && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            style={{
              position: "fixed",
              top: 64,
              left: 0,
              right: 0,
              zIndex: 500,
              background: "white",
              borderBottom: "1px solid var(--cream-dark)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>{product.name}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>₹{product.price.toFixed(2)} / unit</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-lg" style={{ color: "var(--green-700)" }}>
                  ₹{finalPrice.toFixed(2)}
                </span>
                <button className="btn-primary py-2 px-6 text-sm" onClick={handleAddToCart}>
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Size Guide Modal ───────────────────────── */}
      <AnimatePresence>
        {sizeGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSizeGuide(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1rem",
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-8 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-black" style={{ color: "var(--green-900)" }}>📐 Size Guide</h3>
                <button
                  onClick={() => setSizeGuide(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#9ca3af" }}
                >✕</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--green-100)" }}>
                    <th className="px-3 py-2 text-left font-bold" style={{ color: "var(--green-800)" }}>Size</th>
                    <th className="px-3 py-2 text-left font-bold" style={{ color: "var(--green-800)" }}>Dimensions</th>
                    <th className="px-3 py-2 text-left font-bold" style={{ color: "var(--green-800)" }}>Max Load</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Small",  "20×10×15 cm", "up to 1 kg"],
                    ["Medium", "30×12×25 cm", "up to 3 kg"],
                    ["Large",  "40×15×35 cm", "up to 5 kg"],
                    ["Jumbo",  "50×20×45 cm", "up to 8 kg"],
                  ].map(([size, dims, load], i) => (
                    <tr key={size} style={{ background: i % 2 === 0 ? "var(--cream-dark)" : "white" }}>
                      <td className="px-3 py-2.5 font-semibold" style={{ color: "var(--green-800)" }}>{size}</td>
                      <td className="px-3 py-2.5" style={{ color: "#4b5563" }}>{dims}</td>
                      <td className="px-3 py-2.5" style={{ color: "#4b5563" }}>{load}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs mt-4" style={{ color: "#9ca3af" }}>
                * Dimensions are W×D×H. Custom sizes available on bulk orders.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen" style={{ background: "var(--cream)" }}>
        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* ── Breadcrumbs ─────────────────────────── */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "#9ca3af" }}>
            <Link href="/" className="hover:text-green-700 transition">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-green-700 transition">Products</Link>
            <span>/</span>
            <span style={{ color: "var(--green-800)" }} className="font-semibold">{product.name}</span>
          </nav>

          {/* ── Main grid ─────────────────────────────── */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">

            {/* ── Left: Image gallery ─────────────────── */}
            <div>
              {/* Main image with zoom */}
              <div
                className="relative rounded-3xl overflow-hidden mb-4 cursor-zoom-in"
                style={{ background: "var(--green-100)", aspectRatio: "1 / 1" }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                  setZoomPos({ x, y });
                }}
                onMouseEnter={() => setZoomed(true)}
                onMouseLeave={() => setZoomed(false)}
              >
                <img
                  src={imgError ? "/file.svg" : (images[activeImg] || product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: zoomed ? "scale(1.8)" : "scale(1)",
                  }}
                  onError={() => setImgError(true)}
                />
                {/* Wishlist btn */}
                <button
                  onClick={toggleWishlist}
                  disabled={wishLoading}
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    background: "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  {inWishlist ? "❤️" : "🤍"}
                </button>
                {/* Zoom hint */}
                {!zoomed && (
                  <div style={{
                    position: "absolute", bottom: 12, left: 12,
                    background: "rgba(0,0,0,0.45)", color: "white",
                    fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  }}>
                    🔍 Hover to zoom
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      style={{
                        width: 72, height: 72, borderRadius: 12, overflow: "hidden",
                        border: i === activeImg ? "2.5px solid var(--green-600)" : "2px solid transparent",
                        cursor: "pointer", padding: 0, background: "none",
                        flexShrink: 0,
                      }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Details ──────────────────────── */}
            <div ref={addToCartRef}>
              {/* Badge */}
              <span
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-3"
                style={{ background: "var(--green-100)", color: "var(--green-700)" }}
              >
                ♻️ Eco-Friendly
              </span>

              <h1 className="text-3xl font-black mb-1" style={{ color: "var(--green-900)" }}>
                {product.name}
              </h1>

              {/* Size Guide link */}
              <button
                onClick={() => setSizeGuide(true)}
                className="text-xs font-semibold mb-3 inline-flex items-center gap-1"
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-600)", padding: 0 }}
              >
                📐 Size Guide
              </button>

              {/* Rating row */}
              <div className="flex items-center gap-3 mb-4">
                <Stars rating={4} size={18} />
                <span className="text-sm font-semibold" style={{ color: "var(--green-700)" }}>4.0</span>
                <span className="text-sm" style={{ color: "#9ca3af" }}>(24 reviews)</span>
                {(() => {
                  const qty = typeof product.stock === "number" ? product.stock : null;
                  const out = qty !== null && qty <= 0;
                  const low = qty !== null && qty > 0 && qty <= 5;
                  return (
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: out ? "#fee2e2" : low ? "#fef3c7" : "#d1fae5", color: out ? "#991b1b" : low ? "#92400e" : "#065f46" }}>
                      {out ? "Out of Stock" : low ? `Only ${qty} left` : "In Stock"}
                    </span>
                  );
                })()}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-black" style={{ color: "var(--green-700)" }}>
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-base line-through" style={{ color: "#9ca3af" }}>
                  ₹{(product.price * 1.2).toFixed(2)}
                </span>
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded"
                  style={{ background: "#fef3c7", color: "#92400e" }}
                >
                  20% OFF
                </span>
              </div>

              <p className="text-sm leading-relaxed mb-6" style={{ color: "#4b5563" }}>
                {product.description || "Premium eco-friendly paper bag crafted from 100% recycled materials. Perfect for retail, gifting, and events. Sturdy handles, smooth finish, and completely biodegradable."}
              </p>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-sm font-bold" style={{ color: "var(--green-900)" }}>Qty:</span>
                <div
                  className="flex items-center rounded-full overflow-hidden"
                  style={{ border: "1.5px solid var(--green-300)" }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold transition"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-800)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-100)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >−</button>
                  <span className="w-12 text-center font-black" style={{ color: "var(--green-900)" }}>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-lg font-bold transition"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--green-800)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--green-100)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >+</button>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>
                  Total: <span style={{ color: "var(--green-700)", fontWeight: 900 }}>₹{finalPrice.toFixed(2)}</span>
                </span>
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 mb-3">
                <button className="btn-primary flex-1 py-3.5 text-base" onClick={handleAddToCart}>
                  🛍️ Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  style={{
                    flex: 1, padding: "14px 20px", borderRadius: 999,
                    background: "var(--green-900)", color: "white",
                    border: "none", cursor: "pointer", fontWeight: 700, fontSize: 15,
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#0d2318")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--green-900)")}
                >
                  ⚡ Buy Now
                </button>
              </div>

              {/* WhatsApp order button */}
              <div className="mb-6">
                <a
                  href={`https://wa.me/918291569470?text=${encodeURIComponent(`Hi! I'm interested in ordering ${product.name} (₹${product.price}). Can you help me?`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-full font-bold text-sm border-2"
                  style={{ borderColor: "#25D366", color: "#25D366", background: "rgba(37,211,102,0.05)" }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Order via WhatsApp
                </a>
              </div>

              {/* Pincode check */}
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ background: "var(--green-100)" }}
              >
                <p className="text-sm font-bold mb-2" style={{ color: "var(--green-800)" }}>
                  📍 Check Delivery Availability
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "")); setPincodeResult(null); }}
                    className="flex-1 px-4 py-2.5 rounded-full text-sm focus:outline-none"
                    style={{ background: "white", border: "1.5px solid var(--green-300)" }}
                  />
                  <button
                    onClick={checkPincode}
                    className="btn-primary py-2.5 px-5 text-sm"
                    style={{ flexShrink: 0 }}
                  >
                    Check
                  </button>
                </div>
                {pincodeResult && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm mt-2 font-semibold"
                    style={{ color: pincodeResult.ok ? "#065f46" : "#92400e" }}
                  >
                    {pincodeResult.msg}
                  </motion.p>
                )}
              </div>

              {/* Trust mini */}
              <div className="flex flex-wrap gap-3">
                {["🔒 Secure Payment", "♻️ Eco Certified", "🚚 Fast Delivery", "↩️ Easy Returns"].map((b) => (
                  <span key={b} className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: "white", color: "var(--green-800)", border: "1px solid var(--green-200)" }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Bulk Pricing Table ──────────────────────── */}
          <div className="card p-6 mb-12">
            <h3 className="text-xl font-black mb-4" style={{ color: "var(--green-900)" }}>
              📦 Bulk Pricing — The More You Order, The More You Save
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {BULK.map(({ qty, label, disc }, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 text-center transition"
                  style={{
                    background: disc > 0 ? "var(--green-100)" : "var(--cream-dark)",
                    border: disc >= 10 ? "2px solid var(--green-400)" : "1px solid transparent",
                  }}
                >
                  <p className="font-black text-lg" style={{ color: "var(--green-900)" }}>{qty}</p>
                  <p className="text-xs mb-1" style={{ color: "#6b7280" }}>{label}</p>
                  {disc > 0 ? (
                    <p className="font-bold text-sm" style={{ color: "#065f46" }}>Save {disc}%</p>
                  ) : (
                    <p className="text-sm" style={{ color: "#9ca3af" }}>Standard price</p>
                  )}
                  <p className="font-black mt-1" style={{ color: "var(--green-700)" }}>
                    ₹{discountedPrice(product.price, disc).toFixed(2)}/pc
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Tabs: Description / Specs / Reviews ──── */}
          <div className="card mb-12 overflow-hidden">
            {/* Tab headers */}
            <div className="flex border-b" style={{ borderColor: "var(--cream-dark)" }}>
              {[
                { id: "desc",    label: "Description" },
                { id: "specs",   label: "Specifications" },
                { id: "reviews", label: `Reviews (${reviews.length > 0 ? reviews.length : 24})` },
              ].map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  style={{
                    padding: "14px 24px",
                    fontWeight: 700,
                    fontSize: 14,
                    border: "none",
                    borderBottom: tab === id ? "3px solid var(--green-600)" : "3px solid transparent",
                    background: "none",
                    cursor: "pointer",
                    color: tab === id ? "var(--green-700)" : "#6b7280",
                    transition: "all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {tab === "desc" && (
                  <motion.div
                    key="desc"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="leading-relaxed mb-4" style={{ color: "#4b5563" }}>
                      {product.description || "Our premium eco-friendly paper bags are crafted with care and precision. Each bag is made from 100% post-consumer recycled paper, ensuring you get quality packaging while making a positive environmental impact."}
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Made from 100% recycled post-consumer paper",
                        "Water-based, non-toxic inks for printing",
                        "Reinforced handles for durability",
                        "Fully biodegradable — decomposes in 2–6 months",
                        "Available in custom sizes and printed designs",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm" style={{ color: "#4b5563" }}>
                          <span style={{ color: "var(--green-600)" }}>✓</span> {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {tab === "specs" && (
                  <motion.div
                    key="specs"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <table className="w-full text-sm">
                      <tbody>
                        {[
                          ["Material",         "100% Recycled Paper (300 GSM)"],
                          ["Dimensions",       "Standard: 30cm × 10cm × 25cm"],
                          ["Handle Type",      "Twisted paper rope handles"],
                          ["Max Load",         "Up to 5 kg"],
                          ["Printing",         "CMYK full-color, water-based inks"],
                          ["Biodegradable",    "Yes — 2 to 6 months"],
                          ["MOQ",              "10 pieces"],
                          ["Lead Time",        "3–7 business days"],
                          ["GST",              "18% applicable"],
                          ["Certifications",   "FSC, GreenGuard certified"],
                        ].map(([key, val], i) => (
                          <tr
                            key={i}
                            style={{ background: i % 2 === 0 ? "var(--cream-dark)" : "white" }}
                          >
                            <td className="px-4 py-3 font-semibold" style={{ color: "var(--green-800)", width: "40%" }}>{key}</td>
                            <td className="px-4 py-3" style={{ color: "#4b5563" }}>{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {tab === "reviews" && (
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Summary */}
                    <div className="flex items-center gap-6 mb-8 p-5 rounded-2xl" style={{ background: "var(--cream-dark)" }}>
                      <div className="text-center">
                        <p className="text-5xl font-black" style={{ color: "var(--green-700)" }}>4.0</p>
                        <div className="flex justify-center mt-1.5 mb-1">
                          <Stars rating={4} size={16} />
                        </div>
                        <p className="text-xs" style={{ color: "#9ca3af" }}>{reviews.length > 0 ? reviews.length : 24} reviews</p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((n) => {
                          const pct = [60, 25, 10, 3, 2][5 - n];
                          return (
                            <div key={n} className="flex items-center gap-2 text-xs">
                              <span style={{ color: "#6b7280", width: 12 }}>{n}</span>
                              <span style={{ color: "#f59e0b" }}>★</span>
                              <div className="flex-1 h-2 rounded-full" style={{ background: "#e5e7eb" }}>
                                <div
                                  className="h-2 rounded-full"
                                  style={{ width: `${pct}%`, background: "#f59e0b" }}
                                />
                              </div>
                              <span style={{ color: "#9ca3af", width: 24 }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Reviews list */}
                    <div className="space-y-5 mb-8">
                      {displayReviews.map((rev, i) => (
                        <div key={i} className="p-5 rounded-2xl" style={{ background: "var(--cream-dark)" }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                style={{ background: `hsl(${(i * 60) + 140}, 50%, 45%)` }}
                              >
                                {(rev.name || "U")[0]}
                              </div>
                              <div>
                                <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>{rev.name}</p>
                                <Stars rating={rev.rating} size={13} />
                              </div>
                            </div>
                            <span className="text-xs" style={{ color: "#9ca3af" }}>
                              {rev.date || (rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "")}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed" style={{ color: "#4b5563" }}>{rev.review}</p>
                        </div>
                      ))}
                    </div>

                    {/* Write a review */}
                    <div className="border-t pt-8" style={{ borderColor: "var(--cream-dark)" }}>
                      <h4 className="font-black text-base mb-5" style={{ color: "var(--green-900)" }}>
                        Share Your Experience
                      </h4>

                      {!user ? (
                        /* Not logged in state */
                        <div className="rounded-2xl p-8 flex flex-col items-center text-center gap-3"
                          style={{ background: "var(--cream-dark)", border: "1.5px dashed var(--green-300)" }}>
                          <span style={{ fontSize: 36 }}>🔒</span>
                          <p className="font-bold text-sm" style={{ color: "var(--green-900)" }}>
                            Log in to write a review
                          </p>
                          <p className="text-xs" style={{ color: "#9ca3af" }}>
                            Share your experience and help other customers decide.
                          </p>
                          <a href="/login">
                            <button className="btn-primary text-sm py-2.5 px-6 mt-1">
                              Log In →
                            </button>
                          </a>
                        </div>
                      ) : (
                        /* Logged in — review form */
                        <form onSubmit={handleReviewSubmit}>
                          <div className="rounded-2xl overflow-hidden"
                            style={{ border: "1.5px solid var(--green-200)" }}>

                            {/* User identity strip */}
                            <div className="flex items-center gap-3 px-5 py-4"
                              style={{ background: "var(--green-100)", borderBottom: "1px solid var(--green-200)" }}>
                              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                                style={{ background: "var(--green-700)" }}>
                                {user.name?.[0]?.toUpperCase() || "U"}
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: "var(--green-900)" }}>
                                  {user.name}
                                </p>
                                <p className="text-xs" style={{ color: "var(--green-700)" }}>
                                  Posting as verified buyer
                                </p>
                              </div>
                            </div>

                            {/* Rating row */}
                            <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--cream-dark)", background: "white" }}>
                              <p className="text-xs font-bold mb-3" style={{ color: "#9ca3af", letterSpacing: "0.05em" }}>
                                TAP TO RATE
                              </p>
                              <StarPicker
                                value={reviewForm.rating}
                                onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))}
                              />
                            </div>

                            {/* Textarea */}
                            <div style={{ background: "white" }}>
                              <textarea
                                value={reviewForm.review}
                                onChange={(e) => setReviewForm((f) => ({ ...f, review: e.target.value }))}
                                placeholder="Quality, packaging, delivery speed — what stood out?"
                                rows={4}
                                maxLength={500}
                                className="w-full px-5 py-4 text-sm focus:outline-none resize-none"
                                style={{ background: "white", color: "#374151", lineHeight: 1.7, display: "block" }}
                              />
                              <div className="flex items-center justify-between px-5 pb-4">
                                <span className="text-xs" style={{ color: "#d1d5db" }}>
                                  {reviewForm.review.length} / 500
                                </span>
                              </div>
                            </div>

                            {/* Submit bar */}
                            <div className="flex items-center justify-between px-5 py-3 gap-3"
                              style={{ background: "var(--cream-dark)", borderTop: "1px solid var(--green-200)" }}>
                              <p className="text-xs" style={{ color: "#9ca3af" }}>
                                Reviews are public and help future buyers.
                              </p>
                              <button
                                type="submit"
                                disabled={submittingReview || !reviewForm.review.trim()}
                                className="btn-primary text-sm py-2.5 px-6 flex-shrink-0"
                                style={{ opacity: !reviewForm.review.trim() ? 0.5 : 1 }}
                              >
                                {submittingReview ? "Posting..." : "Post Review"}
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Related products ─────────────────────── */}
          {related.length > 0 && (
            <div>
              <h2 className="text-2xl font-black mb-6" style={{ color: "var(--green-900)" }}>
                You May Also Like
              </h2>
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
              >
                {related.map((p) => (
                  <motion.div
                    key={p._id}
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <Link href={`/products/${p._id}`}>
                      <div
                        className="card p-4 cursor-pointer"
                        style={{ transition: "transform 0.2s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                      >
                        <div className="rounded-2xl overflow-hidden mb-3" style={{ aspectRatio: "1 / 1", background: "var(--green-100)" }}>
                          <img src={p.imageUrl || "/file.svg"} alt={p.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = "/file.svg"; }} />
                        </div>
                        <p className="font-bold text-sm mb-1 truncate" style={{ color: "var(--green-900)" }}>{p.name}</p>
                        <p className="font-black text-sm" style={{ color: "var(--green-700)" }}>₹{p.price?.toFixed(2)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
