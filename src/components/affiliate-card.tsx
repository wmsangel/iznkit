import type { Locale } from "@/lib/i18n/config";
import type { PublicOffer } from "@/lib/affiliates";

/** Deterministic brand hue (0–360) from the offer name, so each partner keeps a
 *  stable accent colour without storing one per offer. */
function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

/**
 * One clickable partner card. A server component: the anchor carries NO partner
 * URL and no /go URL — only `href="#"` and `data-go="<offer id>"`. The delegated
 * GoClickTracker writes a tokenized /go URL on a real press and fires the
 * `affiliate_click` event (item / network / placement from the data-aff-*
 * attributes below). See src/lib/affiliates/gotoken.ts for why.
 *
 * `place` is the page slug used as the network sub-id (`iznkit-<place>`).
 */
export function AffiliateCard({
  offer,
  locale,
  place,
  visit,
  sponsored,
}: {
  offer: PublicOffer;
  locale: Locale;
  place?: string;
  visit: string;
  sponsored: string;
}) {
  const h = hue(offer.name);
  return (
    <a
      href="#"
      data-go={offer.id}
      data-go-s={place ?? ""}
      data-aff-item={offer.name}
      data-aff-network={offer.net}
      data-aff-placement={place ?? ""}
      target="_blank"
      rel="sponsored noopener"
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
