"use client";

import type { Locale } from "@/lib/i18n/config";
import type { Offer } from "@/lib/affiliates";
import { track } from "@/lib/analytics";

/** Deterministic brand hue (0–360) from the offer name, so each partner keeps a
 *  stable accent colour without storing one per offer. */
function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

/**
 * One clickable partner card. Client component so the click fires a GA4
 * `affiliate_click` event (slot + partner + tool) — the signal that lets us
 * measure which placements actually earn. GA4 attaches page_location itself.
 */
export function AffiliateCard({
  offer,
  locale,
  slot,
  tool,
  visit,
  sponsored,
}: {
  offer: Offer;
  locale: Locale;
  slot?: string;
  tool?: string;
  visit: string;
  sponsored: string;
}) {
  const h = hue(offer.name);
  return (
    <a
      href={offer.url}
      target="_blank"
      rel="sponsored noopener"
      onClick={() =>
        track("affiliate_click", { slot: slot ?? "", partner: offer.name, tool: tool ?? "" })
      }
      className="group relative flex flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-[0_10px_30px_-16px_rgba(0,0,0,0.4)]"
    >
      <span className="absolute right-3 top-3 text-[9px] uppercase tracking-wider text-[var(--muted)] opacity-70">
        {sponsored}
      </span>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-lg text-sm font-bold"
        style={{ color: `hsl(${h} 55% 45%)`, background: `hsl(${h} 60% 50% / 0.13)` }}
      >
        {offer.name.charAt(0).toUpperCase()}
      </span>
      <span className="mt-3 font-semibold group-hover:text-[var(--accent)] transition-colors">
        {offer.name}
      </span>
      <span className="mt-1 text-sm text-[var(--muted)] flex-1 leading-relaxed">
        {offer.blurb[locale]}
      </span>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
        {visit}
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </span>
    </a>
  );
}
