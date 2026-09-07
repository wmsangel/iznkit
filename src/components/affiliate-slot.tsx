import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { offersFor } from "@/lib/affiliates";

/** Deterministic brand hue (0–360) from the offer name, so each partner keeps a
 *  stable accent colour without storing one per offer. */
function hue(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  return h;
}

/**
 * Contextual "You may like" partner block. Renders nothing unless the tool's
 * affiliate category has offers. Links use rel="sponsored" and point to the
 * Affiliate Disclosure page.
 */
export function AffiliateSlot({
  locale,
  category,
  labels,
}: {
  locale: Locale;
  category?: string;
  labels: { youMayLike: string; partnerNote: string; partnerLink: string };
}) {
  const offers = offersFor(category);
  if (offers.length === 0) return null;
  const visit = locale === "ru" ? "Перейти" : "Visit";
  const sponsored = locale === "ru" ? "Реклама" : "Sponsored";

  return (
    <section className="mt-14 max-w-3xl">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span aria-hidden className="text-[var(--accent)]">
            ✦
          </span>
          {labels.youMayLike}
        </h2>
        <p className="text-xs text-[var(--muted)]">
          {labels.partnerNote}{" "}
          <Link href={`/${locale}/disclosure`} className="underline hover:text-[var(--foreground)]">
            {labels.partnerLink}
          </Link>
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => {
          const h = hue(o.name);
          return (
            <a
              key={o.url}
              href={o.url}
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
                style={{
                  color: `hsl(${h} 55% 45%)`,
                  background: `hsl(${h} 60% 50% / 0.13)`,
                }}
              >
                {o.name.charAt(0).toUpperCase()}
              </span>
              <span className="mt-3 font-semibold group-hover:text-[var(--accent)] transition-colors">
                {o.name}
              </span>
              <span className="mt-1 text-sm text-[var(--muted)] flex-1 leading-relaxed">
                {o.blurb[locale]}
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[var(--accent)]">
                {visit}
                <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
