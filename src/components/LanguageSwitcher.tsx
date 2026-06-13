"use client";

import { useState, useRef, useEffect } from "react";
import { useT, LOCALES, type Locale } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) || LOCALES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-violet-100 px-2.5 py-1.5 rounded-lg transition-colors"
        title="Language"
      >
        <span>🌐</span>
        <span className="hidden sm:inline">{current.flag} {current.label}</span>
        <span className="sm:hidden">{current.flag}</span>
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-44 surface rounded-xl p-1.5 z-50 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code as Locale);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-start transition-colors ${
                l.code === locale ? "bg-white/10 text-white font-semibold" : "text-violet-100 hover:bg-white/5"
              }`}
            >
              <span className="text-base">{l.flag}</span>
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
