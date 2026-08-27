import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { getFeaturedArticle } from "@/content/articles";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Be Positive News — Yoxlanılmış yaxşı xəbərlər",
    template: "%s · Be Positive News",
  },
  description:
    "Azərbaycan, dünya, biznes, texnologiya və süni intellekt sahələrində təsdiqlənmiş, ruh yüksəldən xəbərlər.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const trend = getFeaturedArticle().title;

  return (
    <html
      lang="az"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TopBar trend={trend} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
