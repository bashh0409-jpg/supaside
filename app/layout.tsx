import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import CartProvider from "./components/CartProvider";
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
  title: "Supaside",
  description: "Discover best brands in south africa",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://cdn.visitors.now/v.js" data-token="1c160c9a-d0fa-4abd-a8e6-f82159dab637"></script>
      </head>
      <body className="min-h-full font-sans tracking-tight flex flex-col">
        <SmoothScroll />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
