import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Geist } from "next/font/google";
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
    <html lang="fr" className={`${playfair.variable} ${geist.variable} antialiased`}>
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
