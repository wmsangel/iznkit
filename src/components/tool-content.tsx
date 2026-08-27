import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolContent } from "@/lib/seo/tool-content";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { sections, getTool } from "@/lib/tools/registry";
import { FREE_MODE } from "@/lib/payments/mode";
import { offersFor } from "@/lib/affiliates";
import { AffiliateSlot } from "@/components/affiliate-slot";
import { getGuideForTool } from "@/lib/guides";

interface Props {
  locale: Locale;
  slug: string;
  toolTitle: string;
  toolBlurb: string;
  priceCents: number;
}

/**
 * Crawlable long-form content + structured data for a tool page, plus a
 * contextual "You may like" partner block. Renders if there's SEO content
 * and/or affiliate offers for the tool.
 */
export function ToolContent({
  locale,
  slug,
  toolTitle,
  toolBlurb,
  priceCents,
}: Props) {
  const content = getToolContent(slug, locale);
  const dict = getDictionary(locale);
  const category = getTool(slug)?.tool.affiliate;
  const hasAffiliate = offersFor(category).length > 0;
  const guide = getGuideForTool(slug);
  if (!content && !hasAffiliate && !guide) return null;

  const url = absUrl(locale, `tools/${slug}`);

  const jsonLd = content
    ? [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: toolTitle,
          description: toolBlurb,
          url,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          offers: {
            "@type": "Offer",
            price: FREE_MODE ? "0.00" : (priceCents / 100).toFixed(2),
            priceCurrency: "USD",
          },
          publisher: { "@type": "Organization", name: SITE_NAME },
        },
        {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: toolTitle,
          step: content.steps.map((text, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            text,
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        },
      ]
    : null;

  return (
    <section className="mt-16">
      {guide ? (
        <Link
          href={`/${locale}/guides/${guide.slug}`}
          className="card card-hover rounded-xl px-4 py-3 mb-10 flex items-center gap-3 max-w-3xl group"
        >
          <span className="text-lg">📖</span>
          <span className="flex-1 min-w-0">
            <span className="block text-xs uppercase tracking-wide text-[var(--muted)]">
              {dict.nav.guides}
            </span>
            <span className="block font-medium truncate group-hover:text-[var(--accent)] transition-colors">
              {guide.content[locale].title}
            </span>
          </span>
          <span className="text-[var(--accent)] shrink-0">→</span>
        </Link>
      ) : null}
      {content ? (
        <div className="max-w-3xl">
          {jsonLd ? (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
          ) : null}

          <p className="text-[var(--muted)] leading-relaxed">{content.intro}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {content.benefits.map((b) => (
              <li key={b} className="flex gap-2 text-sm">
                <span className="text-[var(--accent)] mt-0.5">✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl font-semibold">{dict.content.useCases}</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {content.useCases.map((u) => (
              <li
                key={u}
                className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--muted)]"
              >
                {u}
              </li>
            ))}
          </ul>

          <h2 className="mt-12 text-xl font-semibold">{dict.content.howItWorks}</h2>
          <ol className="mt-4 space-y-3">
            {content.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-none w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-fg)] text-xs font-bold grid place-items-center">
                  {i + 1}
                </span>
                <span className="text-[var(--muted)]">{step}</span>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-xl font-semibold">{dict.content.faq}</h2>
          <div className="mt-4 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {content.faq.map((f) => (
              <details key={f.q} className="group py-3">
                <summary className="cursor-pointer font-medium list-none flex justify-between items-center">
                  {f.q}
                  <span className="text-[var(--muted)] group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      ) : null}

      <AffiliateSlot
        locale={locale}
        category={category}
        labels={{
          youMayLike: dict.content.youMayLike,
          partnerNote: dict.content.partnerNote,
          partnerLink: dict.content.partnerLink,
        }}
      />

      <RelatedTools locale={locale} currentSlug={slug} />
    </section>
  );
}

function RelatedTools({
  locale,
  currentSlug,
}: {
  locale: Locale;
  currentSlug: string;
}) {
  const dict = getDictionary(locale);
  const others = sections
    .flatMap((s) => s.tools)
    .filter((t) => t.slug !== currentSlug)
    // live tools first, then a couple of upcoming ones
    .sort((a, b) => Number(b.status === "live") - Number(a.status === "live"))
    .slice(0, 6);
  if (others.length === 0) return null;

  return (
    <div className="mt-12 max-w-3xl">
      <h2 className="text-xl font-semibold">{dict.content.related}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {others.map((tool) => {
          const live = tool.status === "live";
          const card = (
            <div
              className={`h-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 ${
                live ? "hover:border-[var(--accent)]" : "opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm">{tool.title[locale]}</span>
                {!live ? (
                  <span className="text-[10px] uppercase rounded-full bg-[var(--border)] text-[var(--muted)] px-2 py-0.5">
                    {dict.home.soon}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-xs text-[var(--muted)]">{tool.blurb[locale]}</p>
            </div>
          );
          return live ? (
            <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`}>
              {card}
            </Link>
          ) : (
            <div key={tool.slug}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
