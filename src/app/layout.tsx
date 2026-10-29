import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ASP INTERNATIONAL SCHOOL CITY - Attendance System",
  description: "Digital QR Attendance Management System for ASP International School City",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white">
        {children}
      </body>
    </html>
  );
}
