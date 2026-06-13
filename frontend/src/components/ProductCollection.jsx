"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { useStore } from "../context/StoreContext";

export default function ProductCollection() {
  const { slug } = useStore();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/products`)
      .then(r => r.json())
      .then(data => setProducts((Array.isArray(data) ? data : (data.products || [])).slice(0, 6)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section-pad" style={{ background: "var(--bg-0)" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
            style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}>
            Our Products
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Find Your Perfect Bag
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
            From everyday shopping to luxury gifting — every bag tells a story of sustainability.
          </p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(n => (
              <div key={n} className="rounded-2xl overflow-hidden">
                <div className="skeleton h-52 w-full" />
                <div className="p-4 space-y-3">
                  <div className="skeleton h-5 w-3/4" />
                  <div className="skeleton h-4 w-1/2" />
                  <div className="skeleton h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🛍️</p>
            <p className="text-xl">No products yet. Check back soon!</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
          >
            {products.map((product) => (
              <motion.div key={product._id}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href={slug ? `/store/${slug}/products` : "/products"}>
            <button className="btn-primary text-base px-10 py-4">
              View All Products →
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
