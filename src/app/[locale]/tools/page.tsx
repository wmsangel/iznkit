import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { sections } from "@/lib/tools/registry";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME } from "@/lib/seo/site";
import { Breadcrumbs } from "@/components/breadcrumbs";

const COPY = {
  en: {
    title: "All tools",
    intro:
      "Every calculator and document generator on iznkit, grouped by what you're doing. All free to use, right in your browser — no sign-up.",
  },
  ru: {
    title: "Все инструменты",
    intro:
      "Все калькуляторы и генераторы документов iznkit, сгруппированы по задачам. Всё бесплатно, прямо в браузере — без регистрации.",
  },
} as const;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = COPY[locale];
  return pageMetadata({ locale, path: "tools", title: c.title, description: c.intro });
}

export default async function ToolsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = COPY[locale];
  const url = absUrl(locale, "tools");
  const live = sections.flatMap((s) => s.tools.filter((t) => t.status === "live"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.title,
    description: c.intro,
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
        items={[{ name: SITE_NAME, href: `/${locale}` }, { name: c.title }]}
        className="mb-4"
      />
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{c.intro}</p>

      {sections.map((section) => (
        <section key={section.id} className="mt-12">
          <div className="flex items-baseline justify-between gap-3 border-b border-[var(--border)] pb-3 mb-5">
            <Link
              href={`/${locale}/tools/${section.id}`}
              className="group flex items-baseline gap-2 min-w-0"
            >
              <span aria-hidden>{section.emoji}</span>
              <h2 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                {section.title[locale]}
              </h2>
            </Link>
            <span className="text-sm text-[var(--muted)] hidden sm:block truncate">
              {section.blurb[locale]}
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </section>
      ))}
    </div>
  );
}
