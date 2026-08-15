"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

/** Keeps <html lang> in sync with the active UI locale (root layout is above the locale segment). */
export function HtmlLang({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
