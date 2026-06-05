import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Geist } from "next/font/google";
import { Cormorant_Garamond, Amatic_SC, Gruppo, Great_Vibes } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// --- Citymap poster fonts (match the momenterie editor faces) ---
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const amatic = Amatic_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-amatic",
  display: "swap",
});

const gruppo = Gruppo({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-gruppo",
  display: "swap",
});

// Script substitute for the proprietary "Blooming Delightful Momenterie".
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Momenterie | Museum Quality Keepsakes",
  description: "Premium personalized maps, star charts, and jewelry designed for the spaces that matter most.",
  keywords: ["personalized gifts", "custom maps", "star maps", "city maps", "photo puzzles", "custom jewelry"],
  authors: [{ name: "Momenterie" }],
  openGraph: {
    title: "Momenterie | Museum Quality Keepsakes",
    description: "Premium personalized maps, star charts, and jewelry designed for the spaces that matter most.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${playfair.variable} ${geist.variable} ${cormorant.variable} ${amatic.variable} ${gruppo.variable} ${greatVibes.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex flex-col pt-[72px]">{children}</main>
        <Footer />
        <CartDrawer />
        <NewsletterPopup />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
