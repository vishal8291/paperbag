"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../lib/api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── On mount: verify stored JWT ───────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    authApi.me()
      .then((userData) => setUser(userData))
      .catch(() => {
        // Token invalid/expired — clear it
        localStorage.removeItem("token");
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Login ─────────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Register ──────────────────────────────────────────────
  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register({ name, email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Google login ──────────────────────────────────────────
  const googleLogin = useCallback(async (credential) => {
    const data = await authApi.google({ credential });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── OTP login / register ──────────────────────────────────
  const loginWithOtp = useCallback(async (email, otp, name) => {
    const data = await authApi.verifyOtp({ email, otp, name });
    localStorage.setItem("token", data.token);
    setUser(data.user);
    return data;
  }, []);

  // ── Reset password ────────────────────────────────────────
  const resetPassword = useCallback(async (email, otp, newPassword) => {
    const data = await authApi.resetPassword({ email, otp, newPassword });
    if (data.token) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
    }
    return data;
  }, []);

  // ── Logout — revokes token server-side, then clears locally ──
  const logout = useCallback(async () => {
    try {
      // Tell the server to blacklist this token (best-effort)
      await authApi.logout();
    } catch {
      // Even if the server call fails, clear client state
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  // ── Refresh user from server ──────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authApi.me();
      setUser(userData);
    } catch {
      logout();
    }
  }, [logout]);

  const isAdmin = user?.role === "admin";

  return (
    <UserContext.Provider value={{ user, setUser, login, register, googleLogin, loginWithOtp, resetPassword, logout, refreshUser, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
}
