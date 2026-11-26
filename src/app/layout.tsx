import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DemoBanner } from "@/components/site/demo-banner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thok Bazar — Wholesale suppliers for Nepali restaurants",
    template: "%s · Thok Bazar",
  },
  description:
    "Find verified wholesale suppliers in Nepal — poultry farms, rice mills, vegetable traders, bakeries, liquor depots and more. Compare rates, read the terms, and call the supplier directly.",
  keywords: [
    "wholesale supplier Nepal",
    "restaurant supplier Kathmandu",
    "thok bazar",
    "poultry farm Nepal",
    "rice mill Nepal",
    "vegetable wholesale Kathmandu",
    "restaurant supply directory",
  ],
  openGraph: {
    type: "website",
    locale: "en_NP",
    siteName: "Thok Bazar",
    title: "Thok Bazar — Wholesale suppliers for Nepali restaurants",
    description:
      "The directory Nepali restaurant owners use to find poultry farms, rice mills, vegetable traders, bakeries and other wholesale suppliers.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdfcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoDevanagari.variable} antialiased`}>
        <a
          href="#main"
          className="bg-primary text-primary-foreground sr-only z-[100] rounded-md px-4 py-2 text-sm focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <DemoBanner />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
