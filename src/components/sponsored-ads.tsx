"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Indoleads AI Ads block (sandbox pilot). EN document/contract pages only.
 * Fetches /api/sponsored?page=<id> on mount (server-side proxy holds the key and
 * the rate caps); renders nothing when there are no cards — which, per the recon,
 * is most of the time. Each card carries a visible "Sponsored" label (required)
 * and an external rel="sponsored nofollow noopener" link used exactly as returned.
 */

interface Card {
  brand: string;
  text: string;
  url: string;
}

export function SponsoredAds({ page }: { page: string }) {
  const [cards, setCards] = useState<Card[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/sponsored?page=${encodeURIComponent(page)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { cards: [] }))
      .then((d: { cards?: Card[] }) => {
        if (alive) setCards(Array.isArray(d.cards) ? d.cards : []);
      })
      .catch(() => {
        if (alive) setCards([]);
      });
    return () => {
      alive = false;
    };
  }, [page]);

  if (!cards || cards.length === 0) return null;

  return (
    <section className="mt-14 max-w-2xl">
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-semibold">Sponsored</h2>
        <span className="text-xs uppercase tracking-wide text-[var(--muted)]">Ad</span>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <li key={c.brand}>
            <a
              href={c.url}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => track("sponsored_click", { page, brand: c.brand })}
              className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium leading-snug group-hover:text-[var(--accent)] transition-colors">
                  {c.brand}
                </span>
                <span className="rounded bg-[var(--border)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[var(--muted)]">
                  Sponsored
                </span>
              </span>
              <span className="mt-2 flex-1 text-sm text-[var(--muted)]">{c.text}</span>
              <span className="mt-3 text-sm font-medium text-[var(--accent)]">Visit →</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
        Sponsored results from a partner ad network, shown by topic.{" "}
        <a href="/en/disclosure" className="underline hover:text-[var(--foreground)]">
          How this works
        </a>
        .
      </p>
    </section>
  );
}
