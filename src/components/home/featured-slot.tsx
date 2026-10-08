"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { track } from "@/lib/analytics";
import { FEATURED, isoWeek, featuredForWeek } from "@/lib/featured";

/**
 * House-ad slot (IDEAS §H): one of our own tools/guides, rotated by ISO week.
 * Pages are static SSG, so SSR renders the first item deterministically and we
 * swap to the current week's item on mount — rotates weekly without a redeploy.
 */
export function FeaturedSlot({
  locale,
  eyebrow,
  cta,
}: {
  locale: Locale;
  eyebrow: string;
  cta: string;
}) {
  const [item, setItem] = useState(FEATURED[0]);
  useEffect(() => {
    setItem(featuredForWeek(isoWeek(new Date())));
  }, []);

  return (
    <section className="border-b border-[var(--border)] bg-[var(--card)]">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <Link
          href={`/${locale}/${item.href}`}
          onClick={() => track("featured_click", { href: item.href })}
          className="group flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
        >
          <span className="eyebrow shrink-0">{eyebrow}</span>
          <span className="text-xs font-semibold rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-3 py-1 shrink-0">
            {item.badge[locale]}
          </span>
          <span className="min-w-0 flex-1 text-sm">
            <span className="font-semibold group-hover:text-[var(--accent)] transition-colors">
              {item.title[locale]}
            </span>
            <span className="text-[var(--muted)] hidden sm:inline"> — {item.blurb[locale]}</span>
          </span>
          <span className="shrink-0 text-sm font-medium text-[var(--accent)]">{cta} →</span>
        </Link>
      </div>
    </section>
  );
}
