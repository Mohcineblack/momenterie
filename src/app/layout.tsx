import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { NewsletterPopup } from "@/components/newsletter/newsletter-popup";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Momenterie - Personalized Gifts & Custom Maps",
  description: "Create beautiful personalized gifts: custom city maps, star maps, photo puzzles, jewelry, and more. Preserve your special moments forever.",
  keywords: ["personalized gifts", "custom maps", "star maps", "city maps", "photo puzzles", "custom jewelry"],
  authors: [{ name: "Momenterie" }],
  openGraph: {
    title: "Momenterie - Personalized Gifts & Custom Maps",
    description: "Create beautiful personalized gifts: custom city maps, star maps, photo puzzles, jewelry, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col antialiased">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <NewsletterPopup />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
