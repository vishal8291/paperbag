"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";
import { useUser } from "../../context/UserContext";

function OtpBoxes({ value, onChange, disabled }) {
  const inputs = React.useRef([]);
  const digits = value.padEnd(6, " ").split("").slice(0, 6);

  const handleKey = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = value.slice(0, i) + value.slice(i + 1);
      onChange(next.trimEnd());
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    else if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus();
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
    <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "20px 0" }}>
      {[0,1,2,3,4,5].map((i) => (
        <input key={i} ref={(el) => (inputs.current[i] = el)}
          type="text" inputMode="numeric" maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleInput(e, i)}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste} disabled={disabled}
          style={{
            width: "46px", height: "54px", textAlign: "center",
            fontSize: "22px", fontWeight: 700,
            border: digits[i]?.trim() ? "2px solid #2d6a4f" : "2px solid #d4e6d9",
            borderRadius: "10px",
            background: digits[i]?.trim() ? "#f0faf5" : "#fafafa",
            color: "#1a3a2a", outline: "none", transition: "all 0.2s", caretColor: "transparent",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
          onBlur={(e) => (e.target.style.borderColor = digits[i]?.trim() ? "#2d6a4f" : "#d4e6d9")}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, resetPassword: ctxReset } = useUser();

  const [step, setStep]             = useState(1); // 1=email, 2=otp, 3=newpw, 4=done
  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [showPw, setShowPw]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => { if (user) router.replace("/"); }, [user, router]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const clearMessages = () => { setError(""); setSuccess(""); };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    clearMessages();
    if (!email) return setError("Please enter your email address.");
    setLoading(true);
    try {
      await authApi.forgotPassword({ email });
      setStep(2);
      setResendTimer(60);
      setSuccess("OTP sent! Check your inbox (and spam).");
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    clearMessages();
    if (otp.replace(/\s/g, "").length < 6) return setError("Please enter the complete 6-digit OTP.");
    setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    clearMessages();
    if (newPw !== confirmPw) return setError("Passwords do not match.");
    if (newPw.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await ctxReset(email, otp, newPw);
      setStep(4);
      setSuccess("Password reset successfully!");
    } catch (err) {
      setError(err.message || "Reset failed. The OTP may be invalid.");
      if (err.message?.toLowerCase().includes("otp")) setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: {
      minHeight: "100vh",
      background: "var(--cream, #faf7f2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 16px",
    },
    card: {
      background: "#fff",
      borderRadius: "20px",
      boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
      padding: "48px 40px",
      width: "100%",
      maxWidth: "440px",
    },
    label: { display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: "#1a3a2a" },
    input: {
      width: "100%", padding: "12px 14px", borderRadius: "10px",
      border: "1.5px solid #d4e6d9", fontSize: "15px", color: "#1a3a2a",
      background: "#fff", outline: "none", marginBottom: "16px",
      boxSizing: "border-box", transition: "border-color 0.2s",
    },
    btn: {
      width: "100%", padding: "13px", borderRadius: "10px", border: "none",
      background: "linear-gradient(135deg,#2d6a4f,#1a3a2a)",
      color: "#fff", fontSize: "15px", fontWeight: 700,
      cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
      transition: "all 0.2s", marginBottom: "8px",
    },
    errorBox: { background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "10px 12px", color: "#b91c1c", fontSize: "13px", marginBottom: "16px" },
    successBox: { background: "#f0faf5", border: "1px solid #6ee7b7", borderRadius: "8px", padding: "10px 12px", color: "#065f46", fontSize: "13px", marginBottom: "16px" },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>
            {step === 4 ? "🎉" : "🔐"}
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 6px" }}>
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Enter OTP"}
            {step === 3 && "New Password"}
            {step === 4 && "All Done!"}
          </h1>
          <p style={{ color: "#6b8f74", fontSize: "14px", margin: 0, lineHeight: 1.5 }}>
            {step === 1 && "Enter your email and we'll send you a reset code."}
            {step === 2 && `We sent a 6-digit code to ${email}`}
            {step === 3 && "Choose a strong new password for your account."}
            {step === 4 && "Your password has been reset successfully."}
          </p>
        </div>

        {/* Progress */}
        {step < 4 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{
                flex: 1, height: "4px", borderRadius: "4px",
                background: step >= n ? "#2d6a4f" : "#e5e7eb",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        )}

        {error   && <div style={s.errorBox}>⚠️ {error}</div>}
        {success && <div style={s.successBox}>✅ {success}</div>}

        {/* Step 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label style={s.label}>Email Address</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" style={s.input}
              onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
              onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />
            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Sending..." : "Send Reset OTP →"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <div>
            <OtpBoxes value={otp} onChange={setOtp} disabled={loading} />
            <button onClick={handleVerifyOtp} disabled={otp.replace(/\s/g,"").length < 6} style={s.btn}>
              Continue →
            </button>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button onClick={() => { setStep(1); setOtp(""); clearMessages(); }}
                style={{ background: "none", border: "none", color: "#6b8f74", fontSize: "13px", cursor: "pointer", padding: 0 }}>
                ← Change email
              </button>
              <button onClick={() => { setOtp(""); handleSendOtp(); }}
                disabled={resendTimer > 0 || loading}
                style={{ background: "none", border: "none", color: resendTimer > 0 ? "#9ca3af" : "#2d6a4f", fontSize: "13px", cursor: resendTimer > 0 ? "default" : "pointer", fontWeight: 600, padding: 0 }}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <form onSubmit={handleReset}>
            <label style={s.label}>New Password</label>
            <div style={{ position: "relative", marginBottom: "16px" }}>
              <input type={showPw ? "text" : "password"} required value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Min. 6 characters"
                style={{ ...s.input, paddingRight: "44px", marginBottom: 0 }}
                onFocus={(e) => (e.target.style.borderColor = "#2d6a4f")}
                onBlur={(e) => (e.target.style.borderColor = "#d4e6d9")} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#6b8f74", cursor: "pointer", padding: 0 }}>
                {showPw ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx={12} cy={12} r={3} />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={18} height={18}>
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                    <line x1={1} y1={1} x2={23} y2={23} />
                  </svg>
                )}
              </button>
            </div>

            {newPw && (
              <div style={{ marginBottom: "16px" }}>
                {[
                  { ok: newPw.length >= 6, label: "At least 6 characters" },
                  { ok: /[A-Z]/.test(newPw), label: "Uppercase letter" },
                  { ok: /\d/.test(newPw), label: "Number" },
                ].map(({ ok, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: ok ? "#065f46" : "#9ca3af", marginBottom: "3px" }}>
                    <span>{ok ? "✓" : "○"}</span>{label}
                  </div>
                ))}
              </div>
            )}

            <label style={s.label}>Confirm New Password</label>
            <input type="password" required value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat your new password"
              style={{ ...s.input, borderColor: confirmPw && confirmPw !== newPw ? "#fca5a5" : "#d4e6d9" }}
              onFocus={(e) => (e.target.style.borderColor = confirmPw !== newPw ? "#fca5a5" : "#2d6a4f")}
              onBlur={(e) => (e.target.style.borderColor = confirmPw && confirmPw !== newPw ? "#fca5a5" : "#d4e6d9")} />

            <button type="submit" disabled={loading} style={s.btn}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ background: "#f0faf5", borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <p style={{ color: "#065f46", fontSize: "15px", margin: 0, lineHeight: 1.6 }}>
                Your password has been reset. You can now sign in with your new password.
              </p>
            </div>
            <button onClick={() => router.push("/login")}
              style={{ ...s.btn, marginBottom: 0 }}>
              Go to Sign In →
            </button>
          </div>
        )}

        {/* Back to login link (steps 1-3) */}
        {step < 4 && (
          <p style={{ textAlign: "center", color: "#6b8f74", fontSize: "14px", marginTop: "20px" }}>
            Remember your password?{" "}
            <a href="/login" style={{ color: "#2d6a4f", fontWeight: 700, textDecoration: "none" }}>
              Sign in →
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
