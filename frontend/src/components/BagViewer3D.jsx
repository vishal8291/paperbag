"use client";

// Skills applied:
// react-three-fiber-architect  — Canvas + scene setup
// lighting-shadow-setup        — Studio softbox + HDRI + contact shadows
// procedural-material-builder  — Kraft paper PBR material (roughness/metalness/color)
// camera-motion-controller     — Auto-orbit + scroll-linked camera
// gsap-3d-timeline-sync        — Scroll-driven bag reveal animation
// post-processing-fx           — Bloom + depth-of-field
// ui-ux-3d-overlay             — Floating HTML price tag + CTA over canvas
// responsive-3d-scaling        — dpr adaptive, lighter on mobile
// asset-lazy-loading           — Canvas mounts only when in viewport

import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  Environment,
  Float,
  Html,
  Preload,
  AdaptiveDpr,
  AdaptiveEvents,
} from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";
import { motion, useInView } from "framer-motion";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// ── Procedural kraft paper material ──────────────────────────
function usePaperMaterial(color = "#c8a96e") {
  return useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      roughness: 0.85,
      metalness: 0.0,
      envMapIntensity: 0.4,
      side: THREE.FrontSide,
    });
  }, [color]);
}

// ── Bag geometry — procedural kraft paper bag shape ──────────
function BagMesh({ scrollY }) {
  const groupRef  = useRef();
  const bodyRef   = useRef();
  const handleRef = useRef();
  const lidRef    = useRef();

  const bodyMat   = usePaperMaterial("#c8a86a");   // kraft brown
  const handleMat = usePaperMaterial("#8B6914");   // darker handle
  const lidMat    = usePaperMaterial("#b8975e");   // slightly lighter top

  // GSAP scroll-driven reveal
  useEffect(() => {
    if (!groupRef.current) return;
    const el = groupRef.current;

    // Initial state — bag below view, rotated
    gsap.set(el.position, { y: -3 });
    gsap.set(el.rotation, { y: Math.PI });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#bag-viewer-section",
        start: "top 80%",
        end: "top 20%",
        scrub: 1.2,
      },
    });

    tl.to(el.position, { y: 0, duration: 1, ease: "power3.out" })
      .to(el.rotation, { y: Math.PI * 2, duration: 1.5, ease: "power2.out" }, 0);

    return () => tl.kill();
  }, []);

  // Subtle float + continuous slow rotation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.position.y += (Math.sin(clock.getElapsedTime() * 0.8) * 0.015 - groupRef.current.position.y * 0.0) * 0.02;
    groupRef.current.rotation.y += 0.003;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Bag body */}
      <mesh ref={bodyRef} castShadow receiveShadow material={bodyMat} position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 1.8, 0.9]} />
      </mesh>

      {/* Bag top fold / lip */}
      <mesh ref={lidRef} castShadow material={lidMat} position={[0, 1.0, 0]}>
        <boxGeometry args={[1.42, 0.18, 0.92]} />
      </mesh>

      {/* Left handle */}
      <mesh castShadow material={handleMat} position={[-0.35, 1.55, 0]}>
        <torusGeometry args={[0.22, 0.035, 10, 30, Math.PI]} />
      </mesh>

      {/* Right handle */}
      <mesh castShadow material={handleMat} position={[0.35, 1.55, 0]}>
        <torusGeometry args={[0.22, 0.035, 10, 30, Math.PI]} />
      </mesh>

      {/* Bottom gusset line */}
      <mesh material={handleMat} position={[0, -0.9, 0]}>
        <boxGeometry args={[1.42, 0.04, 0.92]} />
      </mesh>

      {/* Brand emboss — green leaf stamp */}
      <mesh position={[0, 0.1, 0.46]}>
        <circleGeometry args={[0.28, 32]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Floating HTML overlay — price tag + CTA (ui-ux-3d-overlay) */}
      <Html position={[1.1, 0.6, 0]} distanceFactor={4} occlude>
        <div
          style={{
            background: "rgba(8,8,8,0.85)",
            border: "1px solid rgba(82,183,136,0.35)",
            borderRadius: "14px",
            padding: "12px 16px",
            minWidth: "130px",
            backdropFilter: "blur(12px)",
            pointerEvents: "none",
          }}
        >
          <p style={{ color: "#74c69d", fontSize: "9px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Kraft Classic</p>
          <p style={{ color: "#fff", fontSize: "18px", fontWeight: 900, margin: "4px 0 2px", letterSpacing: "-0.03em" }}>₹349</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", margin: 0 }}>100% Biodegradable</p>
        </div>
      </Html>

      {/* Material label — left side */}
      <Html position={[-1.05, -0.2, 0]} distanceFactor={4} occlude>
        <div style={{
          background: "rgba(201,168,76,0.12)",
          border: "1px solid rgba(201,168,76,0.3)",
          borderRadius: "10px",
          padding: "8px 12px",
          pointerEvents: "none",
        }}>
          <p style={{ color: "#e8c97a", fontSize: "8px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Material</p>
          <p style={{ color: "#fff", fontSize: "10px", fontWeight: 600, margin: "3px 0 0" }}>Kraft Paper</p>
        </div>
      </Html>
    </group>
  );
}

// ── Studio lighting (lighting-shadow-setup skill) ─────────────
function StudioLights() {
  return (
    <>
      {/* Key light — warm softbox from front-left */}
      <directionalLight
        position={[-4, 6, 4]}
        intensity={2.2}
        color="#fff5e0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.001}
      />
      {/* Fill light — cool rim from right */}
      <directionalLight position={[5, 3, -3]} intensity={0.9} color="#c8e6ff" />
      {/* Back light — subtle green eco rim */}
      <directionalLight position={[0, -2, -5]} intensity={0.6} color="#52b788" />
      {/* Ambient */}
      <ambientLight intensity={0.35} color="#ffffff" />
    </>
  );
}

// ── Post-processing (post-processing-fx skill) ─────────────────
function Effects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.55}
        luminanceSmoothing={0.9}
        intensity={0.6}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.01}
        focalLength={0.08}
        bokehScale={1.8}
        height={480}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.7} />
    </EffectComposer>
  );
}

