"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const SUGGESTIONS = [
  "What bags do you have?",
  "Can I get custom branding?",
  "How fast is delivery?",
  "What's your cheapest bag?",
];

export default function AIChatWidget() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Leaf 🌿, your Paperbag assistant. How can I help you today?" },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [hasNew,  setHasNew]  = useState(true); // show notification dot initially
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (open) { setTimeout(() => inputRef.current?.focus(), 300); setHasNew(false); }
  }, [open]);

  const sendMessage = async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    setInput("");

    const newMessages = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();

      if (res.status === 503) {
        // AI not configured — give a helpful fallback instead of a cryptic error
        setMessages((prev) => [...prev, {
          role:    "assistant",
          content: "I'm not fully set up yet, but I can still help! 🌿\n\nFor orders, custom bags, or pricing — please visit our **Contact** page or WhatsApp us at **+91 82915 69470**. We reply within a few hours!",
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role:    "assistant",
          content: data.reply || "Sorry, I couldn't process that. Please try again.",
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, {
        role:    "assistant",
        content: "I'm having trouble connecting right now. Please check back soon, or reach us directly at vishaltiwari101999@gmail.com 🙏",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* ── Chat Window ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 right-5 z-50 w-80 sm:w-96 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            style={{ maxHeight: "520px", background: "#fff" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 shrink-0"
              style={{ background: "linear-gradient(135deg, var(--green-900), var(--green-800))" }}>
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                  style={{ background: "rgba(255,255,255,0.15)" }}>🌿</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: "#4ade80" }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Leaf — AI Assistant</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Powered by Claude · Always online</p>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition text-lg">✕</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0"
              style={{ background: "var(--cream)" }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm mr-2 shrink-0 mt-1"
                      style={{ background: "var(--green-100)" }}>🌿</div>
                  )}
                  <div className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: "var(--green-100)" }}>🌿</div>
                  <div className="chat-bubble-ai px-4 py-3 flex gap-1">
                    {[0,1,2].map(n => (
                      <motion.span key={n} className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{ background: "var(--green-600)" }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: n * 0.15 }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions (only at start) */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full border font-medium transition hover:bg-green-50"
                      style={{ borderColor: "var(--green-400)", color: "var(--green-800)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 shrink-0 flex gap-2 items-end"
              style={{ borderTop: "1px solid var(--cream-dark)", background: "#fff" }}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                className="flex-1 resize-none rounded-2xl px-4 py-2.5 text-sm focus:outline-none leading-relaxed"
                style={{
                  background: "var(--cream)",
                  border: "1.5px solid var(--cream-dark)",
                  maxHeight: "100px",
                }}
              />
              <motion.button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0 transition disabled:opacity-40"
                style={{ background: "var(--green-800)" }}>
                ➤
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB Button ── */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white"
        style={{ background: "linear-gradient(135deg, var(--green-800), var(--green-900))" }}
      >
        <AnimatePresence mode="wait">
          <motion.span key={open ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}
            className="text-2xl"
          >
            {open ? "✕" : "🌿"}
          </motion.span>
        </AnimatePresence>

        {/* Notification dot */}
        {!open && hasNew && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
            style={{ background: "#ef4444", color: "#fff" }}>1</motion.span>
        )}
      </motion.button>
    </>
  );
}
