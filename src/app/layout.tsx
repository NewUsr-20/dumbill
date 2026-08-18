import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// THIS LOCKS THE SCREEN ZOOM SO IT FEELS LIKE A REAL APP
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// THIS CONNECTS YOUR MANIFEST AND APPLE PWA SETTINGS
export const metadata: Metadata = {
  title: "Segmentics | Simple POS for Small Shops",
  description: "Segmentics is a lightning-fast, easy-to-use billing and point-of-sale system designed for small businesses.",
  keywords: ["Segmentics", "POS", "billing app", "small shop POS", "cash register"],
  manifest: "/manifest.json",

  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Segmentics",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
