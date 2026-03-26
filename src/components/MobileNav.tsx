"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/conferences", label: "Conferences" },
  { href: "/books", label: "Books" },
  { href: "/bible-school", label: "Bible School" },
  { href: "/contact", label: "Connect" },
  { href: "/give", label: "Give" },
];

const mobileLanguages = [
  { code: "EN", label: "EN" },
  { code: "FR", label: "FR" },
  { code: "ES", label: "ES" },
  { code: "PT", label: "PT" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && mobileLanguages.some((l) => l.code === saved)) {
      setLang(saved);
    }
  }, []);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 top-16 z-40">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          {/* Menu */}
          <div className="relative bg-slate-950 border-b border-slate-800 shadow-2xl">
            <div className="flex flex-col px-6 py-4 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-gray-200 hover:text-amber-300 py-3 text-lg font-medium border-b border-slate-800/50 transition-colors flex items-center justify-between"
                >
                  {link.label}
                  <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </Link>
              ))}
              <a
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In
              </a>

              {/* Language selector row */}
              <div className="mt-4 pt-4 border-t border-slate-800/50">
                <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Language</p>
                <div className="grid grid-cols-4 gap-2">
                  {mobileLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        localStorage.setItem("lang", l.code);
                      }}
                      className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                        lang === l.code
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-white/5 text-gray-400 border border-white/10 hover:text-amber-300 hover:border-amber-500/30"
                      }`}
                    >
                      {l.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
