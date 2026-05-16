"use client";

import React, { useEffect, useState, useCallback } from "react";
import { productApi } from "../../lib/api";
import ProductCard    from "../../components/ProductCard";

const PAGE_SIZE = 12;

const CATEGORIES = ["Shopping Bags", "Gift Bags", "Food Packaging", "Custom / Branded", "Eco / Kraft", "Festive"];

export default function ProductsPage() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [sort,        setSort]        = useState("newest");
  const [eco,         setEco]         = useState(false);
  const [category,    setCategory]    = useState("");
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [total,       setTotal]       = useState(0);

  const fetchProducts = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)   params.set("search", search);
      if (sort)     params.set("sort", sort);
      if (eco)      params.set("eco", "true");
      if (category) params.set("category", category);
      params.set("page",  String(p));
      params.set("limit", String(PAGE_SIZE));

      const data = await productApi.getPaginated(params.toString());
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setPage(p);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, sort, eco, category]);

  // Re-fetch on filter/sort change (reset to page 1)
  useEffect(() => { fetchProducts(1); }, [sort, eco, category]);

  const handleSearch = (e) => { e.preventDefault(); fetchProducts(1); };

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream, #faf7f2)' }}>

      {/* Dark green hero header */}
      <header className="py-16 px-4 text-center" style={{ background: 'linear-gradient(135deg, #0d2b1a, #1a3a2a)' }}>
        <div className="container mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-emerald-500/30 mb-5">
            🌿 Eco-Friendly Collection
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3">Our Products</h1>
          <p className="text-white/60 text-lg">
            Sustainable paper bags crafted for every occasion
            {category ? ` — ${category}` : ""}
          </p>
          {!loading && total > 0 && (
            <p className="text-emerald-400 text-sm mt-2 font-medium">{total} product{total !== 1 ? "s" : ""} available</p>
          )}
        </div>
      </header>

      {/* Category pills */}
      <div className="container mx-auto px-4 max-w-6xl mt-6 mb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory("")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              category === ""
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                : "border border-green-200 text-green-800 bg-white hover:bg-green-50"
            }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                category === cat
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                  : "border border-green-200 text-green-800 bg-white hover:bg-green-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="container mx-auto px-4 max-w-6xl -mt-0 relative z-10 mb-8 mt-3">
        <div className="card p-4 rounded-2xl shadow-lg flex flex-wrap gap-4 items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px] flex gap-2">
            <input
              type="text"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-green-200 bg-[var(--cream,#faf7f2)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 text-green-900 placeholder-green-300"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition"
            >
              Search
            </button>
          </form>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-green-200 bg-[var(--cream,#faf7f2)] text-green-900 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="newest">Newest First</option>
            <option value="priceAsc">Price: Low → High</option>
            <option value="priceDesc">Price: High → Low</option>
          </select>

          {/* Eco filter */}
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none text-green-800 font-medium">
            <input
              type="checkbox"
              checked={eco}
              onChange={(e) => setEco(e.target.checked)}
              className="w-4 h-4 accent-emerald-600"
            />
            🌿 Eco-Friendly only
          </label>
        </div>
      </div>

      {/* Grid */}
      <main className="container mx-auto px-4 max-w-6xl pb-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, n) => (
              <div key={n} className="skeleton h-72 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6 text-4xl">
              🔍
            </div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">Try adjusting your search or filters.</p>
            {(search || eco || category) && (
              <button
                onClick={() => { setSearch(""); setEco(false); setCategory(""); fetchProducts(1); }}
                className="inline-block bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => fetchProducts(page - 1)}
                  disabled={page <= 1}
                  className="px-4 py-2 rounded-xl border border-green-200 text-sm font-semibold disabled:opacity-40 hover:bg-green-100 transition text-green-800"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => fetchProducts(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                          p === page
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow"
                            : "border border-green-200 text-green-800 hover:bg-green-100"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => fetchProducts(page + 1)}
                  disabled={page >= totalPages}
                  className="px-4 py-2 rounded-xl border border-green-200 text-sm font-semibold disabled:opacity-40 hover:bg-green-100 transition text-green-800"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
