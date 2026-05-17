import type { Metadata } from "next";
import { Space_Grotesk, Lexend, Roboto } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      className={`${spaceGrotesk.variable} ${lexend.variable} ${roboto.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-white">
        <HelpingHeader />
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
