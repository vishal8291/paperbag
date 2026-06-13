"use client";

import React from "react";
import Navbar        from "./Navbar";
import Footer        from "./Footer";
import AIChatWidget  from "./AIChatWidget";
import PromoBanner   from "./PromoBanner";
import BackToTop     from "./BackToTop";
import { CartProvider }   from "../context/CartContext";
import { SearchProvider } from "../context/SearchContext";
import { UserProvider }   from "../context/UserContext";
import { ToastProvider }  from "../context/ToastContext";

export default function ClientLayout({ children }) {
  return (
    <ToastProvider>
      <UserProvider>
        <CartProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </CartProvider>
      </UserProvider>
    </ToastProvider>
  );
}
