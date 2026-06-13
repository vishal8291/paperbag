"use client";

import React from "react";

const SLIDES = [
  { src: "/backpack.png",  alt: "Eco Backpack",       label: "Eco Backpack",    tag: "New" },
  { src: "/tote.png",      alt: "Canvas Tote",         label: "Canvas Tote",     tag: "Bestseller" },
  { src: "/custom.jpeg",   alt: "Custom Printed Bag",  label: "Custom Print",    tag: "Popular" },
  { src: "/fashion.png",   alt: "Fashion Bag",         label: "Fashion Edit",    tag: "Trending" },
  { src: "/bag1.png",      alt: "Eco Tote Bag",        label: "Eco Tote",        tag: "Eco" },
  { src: "/bag2.png",      alt: "Kraft Paper Bag",     label: "Kraft Classic",   tag: "Classic" },
  { src: "/bag3.png",      alt: "Gift Bag",            label: "Gift Luxury",     tag: "Gift" },
  { src: "/bag4.png",      alt: "Shopping Bag",        label: "Shopping Bag",    tag: "Sale" },
  { src: "/eco.png",       alt: "Biodegradable Bag",   label: "Biodegradable",   tag: "Green" },
  { src: "/3d.png",        alt: "3D Designer Bag",     label: "3D Designer",     tag: "Limited" },
];

const ITEMS = [...SLIDES, ...SLIDES];

export default function ImageCarousel() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--bg-0)", padding: "5rem 0 6rem" }}
    >
      {/* Header */}
      <div className="text-center mb-12 px-6">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
          style={{
            background: "rgba(82,183,136,0.1)",
            color: "#74c69d",
            border: "1px solid rgba(82,183,136,0.2)",
          }}
        >
          Our Collection
        </span>
        <h2
          className="font-black text-white"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          Bags for every{" "}
          <span className="text-gradient">occasion</span>
        </h2>
      </div>

      {/* Fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--bg-0) 20%, transparent)" }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--bg-0) 20%, transparent)" }}
      />

      {/* Track */}
      <div className="overflow-hidden">
        <div
          className="flex"
          style={{
            gap: "20px",
            width: "max-content",
            animation: "carousel-scroll 40s linear infinite",
          }}
        >
          {ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative shrink-0 overflow-hidden cursor-pointer group"
              style={{
                width: "clamp(280px, 28vw, 420px)",
                height: "clamp(360px, 36vw, 520px)",
                borderRadius: "20px",
                background: "#111",
              }}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                  transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.06)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onError={e => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />

              {/* Fallback */}
              <div
                className="absolute inset-0 items-center justify-center text-5xl"
                style={{ display: "none", background: "rgba(82,183,136,0.06)" }}
              >
                🛍️
              </div>

              {/* Bottom gradient + label */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-6"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 70%)",
                  pointerEvents: "none",
                }}
              >
                {/* Tag pill */}
                <span
                  className="inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 w-fit"
                  style={{
                    background: "rgba(82,183,136,0.2)",
                    color: "#74c69d",
                    border: "1px solid rgba(82,183,136,0.3)",
                  }}
                >
                  {item.tag}
                </span>
                <p
                  className="font-bold text-white"
                  style={{ fontSize: "1.15rem", letterSpacing: "-0.02em" }}
                >
                  {item.label}
                </p>
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
