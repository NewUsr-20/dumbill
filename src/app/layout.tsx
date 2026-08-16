import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Lock the viewport to prevent double-tap zooming on mobile
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// 2. Link the manifest and add SEO basics
export const metadata: Metadata = {
  title: "Segmentics | Simple POS for Small Shops",
  description: "Create bills in seconds from your phone. Add your menu, tap the items, checkout, and you're done.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Segmentics", // Changed from "Billing"
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}