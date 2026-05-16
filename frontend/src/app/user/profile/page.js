"use client";

import React, { useState, useEffect } from "react";
import { useUser }   from "../../../context/UserContext";
import { useRouter } from "next/navigation";
import { authApi }   from "../../../lib/api";
import { useToast }  from "../../../context/ToastContext";

// ── Nav items ────────────────────────────────────────────────
const NAV = [
  { key: "profile",  icon: "👤", label: "My Profile"  },
  { key: "orders",   icon: "📦", label: "My Orders",   href: "/orders"   },
  { key: "wishlist", icon: "❤️", label: "Wishlist",    href: "/wishlist" },
  { key: "pricing",  icon: "💎", label: "My Plan",     href: "/pricing"  },
];

// ── Avatar initials ───────────────────────────────────────────
function Avatar({ user, size = 80 }) {
  const initials = (user?.name || "U")
    .split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const [imgFailed, setImgFailed] = React.useState(false);

  if (user?.avatar && !imgFailed) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "3px solid #fff" }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg,#2d6a4f,#1a3a2a)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 800, color: "#c9a84c",
      border: "3px solid #fff", flexShrink: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    }}>
      {initials}
    </div>
  );
}

export default function UserProfile() {
  const { user, logout, refreshUser, loading } = useUser();
  const router = useRouter();
  const toast  = useToast();

  const [editMode, setEditMode] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [profile,  setProfile]  = useState({ firstName: "", lastName: "", mobile: "" });
  const [activeNav, setActiveNav] = useState("profile");

  useEffect(() => {
    if (!loading && !user) { router.push("/login"); return; }
    if (user) {
      const [first = "", ...rest] = (user.name || "").split(" ");
      setProfile({ firstName: first, lastName: rest.join(" "), mobile: user.mobile || "" });
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authApi.updateProfile({
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        mobile: profile.mobile,
      });
      await refreshUser();
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { logout(); router.push("/login"); };

  if (loading || !user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cream,#faf7f2)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #2d6a4f", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading profile…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "Recently";

  const inputStyle = (editable) => ({
    width: "100%", padding: "11px 14px", borderRadius: "10px",
    border: `1.5px solid ${editable ? "#2d6a4f" : "#e5e7eb"}`,
    fontSize: "14px", color: editable ? "#1a3a2a" : "#6b7280",
    background: editable ? "#fff" : "#f9fafb",
    outline: "none", boxSizing: "border-box",
    fontFamily: "inherit", transition: "all 0.2s",
    cursor: editable ? "text" : "default",
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--cream,#faf7f2)" }}>

      {/* ── Profile hero banner ── */}
      <div style={{ background: "linear-gradient(135deg,#1a3a2a 0%,#2d6a4f 100%)", padding: "40px 24px 80px", position: "relative" }}>
        <svg viewBox="0 0 200 200" fill="none" style={{ position:"absolute",top:-40,right:-40,width:200,opacity:0.07 }}>
          <path d="M100 0C50 0 0 50 0 100s50 100 100 100c0-40 10-70 30-90 20-20 50-30 90-30C220 27 173 0 100 0z" fill="#fff"/>
        </svg>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "20px" }}>
          <Avatar user={user} size={72} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "22px", fontWeight: 800, color: "#faf7f2", margin: 0 }}>{user.name}</h1>
              {user.role === "admin" && (
                <span style={{ background: "#c9a84c", color: "#1a3a2a", fontSize: "11px", fontWeight: 800, padding: "3px 10px", borderRadius: "20px" }}>
                  Admin
                </span>
              )}
              {user.googleId && (
                <span style={{ background: "rgba(255,255,255,0.15)", color: "#a8d5b5", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>
                  Google Account
                </span>
              )}
            </div>
            <p style={{ color: "#a8d5b5", fontSize: "14px", margin: "4px 0 0" }}>{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: "900px", margin: "-44px auto 60px", padding: "0 24px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "20px", alignItems: "start", position: "relative", zIndex: 10 }}>

        {/* ── Sidebar ── */}
        <div>
          {/* Nav card */}
          <div style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
            {NAV.map(({ key, icon, label, href }) => {
              const isActive = activeNav === key;
              return (
                <button key={key}
                  onClick={() => { setActiveNav(key); if (href) router.push(href); }}
                  style={{
                    width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px",
                    background: isActive ? "#f0faf5" : "transparent",
                    border: "none", borderLeft: isActive ? "3px solid #2d6a4f" : "3px solid transparent",
                    cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                    borderBottom: "1px solid #f5f5f5",
                  }}>
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <span style={{ fontSize: "14px", fontWeight: isActive ? 700 : 500, color: isActive ? "#1a3a2a" : "#4b5563" }}>
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Admin link */}
            {user.role === "admin" && (
              <button onClick={() => router.push("/admin")}
                style={{ width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none", borderLeft: "3px solid transparent", borderBottom: "1px solid #f5f5f5", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontSize: "16px" }}>⚙️</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#c9a84c" }}>Admin Dashboard</span>
              </button>
            )}

            {/* Logout */}
            <button onClick={handleLogout}
              style={{ width: "100%", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px", background: "transparent", border: "none", borderLeft: "3px solid transparent", cursor: "pointer", textAlign: "left" }}>
              <span style={{ fontSize: "16px" }}>🚪</span>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>Sign Out</span>
            </button>
          </div>

          {/* Member since card */}
          <div style={{ background: "linear-gradient(135deg,#1a3a2a,#2d6a4f)", borderRadius: "14px", padding: "18px", marginTop: "14px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "6px" }}>🌿</div>
            <p style={{ color: "#a8d5b5", fontSize: "12px", margin: "0 0 2px" }}>Member since</p>
            <p style={{ color: "#faf7f2", fontSize: "14px", fontWeight: 700, margin: 0 }}>{memberSince}</p>
          </div>
        </div>

        {/* ── Main content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Personal info card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <div>
                <h2 style={{ fontSize: "17px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 3px" }}>Personal Information</h2>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0 }}>Update your name and contact details</p>
              </div>
              {!editMode ? (
                <button onClick={() => setEditMode(true)}
                  style={{ background: "#f0faf5", border: "1.5px solid #a7f3d0", color: "#2d6a4f", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                  ✏️ Edit
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setEditMode(false)}
                    style={{ background: "#fff", border: "1.5px solid #e5e7eb", color: "#6b7280", padding: "8px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ background: "linear-gradient(135deg,#2d6a4f,#1a3a2a)", color: "#fff", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Avatar row */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "#f9fafb", borderRadius: "12px", marginBottom: "20px" }}>
              <Avatar user={user} size={56} />
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: "#1a3a2a", margin: "0 0 2px" }}>{user.name}</p>
                <p style={{ fontSize: "13px", color: "#9ca3af", margin: 0, textTransform: "capitalize" }}>
                  {user.role === "admin" ? "Administrator" : "Customer Account"}
                </p>
              </div>
            </div>

            {/* Fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>First Name</label>
                <input type="text" value={profile.firstName} readOnly={!editMode}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  style={inputStyle(editMode)}
                  onFocus={(e) => editMode && (e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Last Name</label>
                <input type="text" value={profile.lastName} readOnly={!editMode}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  style={inputStyle(editMode)}
                  onFocus={(e) => editMode && (e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
              </div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>
                Email Address <span style={{ color: "#9ca3af", fontWeight: 400 }}>(cannot be changed)</span>
              </label>
              <div style={{ position: "relative" }}>
                <input type="email" value={user.email} readOnly style={{ ...inputStyle(false), paddingLeft: "38px" }} />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>✉️</span>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#374151", marginBottom: "5px" }}>Mobile Number</label>
              <div style={{ position: "relative" }}>
                <input type="tel" value={profile.mobile} readOnly={!editMode}
                  placeholder={editMode ? "e.g. +91 98765 43210" : "Not added yet"}
                  onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                  style={{ ...inputStyle(editMode), paddingLeft: "38px" }}
                  onFocus={(e) => editMode && (e.target.style.boxShadow = "0 0 0 3px rgba(45,106,79,0.15)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "15px" }}>📱</span>
              </div>
            </div>
          </div>

          {/* Account details card */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "24px 28px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1.5px solid #f0f0f0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1a3a2a", margin: "0 0 16px" }}>Account Details</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {[
                { label: "Account Type",   value: user.role === "admin" ? "Administrator" : "Customer", icon: "🏷️" },
                { label: "Login Method",   value: user.googleId ? "Google OAuth" : "Email & Password", icon: "🔐" },
                { label: "Account Status", value: "Active",                                             icon: "✅" },
                { label: "Current Plan",   value: "Starter (Free)",                                     icon: "💎" },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: "#f9fafb", borderRadius: "10px", padding: "14px 16px" }}>
                  <div style={{ fontSize: "11px", color: "#9ca3af", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a3a2a", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{icon}</span> {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            {[
              { icon: "📦", label: "View My Orders",    sub: "Track & manage orders", href: "/orders",   color: "#f0faf5", border: "#a7f3d0" },
              { icon: "❤️", label: "My Wishlist",       sub: "Saved products",        href: "/wishlist", color: "#fff5f5", border: "#fca5a5" },
              { icon: "💎", label: "Upgrade Plan",      sub: "Get more benefits",     href: "/pricing",  color: "#fef9f0", border: "#fcd9a0" },
              { icon: "🔐", label: "Change Password",   sub: "Update credentials",    href: "/forgot-password", color: "#f5f3ff", border: "#c4b5fd" },
            ].map(({ icon, label, sub, href, color, border }) => (
              <button key={label} onClick={() => router.push(href)}
                style={{ background: color, border: `1.5px solid ${border}`, borderRadius: "12px", padding: "16px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", transition: "transform 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}>
                <span style={{ fontSize: "24px" }}>{icon}</span>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "#1a3a2a", marginBottom: "2px" }}>{label}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>{sub}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Danger zone */}
          <div style={{ background: "#fff", borderRadius: "16px", padding: "20px 24px", border: "1.5px solid #fee2e2" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#b91c1c", margin: "0 0 8px" }}>Sign Out</h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>You will be logged out of your account on this device.</p>
              <button onClick={handleLogout}
                style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#b91c1c", padding: "9px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", marginLeft: "16px" }}>
                Sign Out →
              </button>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
