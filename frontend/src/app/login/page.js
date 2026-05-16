"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { authApi } from "../../lib/api";

// ── 6-digit OTP input boxes ──────────────────────────────────
function OtpBoxes({ value, onChange, disabled }) {
  const inputs = useRef([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (e, i) => {
    const { key } = e;
    if (key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next.padEnd(Math.max(next.trim().length, 0), "").trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (key === "ArrowRight" && i < 5) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleInput = (e, i) => {
    const char = e.target.value.slice(-1);
    if (!/\d/.test(char)) return;
    const arr = value.replace(/\s/g, "").split("");
    arr[i] = char;
    const next = arr.join("").slice(0, 6);
    onChange(next);
    if (i < 5 && next.length > i) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      onChange(pasted);
      inputs.current[Math.min(pasted.length, 5)]?.focus();
    }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          disabled={disabled}
          style={{
            width: "46px",
            height: "54px",
            textAlign: "center",
            fontSize: "22px",
            fontWeight: 700,
            border: digits[i]?.trim()
              ? "2px solid var(--green-600, #2d6a4f)"
              : "2px solid #d4e6d9",
            borderRadius: "10px",
            background: digits[i]?.trim() ? "#f0faf5" : "#fafafa",
            color: "#1a3a2a",
            outline: "none",
            transition: "all 0.2s",
            caretColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
          onBlur={(e) =>
            (e.target.style.borderColor = digits[i]?.trim() ? "#2d6a4f" : "#d4e6d9")
          }
        />
      ))}
    </div>
  );
}

// ── Small Leaf SVG ────────────────────────────────────────────
function Leaf({ style }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" style={style}>
      <path
        d="M12 2C6.5 2 3 7 3 12s3 9 9 10c0-4 1-7 3-9 2-2 5-3 9-3-1-5-5.5-8-12-8z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}

// ── Eye icon ──────────────────────────────────────────────────
function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx={12} cy={12} r={3} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin, loginWithOtp, user } = useUser();

  const [tab, setTab]               = useState("password"); // "password" | "otp" | "google"
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  // Password tab
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPw, setShowPw]         = useState(false);

  // OTP tab
  const [otpEmail, setOtpEmail]     = useState("");
  const [otpCode, setOtpCode]       = useState("");
  const [otpSent, setOtpSent]       = useState(false);
  const [otpName, setOtpName]       = useState("");
  const [newUserMode, setNewUserMode] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Forgot password
  const [forgotMode, setForgotMode]   = useState(false);
  const [fpEmail, setFpEmail]         = useState("");
  const [fpOtp, setFpOtp]             = useState("");
  const [fpNewPw, setFpNewPw]         = useState("");
  const [fpConfirmPw, setFpConfirmPw] = useState("");
  const [fpStep, setFpStep]           = useState(1); // 1=email, 2=otp, 3=newpw
  const [showFpPw, setShowFpPw]       = useState(false);

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Tab: Password Login ──────────────────────────────────
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // ── Tab: OTP ─────────────────────────────────────────────
  const handleSendOtp = async () => {
    clearMessages();
    if (!otpEmail) return setError("Please enter your email address.");
    setLoading(true);
    try {
      const res = await authApi.sendOtp({ email: otpEmail, type: "auth" });
      setOtpSent(true);
      setNewUserMode(!res.userExists);
      setResendTimer(60);
      setSuccess("OTP sent! Check your inbox (and spam folder).");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otpCode.length < 6) return setError("Please enter the complete 6-digit OTP.");
    if (newUserMode && !otpName.trim()) return setError("Please enter your name.");
    setLoading(true);
    try {
      await loginWithOtp(otpEmail, otpCode, otpName || undefined);
      router.push("/");
    } catch (err) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google callback ───────────────────────────────────────
  const handleGoogleResponse = useCallback(async (response) => {
    clearMessages();
    setLoading(true);
    try {
      await googleLogin(response.credential);
      router.push("/");
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  }, [googleLogin, router]);

  useEffect(() => {
    if (tab !== "google") return;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const el = document.getElementById("google-btn-container");
    if (!el) return;

    const init = () => {
      window.google?.accounts.id.initialize({ client_id: clientId, callback: handleGoogleResponse });
      window.google?.accounts.id.renderButton(el, {
        theme: "outline", size: "large", width: 340, text: "signin_with",
      });
    };

    if (window.google?.accounts) { init(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
    return () => { if (script.parentNode) document.body.removeChild(script); };
  }, [tab, handleGoogleResponse]);

  // ── Forgot password ───────────────────────────────────────
  const handleFpSendOtp = async () => {
    clearMessages();
    if (!fpEmail) return setError("Please enter your email.");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: fpEmail });
      setFpStep(2);
      setResendTimer(60);
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleFpVerifyOtp = async () => {
    clearMessages();
    if (fpOtp.length < 6) return setError("Enter the complete 6-digit OTP.");
    setLoading(true);
    try {
      // Lightweight check — we'll do final verification on reset
      setFpStep(3);
      clearMessages();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFpReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (fpNewPw !== fpConfirmPw) return setError("Passwords do not match.");
    if (fpNewPw.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const { authApi: api } = await import("../../lib/api");
      await api.resetPassword({ email: fpEmail, otp: fpOtp, newPassword: fpNewPw });
      setSuccess("Password reset! You can now log in.");
      setTimeout(() => { setForgotMode(false); setFpStep(1); setTab("password"); clearMessages(); }, 2000);
    } catch (err) {
      setError(err.message || "Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Tab config ────────────────────────────────────────────
  const tabs = [
    { key: "password", label: "Password",  icon: "🔒" },
    { key: "otp",      label: "Email OTP", icon: "✉️" },
    { key: "google",   label: "Google",    icon: "G" },
  ];

  const s = {
    page: {
      minHeight: "100vh",
      background: "var(--cream, #faf7f2)",
      display: "flex",
      alignItems: "stretch",
    },
    left: {
      flex: "0 0 420px",
      background: "linear-gradient(160deg, #1a3a2a 0%, #2d6a4f 60%, #1a3a2a 100%)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "60px 48px",
      position: "relative",
      overflow: "hidden",
    },
    right: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    },
    card: {
      width: "100%",
      maxWidth: "440px",
    },
    tabRow: {
      display: "flex",
      background: "#f0f5f1",
      borderRadius: "12px",
      padding: "4px",
      marginBottom: "28px",
      gap: "2px",
    },
    tabBtn: (active) => ({
      flex: 1,
      padding: "10px 8px",
      borderRadius: "9px",
      border: "none",
      fontWeight: active ? 700 : 500,
      fontSize: "13px",
      cursor: "pointer",
      background: active ? "#fff" : "transparent",
      color: active ? "#1a3a2a" : "#6b8f74",
      boxShadow: active ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
      transition: "all 0.2s",
    }),
    label: {
      display: "block",
      marginBottom: "6px",
      fontSize: "13px",
      fontWeight: 600,
      color: "#1a3a2a",
      letterSpacing: "0.01em",
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      borderRadius: "10px",
      border: "1.5px solid #d4e6d9",
      fontSize: "15px",
      color: "#1a3a2a",
      background: "#fff",
      outline: "none",
      marginBottom: "14px",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    btn: (secondary) => ({
      width: "100%",
      padding: "13px",
      borderRadius: "10px",
      border: secondary ? "1.5px solid #2d6a4f" : "none",
      background: secondary ? "transparent" : "linear-gradient(135deg,#2d6a4f,#1a3a2a)",
      color: secondary ? "#2d6a4f" : "#fff",
      fontSize: "15px",
      fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer",
      opacity: loading ? 0.7 : 1,
      transition: "all 0.2s",
      marginBottom: "8px",
    }),
    errorBox: {
      background: "#fef2f2",
      border: "1px solid #fca5a5",
      borderRadius: "8px",
      padding: "10px 12px",
      color: "#b91c1c",
      fontSize: "13px",
      marginBottom: "14px",
    },
    successBox: {
      background: "#f0faf5",
      border: "1px solid #6ee7b7",
      borderRadius: "8px",
      padding: "10px 12px",
      color: "#065f46",
      fontSize: "13px",
      marginBottom: "14px",
    },
    divider: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      margin: "14px 0",
      color: "#9ca3af",
      fontSize: "12px",
    },
  };

  return (
    <div style={s.page}>
      {/* ── Left panel (hidden on small screens via JS class trick) ── */}
      <div style={s.left} className="auth-left-panel">
        {/* Decorative leaves */}
        <Leaf style={{ position: "absolute", top: 30, right: -20, width: 180, color: "#ffffff", opacity: 0.04 }} />
        <Leaf style={{ position: "absolute", bottom: 60, left: -40, width: 240, color: "#ffffff", opacity: 0.05, transform: "rotate(180deg)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "42px", marginBottom: "12px" }}>🛍️</div>
          <h1 style={{ color: "#faf7f2", fontSize: "32px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-1px" }}>
            Paperbag
          </h1>
          <p style={{ color: "#a8d5b5", fontSize: "16px", lineHeight: 1.6, margin: "0 0 40px" }}>
            Eco-friendly paper bags crafted with care for a sustainable tomorrow.
          </p>

          {[
            { icon: "🌿", text: "100% eco-certified materials" },
            { icon: "🎨", text: "Custom print & branding" },
            { icon: "🚚", text: "Fast delivery across India" },
            { icon: "⭐", text: "10,000+ happy customers" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "18px" }}>{icon}</span>
              <span style={{ color: "#d1ead9", fontSize: "14px" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={s.right}>
        <div style={s.card}>
          {!forgotMode ? (
            <>
              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 4px" }}>
                  Welcome back
                </h2>
                <p style={{ color: "#6b8f74", fontSize: "14px", margin: 0 }}>
                  Sign in to your Paperbag account
                </p>
              </div>

              {/* Tab switcher */}
              <div style={s.tabRow}>
                {tabs.map(({ key, label, icon }) => (
                  <button
                    key={key}
                    style={s.tabBtn(tab === key)}
                    onClick={() => { setTab(key); clearMessages(); setOtpSent(false); setOtpCode(""); }}
                  >
                    <span style={{ marginRight: "5px" }}>{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {error   && <div style={s.errorBox}>⚠️ {error}</div>}
              {success && <div style={s.successBox}>✅ {success}</div>}

              {/* ── Password tab ── */}
              {tab === "password" && (
                <form onSubmit={handlePasswordLogin}>
                  <label style={s.label}>Email Address</label>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={s.input}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                  />

                  <label style={s.label}>Password</label>
                  <div style={{ position: "relative", marginBottom: "6px" }}>
                    <input
                      type={showPw ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      style={{ ...s.input, paddingRight: "44px", marginBottom: 0 }}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                      onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b8f74", cursor: "pointer", padding: 0 }}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>

                  <div style={{ textAlign: "right", marginBottom: "18px" }}>
                    <button type="button" onClick={() => { setForgotMode(true); clearMessages(); setFpEmail(email); }}
                      style={{ background: "none", border: "none", color: "#2d6a4f", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>
                      Forgot password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading} style={s.btn(false)}>
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </form>
              )}

              {/* ── OTP tab ── */}
              {tab === "otp" && (
                <div>
                  {!otpSent ? (
                    <>
                      <label style={s.label}>Email Address</label>
                      <input
                        type="email" value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        placeholder="you@example.com"
                        style={s.input}
                        onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                        onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                        onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                      />
                      <button onClick={handleSendOtp} disabled={loading} style={s.btn(false)}>
                        {loading ? "Sending..." : "Send OTP →"}
                      </button>
                      <p style={{ textAlign: "center", color: "#6b8f74", fontSize: "13px", margin: "10px 0 0" }}>
                        A 6-digit code will be sent to your email
                      </p>
                    </>
                  ) : (
                    <form onSubmit={handleVerifyOtp}>
                      <div style={{ textAlign: "center", marginBottom: "8px" }}>
                        <p style={{ fontSize: "14px", color: "#6b8f74", margin: 0 }}>
                          OTP sent to <strong style={{ color: "#1a3a2a" }}>{otpEmail}</strong>
                        </p>
                      </div>

                      {newUserMode && (
                        <>
                          <div style={{ background: "#f0faf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", color: "#065f46", marginBottom: "14px" }}>
                            👋 New to Paperbag? Enter your name to create your account.
                          </div>
                          <label style={s.label}>Your Name</label>
                          <input
                            type="text" value={otpName}
                            onChange={(e) => setOtpName(e.target.value)}
                            placeholder="Full name"
                            style={s.input}
                            onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                            onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                          />
                        </>
                      )}

                      <label style={{ ...s.label, textAlign: "center" }}>Enter OTP</label>
                      <OtpBoxes value={otpCode} onChange={setOtpCode} disabled={loading} />

                      <button type="submit" disabled={loading || otpCode.replace(/\s/g,"").length < 6} style={s.btn(false)}>
                        {loading ? "Verifying..." : newUserMode ? "Create Account & Sign In" : "Verify & Sign In"}
                      </button>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                        <button type="button" onClick={() => { setOtpSent(false); setOtpCode(""); clearMessages(); }}
                          style={{ background: "none", border: "none", color: "#6b8f74", fontSize: "13px", cursor: "pointer" }}>
                          ← Change email
                        </button>
                        <button type="button" onClick={() => { setOtpCode(""); handleSendOtp(); }}
                          disabled={resendTimer > 0 || loading}
                          style={{ background: "none", border: "none", color: resendTimer > 0 ? "#9ca3af" : "#2d6a4f", fontSize: "13px", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 600 }}>
                          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ── Google tab ── */}
              {tab === "google" && (
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: "#6b8f74", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
                    Sign in securely using your Google account — no password needed.
                  </p>
                  <div id="google-btn-container" style={{ display: "flex", justifyContent: "center", minHeight: "44px" }} />
                  {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                    <p style={{ color: "#9ca3af", fontSize: "13px", marginTop: "12px" }}>
                      Google Sign-In is not configured yet.
                    </p>
                  )}
                </div>
              )}

              {/* Divider + footer */}
              <div style={s.divider}>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
                <span>or</span>
                <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              </div>

              <p style={{ textAlign: "center", color: "#6b8f74", fontSize: "14px", margin: 0 }}>
                Don&apos;t have an account?{" "}
                <a href="/register" style={{ color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>
                  Create one →
                </a>
              </p>
            </>
          ) : (
            /* ── Forgot Password Flow ── */
            <div>
              <button onClick={() => { setForgotMode(false); setFpStep(1); clearMessages(); }}
                style={{ background: "none", border: "none", color: "#6b8f74", cursor: "pointer", fontSize: "14px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px", padding: 0 }}>
                ← Back to login
              </button>

              <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 4px" }}>
                  Reset Password
                </h2>
                <p style={{ color: "#6b8f74", fontSize: "14px", margin: 0 }}>
                  {fpStep === 1 && "We'll send a 6-digit OTP to your email."}
                  {fpStep === 2 && "Enter the OTP we sent to your email."}
                  {fpStep === 3 && "Choose a new password for your account."}
                </p>
              </div>

              {/* Progress dots */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                {[1, 2, 3].map((n) => (
                  <div key={n} style={{
                    flex: 1, height: "4px", borderRadius: "4px",
                    background: fpStep >= n ? "#2d6a4f" : "#e5e7eb",
                    transition: "background 0.3s",
                  }} />
                ))}
              </div>

              {error   && <div style={s.errorBox}>⚠️ {error}</div>}
              {success && <div style={s.successBox}>✅ {success}</div>}

              {fpStep === 1 && (
                <>
                  <label style={s.label}>Email Address</label>
                  <input
                    type="email" value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={s.input}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                  />
                  <button onClick={handleFpSendOtp} disabled={loading} style={s.btn(false)}>
                    {loading ? "Sending..." : "Send Reset OTP →"}
                  </button>
                </>
              )}

              {fpStep === 2 && (
                <>
                  <p style={{ fontSize: "14px", color: "#6b8f74", textAlign: "center", marginBottom: "4px" }}>
                    OTP sent to <strong style={{ color: "#1a3a2a" }}>{fpEmail}</strong>
                  </p>
                  <OtpBoxes value={fpOtp} onChange={setFpOtp} disabled={loading} />
                  <button onClick={handleFpVerifyOtp} disabled={loading || fpOtp.length < 6} style={s.btn(false)}>
                    {loading ? "Verifying..." : "Verify OTP →"}
                  </button>
                  <div style={{ textAlign: "center", marginTop: "8px" }}>
                    <button type="button" onClick={() => { setFpOtp(""); handleFpSendOtp(); }}
                      disabled={resendTimer > 0 || loading}
                      style={{ background: "none", border: "none", color: resendTimer > 0 ? "#9ca3af" : "#2d6a4f", fontSize: "13px", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 600 }}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>
                </>
              )}

              {fpStep === 3 && (
                <form onSubmit={handleFpReset}>
                  <label style={s.label}>New Password</label>
                  <div style={{ position: "relative", marginBottom: "14px" }}>
                    <input
                      type={showFpPw ? "text" : "password"} required
                      value={fpNewPw} onChange={(e) => setFpNewPw(e.target.value)}
                      placeholder="Min. 6 characters"
                      style={{ ...s.input, paddingRight: "44px", marginBottom: 0 }}
                      onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                      onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                    />
                    <button type="button" onClick={() => setShowFpPw(!showFpPw)}
                      style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b8f74", cursor: "pointer", padding: 0 }}>
                      <EyeIcon open={showFpPw} />
                    </button>
                  </div>

                  <label style={s.label}>Confirm Password</label>
                  <input
                    type="password" required value={fpConfirmPw}
                    onChange={(e) => setFpConfirmPw(e.target.value)}
                    placeholder="Repeat password"
                    style={s.input}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")}
                  />

                  {/* Password strength */}
                  {fpNewPw && (
                    <div style={{ marginBottom: "14px" }}>
                      {[
                        { ok: fpNewPw.length >= 6, text: "At least 6 characters" },
                        { ok: /[A-Z]/.test(fpNewPw), text: "Uppercase letter" },
                        { ok: /\d/.test(fpNewPw), text: "Number" },
                      ].map(({ ok, text }) => (
                        <div key={text} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: ok ? "#065f46" : "#9ca3af", marginBottom: "3px" }}>
                          <span>{ok ? "✓" : "○"}</span>{text}
                        </div>
                      ))}
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={s.btn(false)}>
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 768px) {
          .auth-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
