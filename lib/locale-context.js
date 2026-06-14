"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { t as translate, LANGS } from "./i18n";

const LocaleContext = createContext(null);

const STORAGE_KEY = "dundunpildun-locale";

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState("id");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && LANGS.some((l) => l.value === stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((val) => {
    setLocaleState(val);
    localStorage.setItem(STORAGE_KEY, val);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "id" ? "en" : "id");
  }, [locale, setLocale]);

  const t = useCallback(
    (key, params = {}) => translate(locale, key, params),
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t, LANGS }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
