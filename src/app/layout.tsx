import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Link from "next/link";
import LayoutShell from "@/components/LayoutShell";
import MobileNav from "@/components/MobileNav";
import LanguageSelector from "@/components/LanguageSelector";
import "./globals.css";

export const metadata: Metadata = {
  title: "190 Nations Office | Global Pastoral Outreach",
  description:
    "Equipping pastors and church leaders across 190 nations with resources, conferences, and partnership through the ministry of Dag Heward-Mills.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "190 Nations",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-110" />
              <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm ring-2 ring-transparent group-hover:ring-amber-500/50 transition-all duration-300">
                190
              </div>
            </div>
            <div>
              <span className="text-white font-bold text-lg hidden sm:block">
                190 Nations Office
              </span>
              <span className="text-white font-bold text-lg sm:hidden">
                190 Nations
              </span>
            </div>
          </Link>
          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2">
            <Link
              href="/"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              Home
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/about"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              About
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/conferences"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              Conferences
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/books"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              Books
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/bible-school"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              Bible School
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/contact"
              className="relative text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
            >
              Connect
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <Link
              href="/give"
              className="relative text-amber-400 hover:text-amber-300 px-3 py-2 text-sm font-medium transition-colors group"
            >
              Give
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-amber-500 transition-all duration-300 rounded-full" />
            </Link>
            <a
              href="/admin"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ml-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Sign In
            </a>
            <LanguageSelector />
          </div>
          {/* Mobile hamburger menu */}
          <MobileNav />
        </div>
      </div>
      {/* Warm gradient line at bottom of navbar */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </nav>
  );
}

function Footer() {
  return (
    <>
      {/* Scripture banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 text-center px-4">
        <p className="text-amber-200/90 italic text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
          &ldquo;Go therefore and make disciples of all nations...&rdquo;
        </p>
        <p className="text-amber-500/70 text-sm mt-2 font-medium">
          — Matthew 28:19
        </p>
      </div>

      <footer className="bg-slate-950 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  190
                </div>
                <span className="text-white font-bold text-lg">
                  190 Nations Office
                </span>
              </div>
              <p className="text-amber-400/70 text-xs font-medium mb-3 ml-[52px]">
                A Ministry of Bishop Dag Heward-Mills
              </p>
              <p className="text-gray-400 text-sm max-w-md">
                Dedicated to equipping pastors and church leaders across every
                nation with resources for effective ministry and church growth.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Quick Links</h4>
              {/* Amber gradient divider */}
              <div className="h-px w-12 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <div className="flex flex-col gap-2">
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/conferences"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Weekly Conference
                </Link>
                <Link
                  href="/books"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Free Books
                </Link>
                <Link
                  href="/bible-school"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Bible School
                </Link>
                <Link
                  href="/give"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Give
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3">Connect</h4>
              {/* Amber gradient divider */}
              <div className="h-px w-12 bg-gradient-to-r from-amber-500 to-transparent mb-3" />
              <div className="flex flex-col gap-2">
                <a
                  href="https://youtube.com/@daghewardmills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  YouTube
                </a>
                <a
                  href="https://facebook.com/daghewardmills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://instagram.com/daghewardmills"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Instagram
                </a>
                <Link
                  href="/admin"
                  className="text-gray-300 hover:text-amber-300 text-sm transition-colors"
                >
                  Host Dashboard
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} 190 Nations Office. All rights
            reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="bg-slate-950 text-white min-h-screen">
        <LayoutShell navbar={<Navbar />} footer={<Footer />}>
          {children}
        </LayoutShell>
        <Script id="sw-register" strategy="afterInteractive">
          {`if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js'); }`}
        </Script>
      </body>
    </html>
  );
}
