"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart }   from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useUser }   from "../context/UserContext";
import { useStore }  from "../context/StoreContext";
import { useRouter, usePathname } from "next/navigation";

const PRODUCTS_MENU = [
  {
    heading: "Shop by Category",
    color: "#52b788",
    links: [
      { icon: "🛍️", label: "Shopping Bags" },
      { icon: "🎁", label: "Gift Bags" },
      { icon: "📦", label: "Kraft Paper" },
      { icon: "💼", label: "Branded Bags" },
      { icon: "👗", label: "Fashion" },
    ],
  },
  {
    heading: "Collections",
    color: "#c9a84c",
    links: [
      { icon: "✨", label: "New Arrivals" },
      { icon: "🔥", label: "Bestsellers" },
      { icon: "🌿", label: "Eco Picks" },
      { icon: "🎨", label: "Custom Print" },
      { icon: "💍", label: "Luxury Gift" },
    ],
  },
  {
    heading: "For Sellers",
    color: "#74c69d",
    links: [
      { icon: "🚀", label: "Start Selling", href: "/seller/register" },
      { icon: "📊", label: "Seller Dashboard", href: "/seller/dashboard" },
      { icon: "💰", label: "Pricing", href: "/pricing" },
      { icon: "🤖", label: "Leaf AI", href: "/" },
    ],
  },
];

