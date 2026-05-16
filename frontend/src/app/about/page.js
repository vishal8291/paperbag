"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

const STATS = [
  { num: "10K+",  label: "Bags Delivered" },
  { num: "500+",  label: "Happy Businesses" },
  { num: "100%",  label: "Eco-Certified" },
  { num: "0",     label: "Plastic Used" },
];

const OFFERS = [
  { icon: "🛍️", title: "Retail & Boutique",      desc: "Branded carry bags that reflect your store's identity and impress every customer." },
  { icon: "🎁", title: "Gift & Event Bags",       desc: "Elegant paper bags for weddings, corporate events, and special occasions." },
  { icon: "🍽️", title: "Food & Restaurant",       desc: "Sturdy, grease-resistant kraft bags for takeaways, bakeries, and food brands." },
  { icon: "🎨", title: "Custom Print & Branding", desc: "Full-colour logo printing, custom sizes, and finish options tailored to your brand." },
  { icon: "📦", title: "Bulk Orders",             desc: "Scalable pricing from 100 to 100,000 units — perfect for manufacturers and distributors." },
  { icon: "♻️", title: "Eco Packaging Consult",  desc: "We help businesses transition from plastic to paper with zero compromise on quality." },
];

const WHY = [
  { icon: "🌿", heading: "100% Recycled Materials",          body: "Every bag starts life as post-consumer recycled paper. No virgin pulp, no forests harmed." },
  { icon: "✏️", heading: "Tailored to Your Brand",           body: "Custom sizes, handles, colours, finishes, and print — designed exactly how you need it." },
  { icon: "💪", heading: "Built to Last",                    body: "Rigorous quality checks ensure every bag holds its shape, load, and look." },
  { icon: "🚀", heading: "Fast, Reliable Delivery",          body: "From order to doorstep in 2–7 days. Real-time tracking included on every order." },
  { icon: "💰", heading: "Competitive Bulk Pricing",         body: "Volume discounts up to 25% — the more you order, the more you save." },
  { icon: "🤝", heading: "Dedicated Support",                body: "A real human responds to every query. No bots, no wait times on Business & Enterprise plans." },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cream,#faf7f2)" }}>

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d6a4f 100%)", padding: "90px 24px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative SVGs */}
        <svg viewBox="0 0 300 300" fill="none" style={{ position:"absolute", top:-60, left:-60, width:300, opacity:0.06 }}>
          <path d="M150 0C75 0 0 75 0 150s75 150 150 150c0-60 15-105 45-135 30-30 75-45 135-45C330 40 260 0 150 0z" fill="#fff"/>
        </svg>
        <svg viewBox="0 0 300 300" fill="none" style={{ position:"absolute", bottom:-60, right:-60, width:300, opacity:0.06, transform:"rotate(180deg)" }}>
          <path d="M150 0C75 0 0 75 0 150s75 150 150 150c0-60 15-105 45-135 30-30 75-45 135-45C330 40 260 0 150 0z" fill="#fff"/>
        </svg>

        <motion.div {...fade()}>
          <span style={{ display:"inline-block", background:"rgba(255,255,255,0.1)", color:"#a8d5b5", fontSize:"13px", fontWeight:600, padding:"6px 16px", borderRadius:"20px", marginBottom:"18px", border:"1px solid rgba(255,255,255,0.15)" }}>
            Our Story
          </span>
          <h1 style={{ fontSize:"clamp(36px,5vw,62px)", fontWeight:900, color:"#faf7f2", margin:"0 0 18px", letterSpacing:"-1.5px", lineHeight:1.1 }}>
            Packaging That's<br />
            <span style={{ color:"#c9a84c" }}>Good for the Planet</span>
          </h1>
          <p style={{ color:"#a8d5b5", fontSize:"18px", maxWidth:"560px", margin:"0 auto 32px", lineHeight:1.7 }}>
            We started Paperbag with one belief — that every business deserves beautiful packaging that doesn't cost the Earth. Literally.
          </p>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/products" style={{ background:"#c9a84c", color:"#1a3a2a", padding:"13px 28px", borderRadius:"10px", fontWeight:800, fontSize:"15px", textDecoration:"none" }}>
              Shop Now →
            </Link>
            <Link href="/contact" style={{ background:"rgba(255,255,255,0.1)", color:"#faf7f2", padding:"13px 28px", borderRadius:"10px", fontWeight:700, fontSize:"15px", textDecoration:"none", border:"1px solid rgba(255,255,255,0.2)" }}>
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #f0f0f0" }}>
        <div style={{ maxWidth:"900px", margin:"0 auto", padding:"0 24px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {STATS.map(({ num, label }, i) => (
            <motion.div key={label} {...fade(i * 0.08)}
              style={{ textAlign:"center", padding:"28px 16px", borderRight: i < 3 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ fontSize:"34px", fontWeight:900, color:"#1a3a2a", lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:"13px", color:"#6b7280", marginTop:"4px", fontWeight:500 }}>{label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Who We Are ── */}
      <section style={{ maxWidth:"1100px", margin:"0 auto", padding:"80px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"64px", alignItems:"center" }}>
          <motion.div {...fade()}>
            <span style={{ display:"inline-block", background:"var(--green-100,#d1fae5)", color:"#166534", fontSize:"12px", fontWeight:700, padding:"5px 14px", borderRadius:"20px", marginBottom:"16px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
              Who We Are
            </span>
            <h2 style={{ fontSize:"clamp(26px,3.5vw,38px)", fontWeight:900, color:"#1a3a2a", margin:"0 0 20px", letterSpacing:"-0.5px", lineHeight:1.2 }}>
              We're on a mission to end plastic packaging — one bag at a time
            </h2>
            <p style={{ fontSize:"15px", color:"#4b5563", lineHeight:1.8, marginBottom:"16px" }}>
              Founded in Mumbai, Paperbag was born out of frustration with plastic waste. We saw businesses — small boutiques to large retailers — still defaulting to plastic because eco-friendly alternatives were either expensive, ugly, or hard to source.
            </p>
            <p style={{ fontSize:"15px", color:"#4b5563", lineHeight:1.8 }}>
              So we built Paperbag: a platform where businesses of every size can order beautiful, durable, fully customisable paper bags at competitive prices, delivered fast, with zero compromise on quality or sustainability.
            </p>
          </motion.div>

          {/* Visual card */}
          <motion.div {...fade(0.15)}>
            <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)", borderRadius:"24px", padding:"40px", position:"relative", overflow:"hidden" }}>
              <svg viewBox="0 0 200 200" fill="none" style={{ position:"absolute", top:-30, right:-30, width:180, opacity:0.08 }}>
                <path d="M100 0C50 0 0 50 0 100s50 100 100 100c0-40 10-70 30-90 20-20 50-30 90-30C220 27 173 0 100 0z" fill="#fff"/>
              </svg>
              <div style={{ fontSize:"48px", marginBottom:"20px" }}>🛍️</div>
              <h3 style={{ fontSize:"22px", fontWeight:800, color:"#faf7f2", marginBottom:"12px" }}>Our Core Belief</h3>
              <p style={{ color:"#a8d5b5", fontSize:"15px", lineHeight:1.7, marginBottom:"28px" }}>
                "Sustainable packaging shouldn't be a luxury. It should be the default."
              </p>
              {[
                "Founded in Mumbai, India",
                "Serving 500+ businesses across India",
                "10,000+ eco bags delivered",
                "500+ trees planted to date",
              ].map((item) => (
                <div key={item} style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
                  <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#c9a84c", flexShrink:0 }} />
                  <span style={{ color:"#d1ead9", fontSize:"14px" }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section style={{ background:"#fff", padding:"72px 24px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"48px" }}>
            <h2 style={{ fontSize:"clamp(24px,3vw,36px)", fontWeight:900, color:"#1a3a2a", margin:"0 0 10px" }}>
              What Drives Us
            </h2>
            <p style={{ color:"#6b7280", fontSize:"16px", maxWidth:"480px", margin:"0 auto" }}>
              Every decision we make is filtered through our mission and vision.
            </p>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px" }}>
            {[
              {
                icon: "🎯",
                label: "Our Mission",
                heading: "Make eco packaging accessible to every business",
                body: "We deliver high-quality, 100% recycled and biodegradable paper bags designed to meet the unique needs of every customer — from a small café to a national retail chain. We believe switching from plastic should be easy, affordable, and rewarding.",
                bg: "#f0faf5",
                border: "#a7f3d0",
              },
              {
                icon: "🌍",
                label: "Our Vision",
                heading: "A world where every business ships plastic-free",
                body: "We envision an India — and a world — where sustainable packaging is simply how things are done. Not because it's mandated, but because businesses genuinely understand its value. Paperbag is our step towards making that world a reality.",
                bg: "#fef9f0",
                border: "#fcd9a0",
              },
            ].map(({ icon, label, heading, body, bg, border }, i) => (
              <motion.div key={label} {...fade(i * 0.1)}>
                <div style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:"20px", padding:"36px 32px", height:"100%" }}>
                  <div style={{ fontSize:"36px", marginBottom:"14px" }}>{icon}</div>
                  <span style={{ fontSize:"11px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em", color:"#9ca3af" }}>{label}</span>
                  <h3 style={{ fontSize:"20px", fontWeight:800, color:"#1a3a2a", margin:"10px 0 14px", lineHeight:1.3 }}>{heading}</h3>
                  <p style={{ fontSize:"14.5px", color:"#4b5563", lineHeight:1.8, margin:0 }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Offer ── */}
      <section style={{ maxWidth:"1100px", margin:"0 auto", padding:"80px 24px" }}>
        <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"48px" }}>
          <span style={{ display:"inline-block", background:"var(--green-100,#d1fae5)", color:"#166534", fontSize:"12px", fontWeight:700, padding:"5px 14px", borderRadius:"20px", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em" }}>
            What We Offer
          </span>
          <h2 style={{ fontSize:"clamp(24px,3vw,36px)", fontWeight:900, color:"#1a3a2a", margin:"0 0 10px" }}>
            A bag for every occasion
          </h2>
          <p style={{ color:"#6b7280", fontSize:"16px", maxWidth:"480px", margin:"0 auto" }}>
            From a single boutique order to a 10,000-unit corporate run — we've got you covered.
          </p>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"16px" }}>
          {OFFERS.map(({ icon, title, desc }, i) => (
            <motion.div key={title} {...fade(i * 0.07)}>
              <div style={{ background:"#fff", borderRadius:"16px", padding:"26px 24px", border:"1.5px solid #f0f0f0", display:"flex", gap:"16px", alignItems:"flex-start", transition:"box-shadow 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                <div style={{ width:"48px", height:"48px", borderRadius:"14px", background:"var(--green-100,#d1fae5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"22px", flexShrink:0 }}>
                  {icon}
                </div>
                <div>
                  <h4 style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a", marginBottom:"6px" }}>{title}</h4>
                  <p style={{ fontSize:"13.5px", color:"#6b7280", lineHeight:1.6, margin:0 }}>{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section style={{ background:"#fff", padding:"80px 24px" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <motion.div {...fade()} style={{ textAlign:"center", marginBottom:"48px" }}>
            <span style={{ display:"inline-block", background:"#fef9f0", color:"#92400e", fontSize:"12px", fontWeight:700, padding:"5px 14px", borderRadius:"20px", marginBottom:"14px", textTransform:"uppercase", letterSpacing:"0.06em", border:"1px solid #fcd9a0" }}>
              Why Paperbag
            </span>
            <h2 style={{ fontSize:"clamp(24px,3vw,36px)", fontWeight:900, color:"#1a3a2a", margin:"0 0 10px" }}>
              Built different, for a reason
            </h2>
          </motion.div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"16px" }}>
            {WHY.map(({ icon, heading, body }, i) => (
              <motion.div key={heading} {...fade(i * 0.07)}>
                <div style={{ padding:"24px", borderRadius:"16px", background:"var(--cream,#faf7f2)", border:"1.5px solid #ede9e0" }}>
                  <div style={{ fontSize:"28px", marginBottom:"12px" }}>{icon}</div>
                  <h4 style={{ fontSize:"15px", fontWeight:700, color:"#1a3a2a", marginBottom:"8px" }}>{heading}</h4>
                  <p style={{ fontSize:"13.5px", color:"#6b7280", lineHeight:1.65, margin:0 }}>{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding:"80px 24px" }}>
        <motion.div {...fade()} style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center" }}>
          <div style={{ background:"linear-gradient(135deg,#1a3a2a,#2d6a4f)", borderRadius:"24px", padding:"56px 40px", position:"relative", overflow:"hidden" }}>
            <svg viewBox="0 0 200 200" fill="none" style={{ position:"absolute",top:-30,right:-30,width:180,opacity:0.07 }}>
              <path d="M100 0C50 0 0 50 0 100s50 100 100 100c0-40 10-70 30-90 20-20 50-30 90-30C220 27 173 0 100 0z" fill="#fff"/>
            </svg>
            <div style={{ fontSize:"44px", marginBottom:"16px" }}>🌿</div>
            <h2 style={{ fontSize:"28px", fontWeight:900, color:"#faf7f2", margin:"0 0 12px" }}>
              Ready to go plastic-free?
            </h2>
            <p style={{ color:"#a8d5b5", fontSize:"16px", margin:"0 0 28px", lineHeight:1.6 }}>
              Join 500+ businesses already making the switch. Browse our range or talk to us for a custom quote.
            </p>
            <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
              <Link href="/products" style={{ background:"#c9a84c", color:"#1a3a2a", padding:"13px 28px", borderRadius:"10px", fontWeight:800, fontSize:"15px", textDecoration:"none" }}>
                Browse Products →
              </Link>
              <Link href="/pricing" style={{ background:"rgba(255,255,255,0.1)", color:"#faf7f2", padding:"13px 28px", borderRadius:"10px", fontWeight:700, fontSize:"15px", textDecoration:"none", border:"1px solid rgba(255,255,255,0.2)" }}>
                View Plans
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <style jsx global>{`
        @media (max-width: 768px) {
          .about-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
