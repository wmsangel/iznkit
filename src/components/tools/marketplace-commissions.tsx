import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { MARKETPLACE_COMMISSIONS } from "@/lib/tools/marketplace-commissions";

/**
 * Server-rendered reference tables (no JS) so every category row is indexable
 * long-tail. Honest framing: dated ranges from public seller sources, a loud
 * "verify in your dashboard" disclaimer, official links, and calculator CTAs.
 */
export function MarketplaceCommissions({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).mpComm;

  return (
    <div className="space-y-8">
      {/* Loud disclaimer up top */}
      <div className="rounded-xl border border-[var(--border-strong)] bg-[var(--card-2)] px-4 py-3">
        <p className="text-sm leading-relaxed">
          <strong>⚠ </strong>
          {t.disclaimer}
        </p>
      </div>

      {/* Quick anchors */}
      <nav className="flex flex-wrap gap-2">
        {MARKETPLACE_COMMISSIONS.map((m) => (
          <a
            key={m.id}
            href={`#${m.id}`}
            className="rounded-full border border-[var(--border)] px-3 py-1 text-sm font-medium hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {m.name}
          </a>
        ))}
      </nav>

      {MARKETPLACE_COMMISSIONS.map((m) => (
        <section key={m.id} id={m.id} className="scroll-mt-24">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight">{m.name}</h2>
            <span className="text-xs text-[var(--muted)]">
              {t.asOfLabel}: {m.asOf[locale]}
            </span>
          </div>

          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            <span className="font-medium text-[var(--foreground)]">{t.structureLabel}: </span>
            {m.structure[locale]}
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--card-2)] text-left">
                  <th className="px-4 py-2.5 font-semibold">{m.headers.cat[locale]}</th>
                  <th className="px-4 py-2.5 font-semibold whitespace-nowrap">{m.headers.rate[locale]}</th>
                </tr>
              </thead>
              <tbody>
                {m.rows.map((r) => (
                  <tr key={r.cat.en} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-4 py-2.5">{r.cat[locale]}</td>
                    <td className="px-4 py-2.5 font-mono tabular-nums whitespace-nowrap">{r.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-[var(--muted)] leading-relaxed">{m.note[locale]}</p>

          <a
            href={m.officialUrl}
            target="_blank"
            rel="noopener nofollow"
            className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
          >
            {t.verify}
          </a>
        </section>
      ))}

      {/* Calculator CTAs — turn a rate into money */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
        <h2 className="text-lg font-semibold">{t.calcTitle}</h2>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <Link href={`/${locale}/tools/marketplace-payout`} className="text-sm font-medium text-[var(--accent)] hover:underline">
            {t.ctaPayout}
          </Link>
          <Link href={`/${locale}/tools/marketplace-price`} className="text-sm font-medium text-[var(--accent)] hover:underline">
            {t.ctaPrice}
          </Link>
          <Link href={`/${locale}/tools/unit-economics`} className="text-sm font-medium text-[var(--accent)] hover:underline">
            {t.ctaUnit}
          </Link>
        </div>
      </section>

      <p className="text-xs text-[var(--muted)]">{t.sourcesNote}</p>
    </div>
  );
}
