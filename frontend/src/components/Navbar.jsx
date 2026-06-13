"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart }   from "../context/CartContext";
import { useSearch } from "../context/SearchContext";
import { useUser }   from "../context/UserContext";
import { useStore }  from "../context/StoreContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { store, slug } = useStore();
  const { getCartCount }              = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout, isAdmin }     = useUser();
  const router                        = useRouter();
  const pathname                      = usePathname();

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const dropdownRef = useRef(null);
  const searchRef   = useRef(null);

  const NAV_LINKS = [
    { label: "Home",        href: slug ? `/store/${slug}` : "/" },
    { label: "Products",    href: slug ? `/store/${slug}/products` : "/products" },
    { label: "Track Order", href: slug ? `/store/${slug}/track-order` : "/track-order" },
    { label: "FAQ",         href: slug ? `/store/${slug}/faq` : "/faq" },
    { label: "Contact",     href: slug ? `/store/${slug}/contact` : "/contact" },
  ];

  // Scroll effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); setDropdownOpen(false); }, [pathname]);

  const handleLogout = () => { logout(); router.push(slug ? `/store/${slug}` : "/"); };

  const cartCount = getCartCount();

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          padding: scrolled ? "8px 0" : "16px 0",
          background: scrolled ? "rgba(8,8,8,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href={slug ? `/store/${slug}` : "/"} className="flex items-center gap-2 shrink-0">
            {store?.logo ? (
              <img src={store.logo} alt={store.name} className="w-8 h-8 object-contain" />
            ) : (
              <span className="text-2xl">🌿</span>
            )}
            <span className="text-xl font-black tracking-tight text-white">
              {store?.name || "Paperbag"}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={href} href={href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  pathname === href
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}>
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Actions ── */}
          <div className="flex items-center gap-2">
            {/* Search toggle */}
            <div ref={searchRef} className="relative">
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-full hover:bg-green-50 transition text-gray-600 hover:text-green-800">
                🔍
              </button>
              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-72 glass rounded-2xl shadow-xl p-3"
                  >
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { router.push(slug ? `/store/${slug}/products` : "/products"); setSearchOpen(false); }}}
                      className="w-full bg-transparent border border-green-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                      style={{ borderColor: "var(--green-400)" }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link href={slug ? `/store/${slug}/cart` : "/cart"} className="relative p-2 rounded-full hover:bg-green-50 transition text-gray-600 hover:text-green-800">
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
                  style={{ background: "var(--green-800)" }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User / Auth */}
            {!user ? (
              <Link href="/login" className="btn-primary text-sm py-2 px-5">
                Sign In
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:shadow-md transition">
                  {user.avatar
                    ? <img
                        src={user.avatar}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.nextSibling.style.display = "flex";
                        }}
                      />
                    : null}
                  <span className="w-7 h-7 rounded-full items-center justify-center text-sm font-bold text-white"
                    style={{ background: "var(--green-800)", display: user.avatar ? "none" : "flex" }}>
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold text-gray-800 hidden sm:block">
                    {user.name?.split(" ")[0]}
                  </span>
                  <span className="text-gray-400 text-xs">{dropdownOpen ? "▲" : "▼"}</span>
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-56 glass rounded-2xl shadow-2xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      {[
                        { icon: "👤", label: "My Profile",    href: "/user/profile" },
                        { icon: "📦", label: "My Orders",     href: slug ? `/store/${slug}/orders` : "/orders" },
                        { icon: "❤️",  label: "Wishlist",     href: slug ? `/store/${slug}/wishlist` : "/wishlist" },
                      ].map(({ icon, label, href }) => (
                        <Link key={href} href={href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-800 transition">
                          <span>{icon}</span>{label}
                        </Link>
                      ))}
                      {isAdmin && (
                        <Link href="/admin"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold hover:bg-yellow-50 transition"
                          style={{ color: "var(--gold)" }}>
                          ⚙️ Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition font-semibold">
                          🚪 Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-full hover:bg-green-50 transition text-gray-700">
              {mobileOpen ? "✕" : "☰"}
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
              className="md:hidden overflow-hidden glass border-t border-white/30"
            >
              <div className="px-4 py-4 flex flex-col gap-1">
                {NAV_LINKS.map(({ label, href }) => (
                  <Link key={href} href={href}
                    className={`px-4 py-3 rounded-xl text-sm font-semibold transition ${
                      pathname === href ? "bg-green-800 text-white" : "text-gray-700 hover:bg-green-50"
                    }`}>
                    {label}
                  </Link>
                ))}
                {user && <>
                  <Link href={slug ? `/store/${slug}/wishlist` : "/wishlist"} className="px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-green-50">❤️ Wishlist</Link>
                  <Link href={slug ? `/store/${slug}/orders` : "/orders"} className="px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-green-50">📦 My Orders</Link>
                  {isAdmin && <Link href="/admin" className="px-4 py-3 rounded-xl text-sm font-semibold hover:bg-yellow-50" style={{color:"var(--gold)"}}>⚙️ Admin</Link>}
                  <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 text-left font-semibold">🚪 Logout</button>
                </>}
                {!user && <Link href="/login" className="btn-primary text-center mt-2">Sign In</Link>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Navbar spacer (only when not scrolled to keep hero full-screen) */}
      <div className="h-16" />
    </>
  );
}