export default function Navbar() {
  const { store, slug } = useStore();
  const { getCartCount }              = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout, isAdmin }     = useUser();
  const router                        = useRouter();
  const pathname                      = usePathname();

  const [scrolled,      setScrolled]      = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [productsOpen,  setProductsOpen]  = useState(false);
  const [userOpen,      setUserOpen]      = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);
  const [mobileProducts, setMobileProducts] = useState(false);

  const productsRef = useRef(null);
  const userRef     = useRef(null);
  const searchRef   = useRef(null);

  const isPaperbag = !slug || slug === "paperbag";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) setProductsOpen(false);
      if (userRef.current     && !userRef.current.contains(e.target))     setUserOpen(false);
      if (searchRef.current   && !searchRef.current.contains(e.target))   setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
    setUserOpen(false);
  }, [pathname]);

  const handleLogout = () => { logout(); router.push(isPaperbag ? "/" : `/store/${slug}`); };
  const cartCount = getCartCount();

  const NAV_SIMPLE = [
    { label: "Home",        href: isPaperbag ? "/" : `/store/${slug}` },
    { label: "Track Order", href: isPaperbag ? "/track-order" : `/store/${slug}/track-order` },
    { label: "FAQ",         href: isPaperbag ? "/faq" : `/store/${slug}/faq` },
    { label: "Contact",     href: isPaperbag ? "/contact" : `/store/${slug}/contact` },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: "transparent",
          backdropFilter: "none",
          borderBottom: "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 gap-6">

          {/* ── Logo ── */}
          <Link
            href={isPaperbag ? "/" : `/store/${slug}`}
            className="flex items-center gap-2 shrink-0"
          >
            {store?.logo
              ? <img src={store.logo} alt={store.name} className="w-7 h-7 object-contain" />
              : <span className="text-xl">🌿</span>
            }
            <span className="text-lg font-black tracking-tight text-black">
              {store?.name || "Paperbag"}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-0.5">

            {/* Home */}
            <Link
              href={isPaperbag ? "/" : `/store/${slug}`}
              className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                pathname === (isPaperbag ? "/" : `/store/${slug}`)
                  ? "text-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Home
            </Link>

            {/* Products — mega dropdown */}
            {isPaperbag && (
              <div ref={productsRef} className="relative">
                <button
                  onMouseEnter={() => setProductsOpen(true)}
                  onClick={() => setProductsOpen(v => !v)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                    productsOpen ? "text-black" : "text-black/60 hover:text-black"
                  }`}
                >
                  Products
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200"
                    style={{ transform: productsOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    viewBox="0 0 12 12" fill="none"
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {productsOpen && (
                    <motion.div
                      onMouseLeave={() => setProductsOpen(false)}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px]"
                      style={{
                        background: "rgba(10,10,10,0.97)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "20px",
                        boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
                        backdropFilter: "blur(30px)",
                        padding: "28px",
                      }}
                    >
                      <div className="grid grid-cols-3 gap-8">
                        {PRODUCTS_MENU.map(({ heading, color, links }) => (
                          <div key={heading}>
                            <p
                              className="text-[10px] font-bold uppercase tracking-widest mb-4"
                              style={{ color }}
                            >
                              {heading}
                            </p>
                            <ul className="space-y-1">
                              {links.map(({ icon, label, href }) => (
                                <li key={label}>
                                  <Link
                                    href={href || `/products?cat=${encodeURIComponent(label)}`}
                                    onClick={() => setProductsOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all group"
                                    style={{ color: "rgba(255,255,255,0.65)" }}
                                    onMouseEnter={e => {
                                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                      e.currentTarget.style.color = "#fff";
                                    }}
                                    onMouseLeave={e => {
                                      e.currentTarget.style.background = "transparent";
                                      e.currentTarget.style.color = "rgba(255,255,255,0.65)";
                                    }}
                                  >
                                    <span className="text-base w-5 text-center">{icon}</span>
                                    <span className="font-medium">{label}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Bottom CTA strip */}
                      <div
                        className="mt-6 pt-5 flex items-center justify-between"
                        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                          500+ eco sellers · 12K+ products · Pan-India delivery
                        </p>
                        <Link
                          href="/products"
                          onClick={() => setProductsOpen(false)}
                          className="text-xs font-bold flex items-center gap-1 transition-colors"
                          style={{ color: "#74c69d" }}
                        >
                          Browse all →
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Simple links */}
            {NAV_SIMPLE.slice(1).map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  pathname === href ? "text-white" : "text-black/60 hover:text-black"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen(v => !v)}
                className="p-2 rounded-full transition-colors text-black/50 hover:text-black hover:bg-white/08"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                  <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
                  <path d="M13 13l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-72 rounded-2xl shadow-2xl p-3"
                    style={{
                      background: "rgba(12,12,12,0.97)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      backdropFilter: "blur(24px)",
                    }}
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          router.push(isPaperbag ? "/products" : `/store/${slug}/products`);
                          setSearchOpen(false);
                        }
                      }}
                      className="w-full bg-transparent px-4 py-2.5 text-sm text-white focus:outline-none rounded-xl"
                      style={{ border: "1px solid rgba(82,183,136,0.3)", color: "#fff" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link
              href={isPaperbag ? "/cart" : `/store/${slug}/cart`}
              className="relative p-2 rounded-full transition-colors text-black/50 hover:text-black"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none">
                <path d="M2 2h1.5l1.8 8.5h9l1.7-6H5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="17" r="1" fill="currentColor"/>
                <circle cx="15" cy="17" r="1" fill="currentColor"/>
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  style={{ background: "#52b788" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {!user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors px-3 py-1.5 text-black/70 hover:text-black"
                >
                  Log in
                </Link>
                <Link
                  href="/seller/register"
                  className="text-sm font-bold px-5 py-2 rounded-full transition-all"
                  style={{
                    background: "#fff",
                    color: "#080808",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e8e8e8")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
                >
                  Start for free
                </Link>
              </div>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen(v => !v)}
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 transition-colors hover:bg-white/08"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={e => { e.currentTarget.style.display = "none"; e.currentTarget.nextSibling.style.display = "flex"; }}
                    />
                  ) : null}
                  <span
                    className="w-7 h-7 rounded-full items-center justify-center text-xs font-bold text-white"
                    style={{ background: "var(--green-800)", display: user.avatar ? "none" : "flex" }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm font-medium text-black/80 hidden sm:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <svg className="w-3 h-3 text-black/40" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 overflow-hidden rounded-2xl shadow-2xl"
                      style={{
                        background: "rgba(10,10,10,0.97)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(24px)",
                      }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                        <p className="font-bold text-sm text-white">{user.name}</p>
                        <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{user.email}</p>
                      </div>
                      {[
                        { icon: "👤", label: "My Profile",  href: "/user/profile" },
                        { icon: "📦", label: "My Orders",   href: isPaperbag ? "/orders" : `/store/${slug}/orders` },
                        { icon: "❤️",  label: "Wishlist",   href: isPaperbag ? "/wishlist" : `/store/${slug}/wishlist` },
                      ].map(({ icon, label, href }) => (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                          style={{ color: "rgba(255,255,255,0.65)" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                        >
                          <span>{icon}</span>{label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          style={{ color: "var(--gold)" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(201,168,76,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors"
                          style={{ color: "#f87171" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(248,113,113,0.08)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-full transition-colors text-black/60 hover:text-black"
            >
              {mobileOpen
                ? <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                : <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              }
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden overflow-hidden"
              style={{
                background: "rgba(8,8,8,0.97)",
                borderTop: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="px-5 py-5 flex flex-col gap-1">
                <Link href={isPaperbag ? "/" : `/store/${slug}`}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-black/70 hover:text-black hover:bg-black/05 transition-colors">
                  Home
                </Link>

                {/* Mobile Products accordion */}
                {isPaperbag && (
                  <>
                    <button
                      onClick={() => setMobileProducts(v => !v)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-black/70 hover:text-black hover:bg-black/05 transition-colors w-full text-left"
                    >
                      Products
                      <svg className="w-3.5 h-3.5 transition-transform" style={{ transform: mobileProducts ? "rotate(180deg)" : "rotate(0deg)" }} viewBox="0 0 12 12" fill="none">
                        <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {mobileProducts && (
                      <div className="pl-4 pb-2 space-y-0.5">
                        {PRODUCTS_MENU.flatMap(g => g.links).map(({ icon, label, href }) => (
                          <Link
                            key={label}
                            href={href || `/products?cat=${encodeURIComponent(label)}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/55 hover:text-white hover:bg-white/05 transition-colors"
                          >
                            <span>{icon}</span>{label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {NAV_SIMPLE.slice(1).map(({ label, href }) => (
                  <Link key={href} href={href}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-black/70 hover:text-black hover:bg-black/05 transition-colors">
                    {label}
                  </Link>
                ))}

                {user && (
                  <>
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "8px 0" }} />
                    <Link href={isPaperbag ? "/wishlist" : `/store/${slug}/wishlist`} onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm text-black/70 hover:text-black hover:bg-black/05 transition-colors">
                      ❤️ Wishlist
                    </Link>
                    <Link href={isPaperbag ? "/orders" : `/store/${slug}/orders`} onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-xl text-sm text-black/70 hover:text-black hover:bg-black/05 transition-colors">
                      📦 My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)}
                        className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-white/05 transition-colors"
                        style={{ color: "var(--gold)" }}>
                        ⚙️ Admin
                      </Link>
                    )}
                    <button onClick={handleLogout}
                      className="px-4 py-3 rounded-xl text-sm font-semibold text-left hover:bg-white/05 transition-colors"
                      style={{ color: "#f87171" }}>
                      🚪 Logout
                    </button>
                  </>
                )}

                {!user && (
                  <div className="flex gap-3 mt-3">
                    <Link href="/login" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium border transition-colors text-white/70 hover:text-white"
                      style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                      Log in
                    </Link>
                    <Link href="/seller/register" onClick={() => setMobileOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold transition-colors"
                      style={{ background: "#fff", color: "#080808" }}>
                      Start for free
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
