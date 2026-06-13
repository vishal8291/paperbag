"use client";

import React from "react";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AIChatWidget from "../../../components/AIChatWidget";
import PromoBanner from "../../../components/PromoBanner";
import BackToTop from "../../../components/BackToTop";
import { StoreProvider, useStore } from "../../../context/StoreContext";

function StoreLayoutInner({ children }) {
  const { store, isLoading, error } = useStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading store...</p>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--cream)" }}>
        <div className="max-w-md w-full text-center card p-8 shadow-xl">
          <span className="text-6xl">🏚️</span>
          <h1 className="text-2xl font-black text-gray-900 mt-6">Store Not Found</h1>
          <p className="text-gray-600 mt-2">
            The store you are looking for does not exist or has been deactivated.
          </p>
          <a href="/" className="btn-primary mt-6 inline-block text-center">
            Back to Platform Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <AIChatWidget />
      <BackToTop />
    </>
  );
}

export default function StoreLayout({ children }) {
  return (
    <StoreProvider>
      <StoreLayoutInner>{children}</StoreLayoutInner>
    </StoreProvider>
  );
}
