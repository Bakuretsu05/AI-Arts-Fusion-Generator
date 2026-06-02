import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cultural Fusion Concept Generator",
  description: "Generate structured design concepts by combining two cultural or visual traditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 antialiased">
        {children}
        <footer className="py-6 text-center text-xs text-gray-400">
          Cultural Fusion Concept Generator · 曾世賢 · Introduction to AI and Arts 2025
        </footer>
      </body>
    </html>
  );
}
