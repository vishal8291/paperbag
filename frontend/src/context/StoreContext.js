"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";

const StoreContext = createContext({
  store: null,
  slug: null,
  isLoading: true,
  error: null,
});

export function StoreProvider({ children, slug: initialSlug }) {
  const params = useParams();
  const pathname = usePathname();
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Resolve slug from parameter first, otherwise from pathname
  const slug = initialSlug || params?.slug || (() => {
    const match = pathname?.match(/^\/store\/([^/]+)/);
    return match ? match[1] : null;
  })();

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      return;
    }

    const fetchStore = async () => {
      try {
        setIsLoading(true);
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${base}/api/stores/slug/${slug}`);
        if (!res.ok) {
          throw new Error("Store not found");
        }
        const data = await res.json();
        setStore(data);
        setError(null);

        // Apply theme colors dynamically
        const primary = data.themeSettings?.primaryColor || "#15803d";
        const secondary = data.themeSettings?.secondaryColor || "#166534";

        document.documentElement.style.setProperty("--green-900", primary);
        document.documentElement.style.setProperty("--green-800", primary); // button primary
        document.documentElement.style.setProperty("--green-700", secondary); // scrollbar/secondary
        
      } catch (err) {
        console.error("StoreContext: Error loading store", err);
        setError(err.message);
        setStore(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [slug]);

  return (
    <StoreContext.Provider value={{ store, slug, isLoading, error }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
