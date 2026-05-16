"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import WhyChooseUs from "../components/WhyChooseUs";
import CategoriesSection from "../components/CategoriesSection";
import HowItWorks from "../components/HowItWorks";
import TrustBadges from "../components/TrustBadges";
import ProductCollection from "../components/ProductCollection";
import SustainabilityStats from "../components/SustainabilityStats";
import Commitment from "../components/Commitment";
import Testimonials from "../components/Testimonials";
import GetInTouch from "../components/GetInTouch";
import NewsletterSubscription from "../components/NewsletterSubscription";
import SubmitTestimonial from "../components/SubmitTestimonial";
import { useSearch } from "../context/SearchContext";

export default function Home() {
  const { searchTerm } = useSearch();
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

  return (
    <div>
      <HeroSection />
      <ProductCollection products={filteredProducts} />
      <TrustBadges />
      <CategoriesSection />
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
