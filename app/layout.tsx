import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "King of Charlotte Cup ⚽ ",
  description:
    "Live soccer tournament dashboard for standings, matches, stats, and champions of the King of Charlotte Cup 2026.",
  keywords: [
    "soccer",
    "tournament",
    "football standings",
    "live scoreboard",
    "Charlotte soccer cup",
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#050b14]`}
    >
      <body className="min-h-full flex flex-col text-white relative overflow-x-hidden">

        {/* Stadium ambient glow */}
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(212,160,72,0.12),transparent_60%)] pointer-events-none" />

        {/* Subtle field pattern */}
        <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] border border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Top stadium light strip */}
        <div className="fixed top-0 left-0 w-full h-24 bg-gradient-to-b from-[#d4a048]/10 to-transparent pointer-events-none" />

        {/* Main app */}
        <main className="relative flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}