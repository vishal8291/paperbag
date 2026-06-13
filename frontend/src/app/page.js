"use client";

import React from "react";
import HeroSection from "../components/HeroSection";
import ImageCarousel from "../components/ImageCarousel";
import FeatureImages from "../components/FeatureImages";
import WhyChooseUs from "../components/WhyChooseUs";
import CategoriesSection from "../components/CategoriesSection";
import HowItWorks from "../components/HowItWorks";
import TrustBadges from "../components/TrustBadges";
import ProductCollection from "../components/ProductCollection";
import SustainabilityStats from "../components/SustainabilityStats";
import Commitment from "../components/Commitment";
import Testimonials from "../components/Testimonials";
import NewsletterSubscription from "../components/NewsletterSubscription";

// Page flow (Shopify-inspired dark cinematic):
// 1. Hero — "Be the store they shop from"
// 2. Products — curated eco products
// 3. WhyChooseUs — multi-channel + features grid
// 4. CategoriesSection — scrolling category icon wall
// 5. SustainabilityStats — big numbers + order card
// 6. Commitment — Leaf AI sidekick
// 7. TrustBadges — CSS globe "rock steady blazing fast"
// 8. Testimonials — seller success stories
// 9. HowItWorks — "Build fast" seller+buyer steps
// 10. Newsletter

export default function Home() {
  return (
    <div style={{ background: "var(--bg-0)" }}>
      <HeroSection />
      <ImageCarousel />
      <FeatureImages />
      <ProductCollection />
      <WhyChooseUs />
      <CategoriesSection />
      <SustainabilityStats />
      <Commitment />
      <TrustBadges />
      <Testimonials />
      <HowItWorks />
      <NewsletterSubscription />
    </div>
  );
}
