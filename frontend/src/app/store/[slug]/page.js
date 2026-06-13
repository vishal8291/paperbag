"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "../../../components/HeroSection";
import WhyChooseUs from "../../../components/WhyChooseUs";
import CategoriesSection from "../../../components/CategoriesSection";
import HowItWorks from "../../../components/HowItWorks";
import TrustBadges from "../../../components/TrustBadges";
import ProductCollection from "../../../components/ProductCollection";
import SustainabilityStats from "../../../components/SustainabilityStats";
import Commitment from "../../../components/Commitment";
import Testimonials from "../../../components/Testimonials";
import GetInTouch from "../../../components/GetInTouch";
import NewsletterSubscription from "../../../components/NewsletterSubscription";
import SubmitTestimonial from "../../../components/SubmitTestimonial";
import { useSearch } from "../../../context/SearchContext";
import { useStore } from "../../../context/StoreContext";
import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "../../../components/ProductCard";

// ── 12 CUSTOM VECTOR SVG ILLUSTRATIONS ──

function HeroIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#02090a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <circle cx="250" cy="250" r="220" fill="url(#heroGlow)" />
      <circle cx="250" cy="250" r="160" stroke="#38bdf8" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" className="animate-spin" style={{ animationDuration: '40s' }} />
      <circle cx="250" cy="250" r="120" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.5" className="animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
      <g className="animate-bounce" style={{ animationDuration: '6s' }}>
        <circle cx="250" cy="250" r="70" fill="url(#heroGrad1)" opacity="0.95" />
        <circle cx="250" cy="250" r="75" stroke="#ffffff" strokeWidth="2" opacity="0.2" />
        <line x1="250" y1="180" x2="250" y2="320" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
        <line x1="180" y1="250" x2="320" y2="250" stroke="#ffffff" strokeWidth="1.5" opacity="0.4" />
        <circle cx="250" cy="180" r="5" fill="#ffffff" />
        <circle cx="250" cy="320" r="5" fill="#ffffff" />
        <circle cx="180" cy="250" r="5" fill="#ffffff" />
        <circle cx="320" cy="250" r="5" fill="#ffffff" />
        <circle cx="210" cy="210" r="4" fill="#10b981" />
        <circle cx="290" cy="290" r="4" fill="#818cf8" />
      </g>
    </svg>
  );
}

function SpeedIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <path d="M130 350 A 150 150 0 1 1 370 350" stroke="rgba(255,255,255,0.06)" strokeWidth="24" strokeLinecap="round" />
      <path d="M130 350 A 150 150 0 1 1 340 200" stroke="url(#speedGrad)" strokeWidth="24" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset="0" />
      <g transform="translate(250, 250) rotate(75)">
        <polygon points="-8,0 8,0 0,-140" fill="#ffffff" />
        <circle cx="0" cy="0" r="14" fill="#ffffff" />
        <circle cx="0" cy="0" r="6" fill="#02090a" />
      </g>
      <text x="250" y="310" textAnchor="middle" fill="#ffffff" fontSize="48" fontWeight="900">99</text>
      <text x="250" y="345" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="800" letterSpacing="2px">PERFECT SPEED</text>
    </svg>
  );
}

function TypographyIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <linearGradient id="typoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>
      <line x1="50" y1="100" x2="450" y2="100" stroke="rgba(255,255,255,0.05)" />
      <line x1="50" y1="250" x2="450" y2="250" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="50" y1="400" x2="450" y2="400" stroke="rgba(255,255,255,0.05)" />
      <line x1="100" y1="50" x2="100" y2="450" stroke="rgba(255,255,255,0.05)" />
      <line x1="250" y1="50" x2="250" y2="450" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
      <line x1="400" y1="50" x2="400" y2="450" stroke="rgba(255,255,255,0.05)" />
      <circle cx="250" cy="250" r="120" stroke="#6366f1" strokeWidth="1" opacity="0.3" />
      <text x="250" y="340" textAnchor="middle" fill="none" stroke="url(#typoGrad)" strokeWidth="3" fontSize="240" fontWeight="400" fontFamily="sans-serif" style={{ letterSpacing: '-0.05em' }}>Aa</text>
      <rect x="110" y="110" width="280" height="280" stroke="#10b981" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
      <text x="120" y="130" fill="#10b981" fontSize="10" fontFamily="monospace" opacity="0.7">W: 100%</text>
      <text x="120" y="380" fill="#10b981" fontSize="10" fontFamily="monospace" opacity="0.7">H: 1.00</text>
    </svg>
  );
}

function CategoriesIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <g className="animate-pulse">
        <circle cx="160" cy="180" r="70" fill="rgba(99, 102, 241, 0.1)" stroke="#6366f1" strokeWidth="2" />
        <text x="160" y="170" textAnchor="middle" fontSize="32">👕</text>
        <text x="160" y="210" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">Apparel</text>
        <circle cx="340" cy="180" r="75" fill="rgba(16, 185, 129, 0.1)" stroke="#10b981" strokeWidth="2" />
        <text x="340" y="170" textAnchor="middle" fontSize="32">💻</text>
        <text x="340" y="210" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">Tech</text>
        <circle cx="250" cy="320" r="65" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" strokeWidth="2" />
        <text x="250" y="315" textAnchor="middle" fontSize="28">💄</text>
        <text x="250" y="345" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="700">Beauty</text>
      </g>
      <line x1="160" y1="180" x2="340" y2="180" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="5 5" />
      <line x1="160" y1="180" x2="250" y2="320" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="5 5" />
      <line x1="340" y1="180" x2="250" y2="320" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="5 5" />
    </svg>
  );
}

function CatalogIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <rect x="60" y="80" width="380" height="340" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <g transform="translate(90, 110)">
        <rect x="0" y="0" width="140" height="120" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <circle cx="70" cy="50" r="24" fill="rgba(99,102,241,0.2)" />
        <text x="70" y="56" textAnchor="middle" fontSize="20">👜</text>
        <rect x="15" y="90" width="70" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="15" y="103" width="40" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="100" y="90" width="25" height="16" rx="4" fill="#6366f1" />
      </g>
      <g transform="translate(270, 110)">
        <rect x="0" y="0" width="140" height="120" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <circle cx="70" cy="50" r="24" fill="rgba(16,185,129,0.2)" />
        <text x="70" y="56" textAnchor="middle" fontSize="20">👕</text>
        <rect x="15" y="90" width="70" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="15" y="103" width="40" height="6" rx="2" fill="rgba(255,255,255,0.15)" />
        <rect x="100" y="90" width="25" height="16" rx="4" fill="#10b981" />
      </g>
      <rect x="80" y="260" width="340" height="8" rx="4" fill="rgba(255,255,255,0.1)" />
      <path d="M220,330 L225,345 L240,350 L225,355 L220,370 L215,355 L200,350 L215,345 Z" fill="#f59e0b" opacity="0.7" className="animate-pulse" />
      <text x="250" y="310" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="700" letterSpacing="1px" textAnchor="middle">DYNAMIC CATALOG SHELF</text>
    </svg>
  );
}

function DetailsIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <rect x="80" y="80" width="340" height="340" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" />
      <rect x="110" y="120" width="180" height="16" rx="4" fill="#ffffff" opacity="0.8" />
      <rect x="110" y="145" width="280" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="110" y="160" width="220" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
      <text x="110" y="210" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="700">SELECT SIZE</text>
      <g transform="translate(110, 225)">
        <rect x="0" y="0" width="40" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <text x="20" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">S</text>
        <rect x="50" y="0" width="40" height="36" rx="8" fill="#6366f1" />
        <text x="70" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">M</text>
        <rect x="100" y="0" width="40" height="36" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
        <text x="120" y="22" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="700">L</text>
      </g>
      <text x="110" y="300" fill="rgba(255,255,255,0.4)" fontSize="12" fontWeight="700">QUANTITY</text>
      <g transform="translate(110, 315)">
        <rect x="0" y="0" width="120" height="36" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
        <text x="20" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="18">-</text>
        <text x="60" y="22" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="700">1</text>
        <text x="100" y="22" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="18">+</text>
      </g>
      <rect x="110" y="370" width="280" height="36" rx="18" fill="#10b981" />
      <text x="250" y="392" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="800" letterSpacing="1px">ADD TO CART</text>
    </svg>
  );
}

function CartIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M170 180 L190 380 L310 380 L330 180 Z" fill="url(#cartGrad)" opacity="0.9" />
      <path d="M210 180 A 40 40 0 0 1 290 180" stroke="#ffffff" strokeWidth="6" fill="none" />
      <g transform="translate(210, 110)">
        <rect x="0" y="0" width="80" height="60" rx="8" fill="#10b981" />
        <path d="M25 30 L35 40 L55 20" stroke="#ffffff" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      <g transform="translate(300, 220) rotate(15)">
        <rect x="0" y="0" width="80" height="32" rx="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        <text x="40" y="20" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" letterSpacing="1px">SAVE20</text>
      </g>
      <circle cx="150" cy="280" r="24" fill="#ef4444" />
      <text x="150" y="284" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="900">₹99</text>
    </svg>
  );
}

function PaymentIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <g transform="translate(100, 160) rotate(-8)" className="animate-bounce" style={{ animationDuration: '5s' }}>
        <rect x="0" y="0" width="280" height="170" rx="16" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
        <rect x="25" y="30" width="38" height="28" rx="6" fill="#f59e0b" opacity="0.8" />
        <text x="25" y="110" fill="#ffffff" fontSize="16" letterSpacing="6px" fontFamily="monospace">••••  ••••  ••••  9582</text>
        <rect x="25" y="135" width="80" height="8" rx="2" fill="#ffffff" opacity="0.4" />
        <circle cx="230" cy="138" r="16" fill="#ff5f00" opacity="0.8" />
        <circle cx="245" cy="138" r="16" fill="#eb001b" opacity="0.8" />
      </g>
      <g transform="translate(320, 270)">
        <circle cx="30" cy="30" r="30" fill="#10b981" />
        <rect x="18" y="24" width="24" height="18" rx="3" fill="#ffffff" />
        <path d="M23 24 V19 A 7 7 0 0 1 37 19 V24" stroke="#ffffff" strokeWidth="2.5" fill="none" />
      </g>
    </svg>
  );
}

function ReceiptIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <g transform="translate(140, 80)">
        <path d="M0 0 L220 0 L220 340 L205 325 L190 340 L175 325 L160 340 L145 325 L130 340 L115 325 L100 340 L85 325 L70 340 L55 325 L40 340 L25 325 L10 340 L0 330 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
        <rect x="25" y="30" width="80" height="12" rx="2" fill="#ffffff" opacity="0.7" />
        <rect x="25" y="52" width="170" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
        <line x1="25" y1="80" x2="195" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <rect x="25" y="100" width="100" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="155" y="100" width="40" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="25" y="125" width="120" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <rect x="155" y="125" width="40" height="8" rx="2" fill="rgba(255,255,255,0.3)" />
        <line x1="25" y1="160" x2="195" y2="160" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" strokeDasharray="3 3" />
        <rect x="25" y="185" width="50" height="12" rx="2" fill="#ffffff" opacity="0.6" />
        <rect x="140" y="185" width="55" height="12" rx="2" fill="#10b981" />
        <circle cx="110" cy="270" r="30" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="2" />
        <path d="M98 270 L106 278 L124 260" stroke="#10b981" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function SellerConsoleIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <rect x="60" y="80" width="380" height="340" rx="16" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" />
      <line x1="100" y1="120" x2="400" y2="120" stroke="rgba(255,255,255,0.03)" />
      <line x1="100" y1="180" x2="400" y2="180" stroke="rgba(255,255,255,0.03)" />
      <line x1="100" y1="240" x2="400" y2="240" stroke="rgba(255,255,255,0.03)" />
      <line x1="100" y1="300" x2="400" y2="300" stroke="rgba(255,255,255,0.03)" />
      <line x1="100" y1="360" x2="400" y2="360" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
      <path d="M100 290 Q 150 260 200 210 T 300 220 T 400 130" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 290 Q 150 260 200 210 T 300 220 T 400 130 L 400 360 L 100 360 Z" fill="url(#chartFill)" opacity="0.1" />
      <circle cx="200" cy="210" r="6" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
      <circle cx="300" cy="220" r="6" fill="#ffffff" stroke="#6366f1" strokeWidth="2" />
      <circle cx="400" cy="130" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#02090a" />
        </linearGradient>
      </defs>
      <text x="100" y="395" fill="#10b981" fontSize="12" fontWeight="700">+34% REVENUE THIS MONTH</text>
    </svg>
  );
}

function InventoryIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <g transform="translate(150, 140)">
        <polygon points="0,80 100,130 100,220 0,170" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <polygon points="100,130 200,80 200,170 100,220" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
        <polygon points="0,80 100,30 200,80 100,130" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.06)" />
        <polygon points="0,80 -50,40 50,-10 100,30" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <polygon points="200,80 250,40 150,-10 100,30" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.08)" />
        <path d="M100,50 L103,60 L113,63 L103,66 L100,76 L97,66 L87,63 L97,60 Z" fill="#f59e0b" opacity="0.8" className="animate-pulse" />
        <path d="M130,20 L132,27 L139,29 L132,31 L130,38 L128,31 L121,29 L128,27 Z" fill="#10b981" opacity="0.6" />
        <path d="M70,25 L71,30 L76,31 L71,32 L70,37 L69,32 L64,31 L69,30 Z" fill="#6366f1" opacity="0.7" />
      </g>
    </svg>
  );
}

function AIChatIllustration() {
  return (
    <svg viewBox="0 0 500 500" fill="none" className="w-full h-full max-h-[340px]">
      <defs>
        <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#02090a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="250" cy="250" r="180" fill="url(#aiGlow)" />
      <rect x="150" y="160" width="200" height="150" rx="40" fill="rgba(255,255,255,0.02)" stroke="#10b981" strokeWidth="3" />
      <line x1="250" y1="160" x2="250" y2="120" stroke="#10b981" strokeWidth="3" />
      <circle cx="250" cy="120" r="10" fill="#10b981" />
      <rect x="130" y="210" width="20" height="50" rx="6" fill="#10b981" opacity="0.6" />
      <rect x="350" y="210" width="20" height="50" rx="6" fill="#10b981" opacity="0.6" />
      <g className="animate-pulse">
        <ellipse cx="205" cy="225" rx="14" ry="10" fill="#10b981" />
        <ellipse cx="295" cy="225" rx="14" ry="10" fill="#10b981" />
        <circle cx="205" cy="225" r="4" fill="#ffffff" />
        <circle cx="295" cy="225" r="4" fill="#ffffff" />
      </g>
      <path d="M210 265 Q250 290 290 265" stroke="#10b981" strokeWidth="4" strokeLinecap="round" fill="none" />
      <g transform="translate(180, 340)">
        <rect x="0" y="15" width="6" height="30" rx="3" fill="#10b981" className="animate-pulse" />
        <rect x="16" y="5" width="6" height="50" rx="3" fill="#10b981" />
        <rect x="32" y="20" width="6" height="20" rx="3" fill="#10b981" />
        <rect x="48" y="10" width="6" height="40" rx="3" fill="#10b981" />
        <rect x="64" y="25" width="6" height="10" rx="3" fill="#10b981" />
      </g>
    </svg>
  );
}

// ── CUSTOM STOREFRONT DASHBOARD ──

