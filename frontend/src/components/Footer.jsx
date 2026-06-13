"use client";

// Pure black Shopify-style footer — image 13 reference
import { useState } from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { newsletterApi } from "../lib/api";
import { useStore } from "../context/StoreContext";

const COLS = [
  {
    heading: "Paperbag",
    links: [
      { label: "About Us",         href: "/about" },
      { label: "Our Story",        href: "/about" },
      { label: "Sustainability",   href: "/about" },
      { label: "Press",            href: "/contact" },
      { label: "Careers",          href: "/contact" },
    ],
  },
  {
    heading: "Sellers",
    links: [
      { label: "Start Selling",     href: "/seller/register" },
      { label: "Seller Dashboard",  href: "/seller/dashboard" },
      { label: "Seller Analytics",  href: "/seller/analytics" },
      { label: "Pricing & Plans",   href: "/pricing" },
      { label: "Seller Guidelines", href: "/terms" },
    ],
  },
  {
    heading: "Marketplace",
    links: [
      { label: "Browse Stores",   href: "/stores" },
      { label: "All Products",    href: "/products" },
      { label: "Categories",      href: "/products" },
      { label: "New Arrivals",    href: "/products" },
      { label: "Best Sellers",    href: "/products" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center",     href: "/contact" },
      { label: "Contact Us",      href: "/contact" },
      { label: "FAQs",            href: "/contact" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy",  href: "/privacy" },
    ],
  },
];

export default function Footer() {
  const { store, slug } = useStore();
  const [subEmail,   setSubEmail]   = useState("");
  const [subStatus,  setSubStatus]  = useState(null);
  const [subMsg,     setSubMsg]     = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubLoading(true);
    setSubStatus(null);
    try {
      const res = await newsletterApi.subscribe({ email: subEmail.trim() });
      setSubStatus("ok");
      setSubMsg(res.message || "Subscribed!");
      setSubEmail("");
    } catch (err) {
      setSubStatus("error");
      setSubMsg(err.message || "Subscription failed.");
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <footer style={{ background: "#000000", color: "rgba(255,255,255,0.55)" }}>
      {/* ── Main columns ── */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-black text-white">{store?.name || "Paperbag"}</span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.4)" }}>
              {store?.description || "India's marketplace for handcrafted eco-friendly bags and sustainable products. Zero listing fees, zero plastic."}
            </p>
            {/* Social */}
            <div className="flex gap-3 mb-8">
              {[
                { Icon: FaWhatsapp,   href: "https://wa.me/918291569470", label: "WhatsApp" },
                { Icon: FaInstagram,  href: "https://instagram.com/",     label: "Instagram" },
                { Icon: FaTwitter,    href: "https://twitter.com/",       label: "Twitter" },
                { Icon: FaLinkedinIn, href: "https://linkedin.com/",      label: "LinkedIn" },
                { Icon: FaYoutube,    href: "https://youtube.com/",       label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                >
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
            {/* Newsletter mini */}
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                required
                disabled={subLoading}
                className="flex-1 px-3 py-2 rounded-full text-xs text-white bg-white/5 border border-white/10 focus:outline-none focus:border-white/25 placeholder:text-white/25"
              />
              <button
                type="submit"
                disabled={subLoading}
                className="px-4 py-2 rounded-full text-xs font-bold text-black whitespace-nowrap disabled:opacity-50"
                style={{ background: "#fff" }}
              >
                {subLoading ? "…" : "Subscribe"}
              </button>
            </form>
            {subStatus && (
              <p className="text-xs mt-1.5" style={{ color: subStatus === "ok" ? "#74c69d" : "#f87171" }}>
                {subMsg}
              </p>
            )}
          </div>

          {/* Link columns */}
          {COLS.map(({ heading, links }) => (
            <div key={heading}>
              <h4 className="text-white font-bold mb-5 text-sm">{heading}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm transition-colors hover:text-white"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <span>© {new Date().getFullYear()} {store?.name || "Paperbag"}. All rights reserved.</span>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link href="/terms"   className="hover:text-white transition" style={{ color: "rgba(255,255,255,0.35)" }}>Terms</Link>
            <span style={{ opacity: 0.25 }}>·</span>
            <Link href="/privacy" className="hover:text-white transition" style={{ color: "rgba(255,255,255,0.35)" }}>Privacy</Link>
            <span style={{ opacity: 0.25 }}>·</span>
            <Link href="/sitemap.xml" className="hover:text-white transition" style={{ color: "rgba(255,255,255,0.35)" }}>Sitemap</Link>
            <span style={{ opacity: 0.25 }}>·</span>
            <span>Made with ❤️ in Mumbai 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
