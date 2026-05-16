"use client";

import React from 'react';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        {/* Dark hero header */}
        <div className="py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-6">
            🛒 Shopping Cart
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4">Your Cart is Empty</h1>
          <p className="text-white/60 mb-8 text-lg">Add some eco-friendly products to your cart to get started!</p>
          <Link
            href="/products"
            className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream, #faf7f2)' }}>
      {/* Dark green hero header */}
      <div className="py-14 px-4" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        <div className="container mx-auto max-w-6xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-4">
            🛒 Shopping Cart
          </div>
          <h1 className="text-4xl font-extrabold text-white">Your Cart</h1>
          <p className="text-white/60 mt-2">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} ready for checkout</p>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Cart Items */}
          <div className="flex-1">
            <div className="card p-0 overflow-hidden rounded-2xl shadow">
              {cartItems.map((item, idx) => (
                <div
                  key={item._id}
                  className={`flex items-center gap-4 px-6 py-5 ${idx !== cartItems.length - 1 ? 'border-b border-green-100' : ''}`}
                >
                  {/* Product Image */}
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-green-900 truncate">{item.name}</h3>
                    <p className="text-emerald-600 font-medium text-sm mt-0.5">₹{item.price.toFixed(2)} each</p>
                  </div>

                  {/* Quantity Controls — glassmorphism style on white card becomes bordered */}
                  <div className="flex items-center border border-green-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="px-3 py-2 text-green-700 hover:bg-green-50 transition font-bold text-lg leading-none"
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-x border-green-200 text-green-900 font-semibold min-w-[2.5rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="px-3 py-2 text-green-700 hover:bg-green-50 transition font-bold text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="text-base font-bold text-green-900 w-24 text-right flex-shrink-0">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 flex-shrink-0"
                    title="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-800 font-medium mt-5 transition"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Sticky Order Summary Sidebar */}
          <div className="lg:w-80 xl:w-96">
            <div className="sticky top-6">
              {/* Summary card with dark green header */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
                  <h2 className="text-lg font-bold text-white">Order Summary</h2>
                </div>
                <div className="bg-white px-6 py-5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span className="font-medium text-gray-800">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Eco packaging</span>
                    <span className="text-emerald-600 font-medium">Included</span>
                  </div>
                  <div className="border-t border-green-100 pt-3 flex justify-between items-center">
                    <span className="text-base font-bold text-green-900">Total</span>
                    <span className="text-2xl font-extrabold text-emerald-600">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                <div className="bg-white px-6 pb-6 space-y-3">
                  <Link
                    href="/checkout"
                    className="block w-full text-center bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 transition"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={clearCart}
                    className="block w-full text-center border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 px-6 rounded-xl transition"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Eco badge */}
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-start gap-3">
                <span className="text-2xl">🌿</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">Eco-friendly packaging</p>
                  <p className="text-xs text-green-600 mt-0.5">All orders shipped in 100% recycled paper bags</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
