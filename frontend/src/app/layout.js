import React from "react";
import ClientLayout from "../components/ClientLayout";
import "../styles/globals.css";

export const metadata = {
  metadataBase: new URL("https://paperbag.in"),
  title: {
    default: "Paperbag — Eco-Friendly Paper Bags from Mumbai",
    template: "%s | Paperbag",
  },
  description:
    "Shop handcrafted, 100% eco-friendly paper bags for shopping, gifting, and custom branding. Made in Mumbai, shipped across India. Sustainable packaging starts here.",
  keywords: [
    "eco-friendly paper bags",
    "paper bags India",
    "custom paper bags",
    "kraft paper bags",
    "biodegradable bags",
    "gift bags",
    "shopping bags Mumbai",
    "sustainable packaging",
    "bulk paper bags",
    "branded paper bags",
  ],
  authors: [{ name: "Vishal Tiwari", url: "https://paperbag.in" }],
  creator: "Vishal Tiwari",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://paperbag.in",
    siteName: "Paperbag",
    title: "Paperbag — Eco-Friendly Paper Bags from Mumbai",
    description:
      "Handcrafted, 100% eco-friendly paper bags for shopping, gifting, and custom branding. Made in Mumbai, shipped across India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Paperbag — Eco-Friendly Paper Bags",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paperbag — Eco-Friendly Paper Bags from Mumbai",
    description:
      "Shop handcrafted eco-friendly paper bags. Custom branding, bulk orders, pan-India shipping.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#1a3a2a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col" style={{ background: "var(--bg-0)" }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
