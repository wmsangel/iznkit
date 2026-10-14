import type { Metadata } from "next";
import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { QuoteTool } from "@/components/tools/quote-tool";
import { TrackedLink } from "@/components/tracked-link";
import { ToolContent } from "@/components/tool-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "quote";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = getToolContent(SLUG, locale);
  return pageMetadata({
    locale,
    path: `tools/${SLUG}`,
    title: dict.quote.title,
    description: seo?.metaExtra ?? dict.quote.subtitle,
  });
}

export default async function QuotePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const entry = getTool(SLUG);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolBreadcrumbs locale={locale} slug={SLUG} />
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{dict.quote.title}</h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.quote.subtitle}</p>
      <div className="mt-10">
        <QuoteTool locale={locale} />
      </div>
      <p className="mt-6 max-w-2xl text-sm text-[var(--muted)] leading-relaxed">
        {locale === "ru"
          ? "Готовите КП? Убедитесь, что цена оставляет нужную маржу — сначала прикиньте цифры в "
          : "Pricing a quote? Make sure it leaves the margin you want — run the numbers in a "}
        <TrackedLink
          external
          href="https://calclumen.com/en/margin-markup-calculator"
          event="outbound_click"
          params={{ to: "CalcLumen", where: "quote" }}
          className="text-[var(--accent)] hover:underline"
        >
          {locale === "ru" ? "калькуляторе маржи и наценки" : "margin and markup calculator"}
        </TrackedLink>
        {locale === "ru" ? " перед выставлением." : " first."}
      </p>
      {entry ? (
        <ToolContent locale={locale} slug={SLUG} toolTitle={dict.quote.title} toolBlurb={entry.tool.blurb[locale]} priceCents={entry.tool.priceCents} />
      ) : null}
    </div>
  );
}
