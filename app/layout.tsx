import type { Metadata } from "next";
import { Barlow, Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Disport | Premium High-Performance Sportswear",
  description: "Engineered for movement. Discover Disport's collection of technical activewear and athletic apparel for performance, motion, and speed.",
};

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HelpingHeader from "@/components/layout/HelpingHeader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${inter.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white">
        <Providers>
          <HelpingHeader />
          <Navbar />
          <div className="grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
