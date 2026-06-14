"use client";

import { useLocale } from "@/lib/locale-context";

export default function LanguageSwitch() {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      onClick={toggleLocale}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 text-xs sm:text-sm font-medium shadow-sm hover:bg-white transition active:scale-95 touch-manipulation"
      title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      {locale === "id" ? "EN" : "ID"}
    </button>
  );
}
