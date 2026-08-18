import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { offersFor } from "@/lib/affiliates";

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

  return (
    <div className="mt-14 max-w-3xl">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 className="text-xl font-semibold">{labels.youMayLike}</h2>
        <p className="text-xs text-[var(--muted)]">
          {labels.partnerNote}{" "}
          <Link href={`/${locale}/disclosure`} className="underline hover:text-[var(--foreground)]">
            {labels.partnerLink}
          </Link>
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((o) => (
          <a
            key={o.url}
            href={o.url}
            target="_blank"
            rel="sponsored noopener"
            className="card card-hover rounded-xl p-4 flex flex-col group"
          >
            <span className="font-semibold group-hover:text-[var(--accent)] transition-colors">
              {o.name}
            </span>
            <span className="mt-1 text-sm text-[var(--muted)] flex-1">{o.blurb[locale]}</span>
            <span className="mt-3 text-xs font-medium text-[var(--accent)]">{visit} ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
