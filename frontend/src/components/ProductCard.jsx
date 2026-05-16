"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import { wishlistApi } from "../lib/api";

const FALLBACK_IMG = "/file.svg";

export default function ProductCard({ product, initialWishlisted = false }) {
  const { user }      = useUser();
  const { addToCart } = useCart();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [wishing,    setWishing]    = useState(false);
  const [added,      setAdded]      = useState(false);
  const [imgSrc,     setImgSrc]     = useState(product.imageUrl || FALLBACK_IMG);

  const stockQty    = typeof product.stock === "number" ? product.stock : null;
  const inStock     = stockQty === null || stockQty > 0;
  const lowStock    = stockQty !== null && stockQty > 0 && stockQty <= 5;

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = "/login"; return; }
    setWishing(true);
    try {
      const result = await wishlistApi.toggle(product._id);
      setWishlisted(result.action === "added");
    } catch {}
    finally { setWishing(false); }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/products/${product._id}`} className="block group">
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: "4/3" }}>
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImgSrc(FALLBACK_IMG)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.ecoFriendly && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white shadow-md"
                style={{ background: "var(--green-700)" }}>
                🌿 Eco
              </span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            disabled={wishing}
            whileTap={{ scale: 0.85 }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all"
            style={{ background: "rgba(255,255,255,0.9)" }}
          >
            <AnimatePresence mode="wait">
              <motion.span key={wishlisted ? "filled" : "empty"}
                initial={{ scale: 0.5 }} animate={{ scale: 1 }} exit={{ scale: 0.5 }}
                transition={{ duration: 0.15 }}
              >
                {wishlisted ? "❤️" : "🤍"}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          {/* Quick-add overlay on hover */}
          {inStock && (
            <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }}>
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-all"
                style={{ background: added ? "var(--green-600)" : "var(--green-800)" }}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </motion.button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-2 flex-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-green-800 transition line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 line-clamp-2 flex-1 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-black" style={{ color: "var(--green-800)" }}>
              ₹{product.price}
            </span>
            {inStock ? (
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: lowStock ? "#fef3c7" : "var(--green-100)", color: lowStock ? "#92400e" : "var(--green-800)" }}>
                {lowStock ? `Only ${stockQty} left` : "In Stock"}
              </span>
            ) : (
              <span className="text-xs px-2 py-1 rounded-full font-medium"
                style={{ background: "#fee2e2", color: "#991b1b" }}>
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