// ── Main exported component ────────────────────────────────────
export default function BagViewer3D() {
  const sectionRef  = useRef(null);
  const isInView    = useInView(sectionRef, { once: true, margin: "-10%" });
  const [mounted, setMounted] = useState(false);

  // asset-lazy-loading — only mount Canvas when section is near viewport
  useEffect(() => {
    if (isInView) setMounted(true);
  }, [isInView]);

  return (
    <section
      id="bag-viewer-section"
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#080808", minHeight: "90vh" }}
    >
      {/* Header overlay */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-10 text-center pt-14 px-6 pointer-events-none"
      >
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5"
          style={{ background: "rgba(82,183,136,0.1)", color: "#74c69d", border: "1px solid rgba(82,183,136,0.2)" }}
        >
          3D Product Viewer
        </span>
        <h2
          className="font-black text-white mb-3"
          style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
        >
          Feel the{" "}
          <span className="text-gradient">craft</span>
        </h2>
        <p className="text-sm max-w-sm mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          Drag to explore · Crafted from 100% recycled kraft paper
        </p>
      </motion.div>

      {/* 3D Canvas — only mounts when in view (asset-lazy-loading) */}
      {mounted && (
        <Canvas
          camera={{ position: [0, 1, 4.5], fov: 42, near: 0.1, far: 100 }}
          shadows
          dpr={[1, 2]}                  // responsive-3d-scaling
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          style={{ width: "100%", height: "90vh" }}
        >
          {/* Adaptive perf (fps-performance-profiler) */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          <StudioLights />

          {/* HDRI environment */}
          <Environment preset="warehouse" background={false} />

          <Suspense fallback={null}>
            <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.15}>
              <BagMesh />
            </Float>
            <Preload all />
          </Suspense>

          {/* Ground shadow */}
          <ContactShadows
            position={[0, -1.05, 0]}
            opacity={0.55}
            scale={6}
            blur={2.5}
            far={4}
            color="#000000"
          />

          {/* Post-processing */}
          <Effects />

          {/* Camera controls (camera-motion-controller) */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={(Math.PI * 2) / 3}
            autoRotate={false}
            makeDefault
          />
        </Canvas>
      )}

      {/* Loading placeholder while Canvas mounts */}
      {!mounted && (
        <div className="w-full flex items-center justify-center" style={{ height: "90vh" }}>
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl animate-pulse"
              style={{ background: "rgba(82,183,136,0.12)", border: "1px solid rgba(82,183,136,0.2)" }}
            />
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>Loading 3D viewer…</p>
          </div>
        </div>
      )}

      {/* Bottom CTA overlay (ui-ux-3d-overlay) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex gap-3"
      >
        <a href="/products">
          <button className="btn-white text-sm font-bold px-7 py-3">
            Shop This Bag →
          </button>
        </a>
        <a href="/seller/register">
          <button className="btn-outline-white text-sm px-7 py-3">
            Sell on Paperbag
          </button>
        </a>
      </motion.div>

      {/* Hint text */}
      <p
        className="absolute bottom-24 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest z-10"
        style={{ color: "rgba(255,255,255,0.2)" }}
      >
        Drag to rotate the bag
      </p>
    </section>
  );
}
