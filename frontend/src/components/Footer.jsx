"use client";
import { useState } from "react";
import Link from "next/link";
import { FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { newsletterApi } from "../lib/api";

export default function Footer() {
  const [subEmail,   setSubEmail]   = useState("");
  const [subStatus,  setSubStatus]  = useState(null); // "ok" | "error" | null
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
    <footer style={{ background: "var(--green-950)", color: "rgba(255,255,255,0.75)" }}>
      {/* ── Main footer ── */}
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-black text-white">Paperbag</span>
          </div>
          <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>
            Handcrafted eco-friendly paper bags from Mumbai, India. Every bag is a step towards a greener planet.
          </p>
          <div className="flex gap-3">
            {[
              { icon: FaWhatsapp,   href: "https://wa.me/918291569470", label: "WhatsApp" },
              { icon: FaInstagram,  href: "https://instagram.com/",     label: "Instagram" },
              { icon: FaLinkedinIn, href: "https://linkedin.com/",      label: "LinkedIn" },
              { icon: FaTwitter,    href: "https://twitter.com/",       label: "Twitter" },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:bg-green-700"
                style={{ background: "rgba(255,255,255,0.08)" }}>
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Home",         href: "/" },
              { label: "Products",     href: "/products" },
              { label: "Pricing",      href: "/pricing" },
              { label: "About Us",     href: "/about" },
              { label: "Testimonials", href: "/testimonials" },
              { label: "Contact",      href: "/contact" },
              { label: "FAQ",          href: "/faq" },
            ].map(({ label, href }) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-white inline-block"
                  style={{ color: "rgba(255,255,255,0.6)" }}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Products</h4>
          <ul className="space-y-2.5 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            {["Shopping Bags", "Gift Bags", "Kraft Paper Bags", "Custom Branded", "Luxury Bags", "Bulk Orders"].map(item => (
              <li key={item}>
                <Link href="/products" className="transition hover:text-white">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact Us</h4>
          <div className="space-y-3 text-sm">
            {[
              { icon: "📞", text: "+91 82915 69470",             href: "tel:+918291569470" },
              { icon: "✉️", text: "vishaltiwari101999@gmail.com", href: "mailto:vishaltiwari101999@gmail.com" },
              { icon: "📍", text: "Borivali West, Mumbai 400092" },
            ].map(({ icon, text, href }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5"
                  style={{ background: "rgba(255,255,255,0.08)" }}>{icon}</span>
                {href
                  ? <a href={href} className="transition hover:text-white truncate" style={{ color: "rgba(255,255,255,0.6)" }}>{text}</a>
                  : <span style={{ color: "rgba(255,255,255,0.6)" }}>{text}</span>
                }
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter strip ── */}
      <div style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <p className="text-white font-semibold text-sm">Get exclusive offers 🎉</p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>Subscribe for deals and new arrivals.</p>
          </div>
          <div className="w-full sm:w-auto">
            <form className="flex gap-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="your@email.com"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                required
                disabled={subLoading}
                className="flex-1 sm:w-60 px-4 py-2.5 rounded-full text-sm text-gray-900 focus:outline-none bg-white/90"
              />
              <button
                type="submit"
                disabled={subLoading}
                className="btn-gold text-sm px-5 py-2.5 whitespace-nowrap disabled:opacity-60">
                {subLoading ? "…" : "Subscribe"}
              </button>
            </form>
            {subStatus && (
              <p className="text-xs mt-1.5 text-center"
                style={{ color: subStatus === "ok" ? "#a7f3d0" : "#fca5a5" }}>
                {subMsg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}>
          <span>© {new Date().getFullYear()} Paperbag by Vishal Tiwari. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/terms"   className="transition hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>Terms &amp; Conditions</Link>
            <span style={{ opacity: 0.3 }}>·</span>
            <Link href="/privacy" className="transition hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>Privacy Policy</Link>
            <span style={{ opacity: 0.3 }}>·</span>
            <Link href="/pricing" className="transition hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>Pricing</Link>
            <span style={{ opacity: 0.3 }}>·</span>
            <span>Made with ❤️ in Mumbai 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
