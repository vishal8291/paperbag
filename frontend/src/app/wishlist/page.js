"use client";

import React, { useState, useEffect } from "react";
import { useUser }   from "../../context/UserContext";
import { useCart }   from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { wishlistApi } from "../../lib/api";

export default function WishlistPage() {
  const { user }         = useUser();
  const { addToCart }    = useCart();
  const router           = useRouter();
  const [items, setItems]    = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    wishlistApi.get()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user, router]);

  const handleRemove = async (productId) => {
    await wishlistApi.toggle(productId);
    setItems((prev) => prev.filter((p) => p._id !== productId));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream, #faf7f2)' }}>
      {/* Dark green hero header */}
      <div className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        <div className="container mx-auto max-w-5xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-4">
            ❤️ Wishlist
          </div>
          <h1 className="text-4xl font-extrabold text-white">My Wishlist</h1>
          <p className="text-white/60 mt-2">
            {loading ? 'Loading your saved items…' : `${items.length} saved item${items.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-5xl py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6 text-4xl">
              💚
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8">Browse our eco-friendly products and save your favourites.</p>
            <a
              href="/products"
              className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition"
            >
              Shop Now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl shadow hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-50 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Eco badge */}
                  {product.isEcoFriendly && (
                    <span className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      🌿 Eco
                    </span>
                  )}
                  {/* Wishlist heart indicator */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 rounded-full w-8 h-8 flex items-center justify-center shadow text-sm">
                    ❤️
                  </span>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-base text-green-900 mb-1 truncate">{product.name}</h3>
                  <p className="text-emerald-600 font-bold text-lg mb-4">₹{product.price}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { addToCart(product); router.push("/cart"); }}
                      className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="flex-1 border border-red-200 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl text-sm font-semibold transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
