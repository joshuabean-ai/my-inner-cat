import type { Metadata, Viewport } from "next";
import { Fraunces, Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "My Inner Cat",
    template: "%s · My Inner Cat",
  },
  description:
    "Which cat lives in you? A watercolor personality quiz that matches you to one of 89 cats.",
  openGraph: {
    title: "My Inner Cat",
    description: "Which cat lives in you? A watercolor personality quiz.",
    url: SITE_URL,
    siteName: "My Inner Cat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Inner Cat",
    description: "Which cat lives in you? A watercolor personality quiz.",
  },
};

export const viewport: Viewport = {
  themeColor: "#F8F4ED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable}`}>
      <body className="min-h-screen bg-cream font-body text-ink-deep antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
