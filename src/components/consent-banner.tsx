"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

const COPY = {
  en: {
    text: "We use cookies for analytics and, later, ads. You can accept or decline non-essential cookies.",
    accept: "Accept",
    decline: "Decline",
    more: "Privacy",
  },
  ru: {
    text: "Мы используем cookie для аналитики и, позже, рекламы. Необязательные cookie можно принять или отклонить.",
    accept: "Принять",
    decline: "Отклонить",
    more: "Подробнее",
  },
};

const KEY = "iznkit:consent";

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);
  const c = COPY[locale];

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage unavailable — don't nag */
    }
  }, []);

  function choose(granted: boolean) {
    const v = granted ? "granted" : "denied";
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    window.gtag?.("consent", "update", {
      ad_storage: v,
      ad_user_data: v,
      ad_personalization: v,
      analytics_storage: v,
    });
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4">
      <div className="mx-auto max-w-3xl card rounded-xl shadow-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-sm text-[var(--muted)] flex-1">
          {c.text}{" "}
          <Link href={`/${locale}/privacy`} className="text-[var(--accent)] hover:underline">
            {c.more}
          </Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => choose(false)}
            className="btn-outline rounded-lg px-4 py-2 text-sm font-medium"
          >
            {c.decline}
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className="btn-primary rounded-lg px-4 py-2 text-sm font-medium"
          >
            {c.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
