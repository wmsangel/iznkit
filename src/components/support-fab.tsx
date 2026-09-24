"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CONTACT_EMAIL } from "@/lib/seo/site";
import { track } from "@/lib/analytics";

const CONSENT_KEY = "iznkit:consent";

/**
 * Small bottom-right button that expands into two actions: support (→ donate)
 * and feedback (→ prefilled mailto, no backend). Hidden while the cookie banner
 * is up so two floating elements never stack; it appears the moment consent is
 * chosen (the banner dispatches "iznkit:consent").
 */
export function SupportFab({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).fab;
  const [ready, setReady] = useState(false);
  const [bannerUp, setBannerUp] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setBannerUp(true);
    } catch {
      /* storage unavailable — banner isn't shown either, so keep FAB visible */
    }
    setReady(true);
    const onConsent = () => setBannerUp(false);
    window.addEventListener("iznkit:consent", onConsent);
    return () => window.removeEventListener("iznkit:consent", onConsent);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!ready || bannerUp) return null;

  function feedbackHref(): string {
    const url = typeof window !== "undefined" ? window.location.href : "https://iznkit.com";
    const body = `${t.mailBody}\n\n\n---\n${url}`;
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.mailSubject)}&body=${encodeURIComponent(body)}`;
  }

  const item =
    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-left hover:bg-[var(--card-2)] transition-colors";

  return (
    <div ref={ref} className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open ? (
        <div
          role="menu"
          className="mb-3 w-60 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-lg"
        >
          <Link
            href={`/${locale}/donate`}
            role="menuitem"
            className={`${item} text-[var(--foreground)]`}
            onClick={() => {
              track("fab_action", { action: "support" });
              setOpen(false);
            }}
          >
            <span aria-hidden className="text-lg">♥</span>
            {t.support}
          </Link>
          <a
            href={feedbackHref()}
            role="menuitem"
            className={`${item} text-[var(--foreground)]`}
            onClick={() => {
              track("fab_action", { action: "feedback" });
              setOpen(false);
            }}
          >
            <span aria-hidden className="text-lg">✉</span>
            {t.feedback}
          </a>
        </div>
      ) : null}

      <button
        type="button"
        aria-label={t.aria}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className="btn-primary grid h-12 w-12 place-items-center rounded-full shadow-lg text-xl leading-none"
      >
        <span aria-hidden>{open ? "×" : "♥"}</span>
      </button>
    </div>
  );
}
