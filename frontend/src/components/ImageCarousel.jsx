"use client";

import React from "react";
import Image from "next/image";

const SLIDES = [
  { src: "/bag1.png",      alt: "Eco Tote Bag",        label: "Eco Tote" },
  { src: "/bag2.png",      alt: "Craft Paper Bag",      label: "Kraft Classic" },
  { src: "/bag3.png",      alt: "Gift Bag",             label: "Gift Luxury" },
  { src: "/bag4.png",      alt: "Shopping Bag",         label: "Shopping Bag" },
  { src: "/backpack.png",  alt: "Eco Backpack",         label: "Eco Backpack" },
  { src: "/tote.png",      alt: "Canvas Tote",          label: "Canvas Tote" },
  { src: "/custom.jpeg",   alt: "Custom Printed Bag",   label: "Custom Print" },
  { src: "/fashion.png",   alt: "Fashion Bag",          label: "Fashion Edit" },
  { src: "/eco.png",       alt: "Biodegradable Bag",    label: "Biodegradable" },
  { src: "/3d.png",        alt: "3D Designer Bag",      label: "3D Designer" },
];

// Duplicate for seamless infinite loop
const ITEMS = [...SLIDES, ...SLIDES];

export default function ImageCarousel() {
  return (
    <section
      className="relative overflow-hidden py-16"
      style={{ background: "var(--bg-0)" }}
    >
      {/* Section label */}
      <div className="text-center mb-10 px-6">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
          style={{
            background: "rgba(82,183,136,0.1)",
            color: "#74c69d",
            border: "1px solid rgba(82,183,136,0.2)",
          }}
        >
          Our Collection
        </span>
        <h2
          className="text-2xl sm:text-3xl font-black text-white"
          style={{ letterSpacing: "-0.03em" }}
        >
          Bags for every{" "}
          <span className="text-gradient">occasion</span>
        </h2>
      </div>

      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to right, var(--bg-0), transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{
          background: "linear-gradient(to left, var(--bg-0), transparent)",
        }}
      />

      {/* Scrolling track — no scrollbar, CSS animation only */}
      <div className="overflow-hidden">
        <div
          className="flex gap-4"
          style={{
            width: "max-content",
            animation: "carousel-scroll 30s linear infinite",
          }}
        >
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
              style={{
                width: "220px",
                height: "280px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "transform 0.3s ease, border-color 0.3s ease",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
                style={{ transition: "transform 0.5s ease" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onError={e => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              {/* Fallback placeholder */}
              <div
                className="absolute inset-0 items-center justify-center text-4xl"
                style={{ display: "none", background: "rgba(82,183,136,0.06)" }}
              >
                🛍️
              </div>

              {/* Label overlay */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{
                  background: "linear-gradient(to top, rgba(8,8,8,0.85), transparent)",
                }}
              >
                <p className="text-xs font-semibold text-white">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