function CustomStorefrontDashboard({ products, filteredProducts, slug }) {
  const sections = [
    {
      id: "hero",
      illustration: <HeroIllustration />,
      title: "Be the next AI all-star",
      subtitle: "Unleash next-generation smart commerce. Step into the future of digital retail.",
      badge: "⚡ Next-Gen E-Commerce Enabled",
      primaryCTA: "Shop Now →",
      secondaryCTA: "Contact Us"
    },
    {
      id: "welcome",
      illustration: <SpeedIllustration />,
      title: "A Storefront Built for Speed",
      subtitle: "Experience lightning-fast page transitions, responsive layouts, and optimized media assets.",
      badge: "🚀 High Performance Engine"
    },
    {
      id: "typography",
      illustration: <TypographyIllustration />,
      title: "Neue Haas Grotesk Styling",
      subtitle: "Dense, bold typography with a 1:1 font-size to line-height ratio, creating a premium high-contrast theme.",
      badge: "🎨 Swiss Design Heritage"
    },
    {
      id: "categories",
      illustration: <CategoriesIllustration />,
      title: "Smart Categories & Collections",
      subtitle: "Organized inventory classification allowing shoppers to filter products and find items instantly.",
      badge: "🔍 Intelligent Navigation"
    },
    {
      id: "catalog",
      illustration: <CatalogIllustration />,
      title: "Dynamic Catalog Showcase",
      subtitle: "Your active products rendered dynamically with real-time stock levels, pricing, and wishlists.",
      badge: "🛍️ Live Inventory"
    },
    {
      id: "details",
      illustration: <DetailsIllustration />,
      title: "Product Detail Sheet Overlay",
      subtitle: "Expose product dimensions, variant select menus, and animated action sheets directly to buyers.",
      badge: "✨ Interactive Micro-UX"
    },
    {
      id: "cart",
      illustration: <CartIllustration />,
      title: "Frictionless Cart Drawers",
      subtitle: "Interactive sliding side-carts letting buyers edit quantities and enter coupon keys without page reloads.",
      badge: "🛒 Checkout Optimization"
    },
    {
      id: "checkout",
      illustration: <PaymentIllustration />,
      title: "Unified Secure Gateways",
      subtitle: "Process transactions using cash on delivery or live online card payment integrations securely.",
      badge: "🔒 SSL Secured Portal"
    },
    {
      id: "confirmation",
      illustration: <ReceiptIllustration />,
      title: "Instant Post-Purchase Receipts",
      subtitle: "Clear order summaries, discount logs, and shipment tracking info sent instantly to customers.",
      badge: "✅ High Post-Purchase Trust"
    },
    {
      id: "admin",
      illustration: <SellerConsoleIllustration />,
      title: "The Seller Control Center",
      subtitle: "Launch your storefront in seconds. Real-time revenue trackers, low stock alerts, and order logs.",
      badge: "📊 Seller Insights Hub"
    },
    {
      id: "inventory",
      illustration: <InventoryIllustration />,
      title: "Unified Catalog Manager",
      subtitle: "Create, modify, and delete product listings. Set title descriptions, pricing, and upload images.",
      badge: "📦 Inventory Controller"
    },
    {
      id: "assistant",
      illustration: <AIChatIllustration />,
      title: "Real-time AI Chat Assistant",
      subtitle: "Guide shoppers and handle queries automatically using a custom store-scoped AI assistant.",
      badge: "🤖 Conversational Commerce"
    }
  ];

  return (
    <div className="bg-[#02090a] text-white overflow-hidden" style={{ fontFamily: '"NeueHaasGrotesk", "Inter", sans-serif' }}>
      {sections.map((sec, idx) => {
        const isImageLeft = idx % 2 !== 0;

        return (
          <section
            key={sec.id}
            className="relative py-20 border-b border-white/5 px-6 min-h-[70vh] flex items-center"
            style={{
              background: idx % 2 === 0 ? "#02090a" : "#050b0c"
            }}
          >
            {/* Glowing accent backdrops */}
            <div className={`absolute top-1/4 w-80 h-80 rounded-full blur-[120px] pointer-events-none ${
              isImageLeft ? "left-10 bg-indigo-500/5" : "right-10 bg-emerald-500/5"
            }`} />

            <div className="max-w-7xl mx-auto w-full relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Content Column */}
                <div className={`lg:col-span-5 space-y-6 ${
                  isImageLeft ? "lg:order-2" : "lg:order-1"
                }`}>
                  {/* Badge */}
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#93c5fd" }}>
                    {sec.badge}
                  </span>

                  {/* Title */}
                  <h2
                    className="text-white font-normal tracking-tight"
                    style={{
                      fontSize: "clamp(2rem, 4.5vw, 42px)",
                      lineHeight: "clamp(2rem, 4.5vw, 42px)"
                    }}
                  >
                    {sec.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="text-base text-gray-400 leading-relaxed">
                    {sec.subtitle}
                  </p>

                  {/* Dynamic interactive elements depending on ID */}
                  {sec.id === "hero" && (
                    <div className="flex flex-wrap gap-4 items-center pt-2">
                      <Link href={`/store/${slug}/products`}>
                        <button className="px-7 py-3 font-bold text-sm bg-white text-black rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                          {sec.primaryCTA}
                        </button>
                      </Link>
                      <Link href={`/store/${slug}/contact`}>
                        <button className="px-7 py-3 font-bold text-sm text-white border border-white/20 hover:bg-white/5 rounded-full transition-colors">
                          {sec.secondaryCTA}
                        </button>
                      </Link>
                    </div>
                  )}

                  {sec.id === "catalog" && (
                    <div className="pt-2">
                      {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                          {filteredProducts.slice(0, 2).map((prod) => (
                            <div key={prod._id} className="scale-95 hover:scale-100 transition-transform duration-300">
                              <ProductCard product={prod} />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-gray-400 text-xs">
                          🛍️ No products listed yet in this store.
                        </div>
                      )}
                    </div>
                  )}

                  {sec.id === "categories" && (
                    <div className="pt-2 flex flex-wrap gap-2">
                      {Array.from(new Set(products.map(p => p.category || "General"))).map(cat => (
                        <Link key={cat} href={`/store/${slug}/products?category=${cat}`}>
                          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all">
                            🏷️ {cat}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Mockup Column */}
                <div className={`lg:col-span-7 flex flex-col items-center ${
                  isImageLeft ? "lg:order-1" : "lg:order-2"
                }`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="w-full rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#090f10]/80 backdrop-blur-md"
                  >
                    {/* Simulated Browser Header */}
                    <div className="bg-[#0b1315] px-4 py-2.5 flex items-center justify-between border-b border-white/5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono bg-[#030708] px-4 py-0.5 rounded border border-white/5 w-1/2 text-center truncate select-none">
                        storecraft-dashboard-preview-{sec.id}.svg
                      </div>
                      <div className="w-12" />
                    </div>

                    {/* Viewport Frame showing Crisp SVG Illustration */}
                    <div className="relative group overflow-hidden p-6 flex items-center justify-center bg-[#030708]" style={{ aspectRatio: "16/10" }}>
                      {sec.illustration}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Bottom curve decoration (except last section) */}
            {idx < sections.length - 1 && (
              <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#02090a] rounded-t-[24px] z-20 border-t border-white/5" />
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function Home() {
  const { searchTerm } = useSearch();
  const { slug } = useStore();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${base}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : (data.products || [])))
      .catch(() => setProducts([]));
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      typeof product.name === "string" &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isPaperbag = !slug || slug === "paperbag";

  if (!isPaperbag) {
    return (
      <CustomStorefrontDashboard
        products={products}
        filteredProducts={filteredProducts}
        slug={slug}
      />
    );
  }

  return (
    <div>
      <HeroSection />
      <ProductCollection products={filteredProducts} />
      <TrustBadges />
      <CategoriesSection products={products} />
      <WhyChooseUs />
      <HowItWorks />
      <SustainabilityStats />
      <Commitment />
      <Testimonials />
      <GetInTouch />
      <NewsletterSubscription />
      <SubmitTestimonial />
    </div>
  );
}
