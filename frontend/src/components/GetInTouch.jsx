"use client";

import React, { useState } from "react";
import { FaWhatsapp, FaInstagram, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaCheckCircle } from "react-icons/fa";
import { contactApi } from "../lib/api";

const contactCards = [
  {
    icon: <FaMapMarkerAlt className="text-2xl" />,
    label: "Our Location",
    value: "Mumbai, Maharashtra, India",
    sub: "Visit us anytime",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <FaPhone className="text-2xl" />,
    label: "Call Us",
    value: "+91 82915 69470",
    sub: "Mon–Sat, 9 AM – 7 PM",
    color: "from-teal-500 to-green-600",
    href: "tel:+918291569470",
  },
  {
    icon: <FaEnvelope className="text-2xl" />,
    label: "Email Us",
    value: "vishaltiwari101999@gmail.com",
    sub: "We reply within 24 hrs",
    color: "from-emerald-500 to-teal-600",
    href: "mailto:vishaltiwari101999@gmail.com",
  },
  {
    icon: <FaClock className="text-2xl" />,
    label: "Business Hours",
    value: "Mon – Sat: 9 AM – 7 PM",
    sub: "Sunday: Closed",
    color: "from-green-600 to-emerald-700",
  },
];

const subjectOptions = [
  { value: "", label: "Select a subject" },
  { value: "bulk_order", label: "Bulk / Wholesale Order" },
  { value: "custom_design", label: "Custom Design & Printing" },
  { value: "product_inquiry", label: "Product Inquiry" },
  { value: "order_support", label: "Order Support" },
  { value: "other", label: "Other" },
];

export default function GetInTouch() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      await contactApi.getInTouch(form);
      setStatus("success");
      setForm({ fullName: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send message. Please try again.");
    }
  };

  const inputBase =
    "w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200";

  return (
    <section className="w-screen relative left-1/2 right-1/2 -mx-[50vw] py-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0d2b1a 0%, #1a3a2a 50%, #0f2d1e 100%)" }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #4ade80, transparent 70%)", transform: "translate(30%, -30%)" }} />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #34d399, transparent 70%)", transform: "translate(-30%, 30%)" }} />

      <div className="max-w-7xl mx-auto px-4 relative z-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 border border-emerald-500/30">
            Contact Us
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Get In <span className="text-emerald-400">Touch</span>
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            Have questions about bulk orders, custom designs, or anything else? We&apos;re here to help — reach out anytime.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {contactCards.map((card, i) => (
            <div
              key={i}
              className="relative group rounded-2xl p-5 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-default overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`} />
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {card.icon}
              </div>
              <div className="text-white/50 text-xs uppercase tracking-wider mb-1">{card.label}</div>
              {card.href ? (
                <a href={card.href} className="text-white font-semibold text-sm leading-snug hover:text-emerald-400 transition-colors">
                  {card.value}
                </a>
              ) : (
                <div className="text-white font-semibold text-sm leading-snug">{card.value}</div>
              )}
              <div className="text-white/40 text-xs mt-1">{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Two-column: Social + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

          {/* Left — Social + Map teaser */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Connect With Us</h3>
              <p className="text-white/50 text-sm mb-6">
                Follow us on social media for new arrivals, eco tips, and exclusive deals.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/918291569470"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366]/15 border border-[#25D366]/30 text-[#25D366] px-5 py-3 rounded-xl font-semibold text-sm hover:bg-[#25D366]/25 transition-all duration-200"
                >
                  <FaWhatsapp className="text-xl" />
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/vishaltiwari101999/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-pink-500/15 border border-pink-500/30 text-pink-400 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-pink-500/25 transition-all duration-200"
                >
                  <FaInstagram className="text-xl" />
                  Instagram
                </a>
              </div>
            </div>

            {/* Quick note */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
              <div className="text-emerald-400 font-bold text-base mb-2">🛍️ Bulk Orders?</div>
              <p className="text-white/60 text-sm leading-relaxed">
                Planning a large order for events, gifting, or retail? We offer special pricing for bulk purchases. Mention your quantity in the message and we&apos;ll get back to you with a custom quote.
              </p>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-white/50 text-sm">We typically respond within <span className="text-emerald-400 font-semibold">4–6 hours</span> on business days</span>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-6">
                    <FaCheckCircle className="text-4xl text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-2xl mb-2">Message Sent!</h3>
                  <p className="text-white/60 text-sm mb-8 max-w-xs">
                    Thanks for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors duration-200"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-white font-bold text-xl mb-6">Send Us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 XXXXX XXXXX"
                          className={inputBase}
                        />
                      </div>
                      <div>
                        <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">Subject *</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className={inputBase + " cursor-pointer"}
                          style={{ colorScheme: "dark" }}
                        >
                          {subjectOptions.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#1a3a2a] text-white">
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/70 text-xs font-semibold uppercase tracking-wider block mb-1.5">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        placeholder="Tell us about your requirements, quantity needed, or any questions..."
                        required
                        maxLength={500}
                        rows={4}
                        className={inputBase + " resize-none"}
                      />
                      <div className="text-right text-xs text-white/30 mt-1">{form.message.length}/500</div>
                    </div>

                    {status === "error" && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl text-base transition-all duration-200 shadow-lg shadow-emerald-900/40"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
