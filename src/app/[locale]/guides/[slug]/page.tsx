import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { pageMetadata } from "@/lib/seo/metadata";
import { absUrl, SITE_NAME, SITE_URL } from "@/lib/seo/site";
import { GUIDES, getGuide } from "@/lib/guides";
import { getTool } from "@/lib/tools/registry";
import { GuideArticle } from "@/components/guide-article";
import { AUTHOR } from "@/lib/author";

export function generateStaticParams() {
  return locales.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  const body = guide.content[locale];
  return pageMetadata({
    locale,
    path: `guides/${slug}`,
    title: body.title,
    description: body.description,
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = getGuide(slug);
  if (!guide) notFound();

  const dict = getDictionary(locale);
  const body = guide.content[locale];
  const url = absUrl(locale, `guides/${slug}`);
  const tool = getTool(guide.toolSlug)?.tool;
  const toolHref = `/${locale}/tools/${guide.toolSlug}`;
  const toolTitle = tool ? tool.title[locale] : body.cta;
  const updatedLabel = locale === "ru" ? "Обновлено" : "Updated";
  const backLabel = locale === "ru" ? "Все гайды" : "All guides";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: body.title,
      description: body.description,
      inLanguage: locale,
      datePublished: guide.updated,
      dateModified: guide.updated,
      mainEntityOfPage: url,
      url,
      image: `${url}/opengraph-image`,
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      author: { "@type": "Organization", name: AUTHOR.name[locale], url: absUrl(locale, "about") },
      publisher: {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: body.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absUrl(locale) },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "ru" ? "Гайды" : "Guides",
          item: absUrl(locale, "guides"),
        },
        { "@type": "ListItem", position: 3, name: body.title, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href={`/${locale}/guides`}
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        ← {backLabel}
      </Link>
      <div className="max-w-2xl mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{body.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {AUTHOR.byLabel[locale]}{" "}
          <Link
            href={`/${locale}/about`}
            className="text-[var(--foreground)] hover:text-[var(--accent)]"
          >
            {AUTHOR.name[locale]}
          </Link>{" "}
          · {updatedLabel}: {guide.updated}
        </p>
      </div>
      <div className="mt-2">
        <GuideArticle
          body={body}
          locale={locale}
          toolHref={toolHref}
          toolTitle={toolTitle}
          faqLabel={dict.content.faq}
        />
      </div>
    </div>
  );
}
