import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { offersFor } from "@/lib/affiliates";
import { AffiliateCard } from "@/components/affiliate-card";

/**
 * Contextual "You may like" partner block. Renders nothing unless the tool's
 * affiliate category has offers. Cards link with rel="sponsored", fire a GA4
 * affiliate_click event, and point to the Affiliate Disclosure page.
 */
export function AffiliateSlot({
  locale,
  category,
  tool,
  labels,
}: {
  locale: Locale;
  category?: string;
  tool?: string;
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
        {offers.map((o) => (
          <AffiliateCard
            key={o.url}
            offer={o}
            locale={locale}
            slot={category}
            tool={tool}
            visit={visit}
            sponsored={sponsored}
          />
        ))}
      </div>
    </section>
  );
}
