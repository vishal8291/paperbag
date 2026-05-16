"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../../context/UserContext";
import { authApi } from "../../lib/api";

// ── 6-digit OTP input boxes ──────────────────────────────────
function OtpBoxes({ value, onChange, disabled }) {
  const inputs = React.useRef([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next.trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
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
    if (pasted) { onChange(pasted); inputs.current[Math.min(pasted.length, 5)]?.focus(); }
    e.preventDefault();
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "18px 0" }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          disabled={disabled}
          style={{
            width: "46px", height: "54px", textAlign: "center",
            fontSize: "22px", fontWeight: 700,
            border: digits[i]?.trim() ? "2px solid #2d6a4f" : "2px solid #d4e6d9",
            borderRadius: "10px",
            background: digits[i]?.trim() ? "#f0faf5" : "#fafafa",
            color: "#1a3a2a", outline: "none", transition: "all 0.2s",
            caretColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
          onBlur={(e) => (e.target.style.borderColor = digits[i]?.trim() ? "#2d6a4f" : "#d4e6d9")}
        />
      ))}
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1={1} y1={1} x2={23} y2={23} />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, googleLogin, loginWithOtp, user } = useUser();

  // Method: "password" | "otp"
  const [method, setMethod]         = useState("password");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");

  // Password method
  const [name, setName]             = useState("");
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [showCPw, setShowCPw]       = useState(false);

  // OTP method
  const [otpName, setOtpName]       = useState("");
  const [otpEmail, setOtpEmail]     = useState("");
  const [otpSent, setOtpSent]       = useState(false);
  const [otpCode, setOtpCode]       = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const clearMessages = () => { setError(""); setSuccess(""); };

  // ── Password registration ────────────────────────────────
  const handlePasswordRegister = async (e) => {
    e.preventDefault();
    clearMessages();
    if (password !== confirmPw) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess("Account created! Redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP registration ─────────────────────────────────────
  const handleSendOtp = async () => {
    clearMessages();
    if (!otpName.trim()) return setError("Please enter your name.");
    if (!otpEmail) return setError("Please enter your email.");
    setLoading(true);
    try {
      const res = await authApi.sendOtp({ email: otpEmail, type: "auth", name: otpName });
      if (res.userExists) {
        setError("An account with this email already exists. Please login instead.");
        setLoading(false);
        return;
      }
      setOtpSent(true);
      setResendTimer(60);
      setSuccess("OTP sent! Check your inbox.");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    clearMessages();
    if (otpCode.replace(/\s/g, "").length < 6) return setError("Please enter the complete 6-digit OTP.");
    setLoading(true);
    try {
      const data = await loginWithOtp(otpEmail, otpCode, otpName);
      setSuccess(data.isNew ? "Account created! Welcome to Paperbag 🌿" : "Logged in successfully!");
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      setError(err.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ── Google ────────────────────────────────────────────────
  const handleGoogleResponse = useCallback(async (response) => {
    clearMessages();
    setLoading(true);
    try {
      await googleLogin(response.credential);
      router.push("/");
    } catch (err) {
      setError(err.message || "Google sign-up failed.");
    } finally {
      setLoading(false);
    }
  }, [googleLogin, router]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    const el = document.getElementById("google-register-btn");
    if (!el) return;
    const init = () => {
      window.google?.accounts.id.initialize({ client_id: clientId, callback: handleGoogleResponse });
      window.google?.accounts.id.renderButton(el, { theme: "outline", size: "large", width: 360, text: "signup_with" });
    };
    if (window.google?.accounts) { init(); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = init;
    document.body.appendChild(script);
    return () => { if (script.parentNode) document.body.removeChild(script); };
  }, [handleGoogleResponse]);

  // Password strength check
  const pwStrength = password ? [
    { ok: password.length >= 6,   label: "6+ characters" },
    { ok: /[A-Z]/.test(password), label: "Uppercase letter" },
    { ok: /\d/.test(password),    label: "Number" },
  ] : [];

  const s = {
    page: { minHeight: "100vh", background: "var(--cream, #faf7f2)", display: "flex", alignItems: "stretch" },
    left: {
      flex: "0 0 380px",
      background: "linear-gradient(160deg,#1a3a2a 0%,#2d6a4f 60%,#1a3a2a 100%)",
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "60px 40px", position: "relative", overflow: "hidden",
    },
    right: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" },
    card:  { width: "100%", maxWidth: "440px" },
    label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#1a3a2a" },
    input: {
      width: "100%", padding: "12px 14px", borderRadius: "10px",
      border: "1.5px solid #d4e6d9", fontSize: "15px", color: "#1a3a2a",
      background: "#fff", outline: "none", marginBottom: "14px",
      boxSizing: "border-box", transition: "border-color 0.2s",
    },
    btn: {
      width: "100%", padding: "13px", borderRadius: "10px", border: "none",
      background: "linear-gradient(135deg,#2d6a4f,#1a3a2a)",
      color: "#fff", fontSize: "15px", fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
      transition: "all 0.2s", marginBottom: "8px",
    },
    errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 12px", color: "#b91c1c", fontSize: "13px", marginBottom: "14px" },
    successBox: { background: "#f0faf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "10px 12px", color: "#065f46", fontSize: "13px", marginBottom: "14px" },
    methodTab: (active) => ({
      flex: 1, padding: "10px 8px", borderRadius: "9px", border: "none",
      fontWeight: active ? 700 : 500, fontSize: "13px", cursor: "pointer",
      background: active ? "#fff" : "transparent", color: active ? "#1a3a2a" : "#6b8f74",
      boxShadow: active ? "0 1px 6px rgba(0,0,0,0.1)" : "none", transition: "all 0.2s",
    }),
  };

  return (
    <div style={s.page}>
      {/* Left decorative panel */}
      <div style={s.left} className="auth-left-panel">
        <svg viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: 20, right: -30, width: 200, color: "#fff", opacity: 0.04 }}>
          <path d="M12 2C6.5 2 3 7 3 12s3 9 9 10c0-4 1-7 3-9 2-2 5-3 9-3-1-5-5.5-8-12-8z" fill="currentColor" />
        </svg>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🌿</div>
          <h1 style={{ color: "#faf7f2", fontSize: "30px", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.5px" }}>
            Join Paperbag
          </h1>
          <p style={{ color: "#a8d5b5", fontSize: "15px", lineHeight: 1.6, margin: "0 0 36px" }}>
            Create your account and start shopping eco-friendly bags today.
          </p>

          {[
            { icon: "🎁", text: "Get 10% off your first order" },
            { icon: "📦", text: "Track all your orders in one place" },
            { icon: "💚", text: "Save favourites to your wishlist" },
            { icon: "📧", text: "Exclusive member-only offers" },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
              <span style={{ fontSize: "16px" }}>{icon}</span>
              <span style={{ color: "#d1ead9", fontSize: "14px" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={s.right}>
        <div style={s.card}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 4px" }}>
              Create account
            </h2>
            <p style={{ color: "#6b8f74", fontSize: "14px", margin: 0 }}>
              Join thousands of eco-conscious shoppers
            </p>
          </div>

          {/* Method switcher */}
          <div style={{ display: "flex", background: "#f0f5f1", borderRadius: "12px", padding: "4px", marginBottom: "24px", gap: "2px" }}>
            <button style={s.methodTab(method === "password")} onClick={() => { setMethod("password"); clearMessages(); }}>
              🔒 Password
            </button>
            <button style={s.methodTab(method === "otp")} onClick={() => { setMethod("otp"); clearMessages(); setOtpSent(false); setOtpCode(""); }}>
              ✉️ Email OTP
            </button>
          </div>

          {error   && <div style={s.errorBox}>⚠️ {error}</div>}
          {success && <div style={s.successBox}>✅ {success}</div>}

          {/* ── Password method ── */}
          {method === "password" && (
            <form onSubmit={handlePasswordRegister}>
              <label style={s.label}>Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your full name" style={s.input}
                onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />

              <label style={s.label}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" style={s.input}
                onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />

              <label style={s.label}>Password</label>
              <div style={{ position: "relative", marginBottom: "14px" }}>
                <input type={showPw ? "text" : "password"} required value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  style={{ ...s.input, paddingRight: "44px", marginBottom: 0 }}
                  onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                  onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b8f74", cursor: "pointer", padding: 0 }}>
                  <EyeIcon open={showPw} />
                </button>
              </div>

              {/* Strength hints */}
              {pwStrength.length > 0 && (
                <div style={{ marginBottom: "14px" }}>
                  {pwStrength.map(({ ok, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: ok ? "#065f46" : "#9ca3af", marginBottom: "3px" }}>
                      <span>{ok ? "✓" : "○"}</span>{label}
                    </div>
                  ))}
                </div>
              )}

              <label style={s.label}>Confirm Password</label>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <input type={showCPw ? "text" : "password"} required value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  placeholder="Repeat your password"
                  style={{ ...s.input, paddingRight: "44px", marginBottom: 0,
                    borderColor: confirmPw && confirmPw !== password ? "#fca5a5" : "#d4e6d9" }}
                  onFocus={(e) => (e.target.style.borderColor = confirmPw !== password ? "#fca5a5" : "#2d6a4f")}
                  onBlur={(e) => (e.target.style.borderColor = confirmPw && confirmPw !== password ? "#fca5a5" : "#d4e6d9")} />
                <button type="button" onClick={() => setShowCPw(!showCPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b8f74", cursor: "pointer", padding: 0 }}>
                  <EyeIcon open={showCPw} />
                </button>
              </div>
              {confirmPw && confirmPw !== password && (
                <p style={{ fontSize: "12px", color: "#b91c1c", marginBottom: "10px", marginTop: "-10px" }}>Passwords don&apos;t match</p>
              )}

              <button type="submit" disabled={loading} style={s.btn}>
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>
          )}

          {/* ── OTP method ── */}
          {method === "otp" && (
            <div>
              {!otpSent ? (
                <>
                  <div style={{ background: "#f0faf5", border: "1px solid #a7f3d0", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#065f46", marginBottom: "18px" }}>
                    📧 We&apos;ll send a one-time code to verify your email. No password needed!
                  </div>

                  <label style={s.label}>Full Name</label>
                  <input type="text" value={otpName} onChange={(e) => setOtpName(e.target.value)}
                    placeholder="Your full name" style={s.input}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />

                  <label style={s.label}>Email Address</label>
                  <input type="email" value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)}
                    placeholder="you@example.com" style={s.input}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                    onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                    onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />

                  <button onClick={handleSendOtp} disabled={loading} style={s.btn}>
                    {loading ? "Sending..." : "Send Verification Code →"}
                  </button>
                </>
              ) : (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: "center", marginBottom: "6px" }}>
                    <div style={{ fontSize: "36px", marginBottom: "8px" }}>📬</div>
                    <p style={{ fontSize: "15px", color: "#1a3a2a", fontWeight: 600, margin: "0 0 4px" }}>Check your inbox</p>
                    <p style={{ fontSize: "13px", color: "#6b8f74", margin: 0 }}>
                      Sent to <strong style={{ color: "#1a3a2a" }}>{otpEmail}</strong>
                    </p>
                  </div>

                  <OtpBoxes value={otpCode} onChange={setOtpCode} disabled={loading} />

                  <button type="submit" disabled={loading || otpCode.replace(/\s/g,"").length < 6} style={s.btn}>
                    {loading ? "Creating Account..." : "Verify & Create Account"}
                  </button>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px" }}>
                    <button type="button" onClick={() => { setOtpSent(false); setOtpCode(""); clearMessages(); }}
                      style={{ background: "none", border: "none", color: "#6b8f74", fontSize: "13px", cursor: "pointer", padding: 0 }}>
                      ← Change details
                    </button>
                    <button type="button" onClick={() => { setOtpCode(""); handleSendOtp(); }}
                      disabled={resendTimer > 0 || loading}
                      style={{ background: "none", border: "none", color: resendTimer > 0 ? "#9ca3af" : "#2d6a4f", fontSize: "13px", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 600, padding: 0 }}>
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Google sign-up */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "18px 0 14px", color: "#9ca3af", fontSize: "12px" }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            <span>or sign up with</span>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          <div id="google-register-btn" style={{ display: "flex", justifyContent: "center", minHeight: "44px" }} />

          <p style={{ textAlign: "center", color: "#6b8f74", fontSize: "14px", marginTop: "20px" }}>
            Already have an account?{" "}
            <a href="/login" style={{ color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
            </a>
          </p>

          <p style={{ textAlign: "center", color: "#9ca3af", fontSize: "11px", marginTop: "12px" }}>
            By creating an account, you agree to our{" "}
            <a href="/terms" style={{ color: "#6b8f74" }}>Terms</a> &{" "}
            <a href="/privacy" style={{ color: "#6b8f74" }}>Privacy Policy</a>
          </p>
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
