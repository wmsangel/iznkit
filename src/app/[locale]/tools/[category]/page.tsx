import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sections, type SectionDef } from "@/lib/tools/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

function getSection(id: string): SectionDef | undefined {
  return sections.find((s) => s.id === id);
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    sections.map((s) => ({ locale, category: s.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale)) return {};
  const section = getSection(category);
  if (!section) return {};
  return pageMetadata({
    locale,
    path: `tools/${category}`,
    title: section.title[locale],
    description: section.blurb[locale],
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  const section = getSection(category);
  if (!section) notFound();

  const dict = getDictionary(locale);
  const url = absUrl(locale, `tools/${category}`);
  const live = section.tools.filter((t) => t.status === "live");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: section.title[locale],
    description: section.blurb[locale],
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absUrl(locale) },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: live.map((tool, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: tool.title[locale],
        url: absUrl(locale, `tools/${tool.slug}`),
      })),
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { name: SITE_NAME, href: `/${locale}` },
          { name: section.title[locale] },
        ]}
        className="mb-4"
      />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
        <span aria-hidden className="mr-2">
          {section.emoji}
        </span>
        {section.title[locale]}
      </h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{section.blurb[locale]}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {section.tools.map((tool) => {
          const isLive = tool.status === "live";
          const card = (
            <div
              className={`card ${isLive ? "card-hover" : "opacity-70"} rounded-xl p-5 h-full flex flex-col`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold">{tool.title[locale]}</span>
                {tool.popular && isLive ? (
                  <span className="text-[10px] uppercase tracking-wide rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-2 py-0.5 font-semibold">
                    {dict.home.popular}
                  </span>
                ) : !isLive ? (
                  <span className="text-[10px] uppercase tracking-wide rounded-full bg-[var(--card-2)] text-[var(--muted)] px-2 py-0.5 font-semibold">
                    {dict.home.soon}
                  </span>
                ) : null}
              </div>
              <p className="mt-1.5 text-sm text-[var(--muted)] flex-1">{tool.blurb[locale]}</p>
            </div>
          );
          return isLive ? (
            <Link
              key={tool.slug}
              href={`/${locale}/tools/${tool.slug}`}
              className="group block h-full"
            >
              {card}
            </Link>
          ) : (
            <div key={tool.slug} className="h-full">
              {card}
            </div>
          );
        })}
      </div>

      {/* Other categories — cross-linking hub */}
      <div className="mt-16 border-t border-[var(--border)] pt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {dict.home.sectionsTitle}
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {sections
            .filter((s) => s.id !== section.id)
            .map((s) => (
              <Link
                key={s.id}
                href={`/${locale}/tools/${s.id}`}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
              >
                <span aria-hidden className="mr-1">
                  {s.emoji}
                </span>
                {s.title[locale]}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
