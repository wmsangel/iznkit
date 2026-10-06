import type { Metadata } from "next";
import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { HourlyTool } from "@/components/tools/hourly-tool";
import { ToolContent } from "@/components/tool-content";
import { TrackedLink } from "@/components/tracked-link";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "hourly-rate";

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
    title: dict.hourly.title,
    description: seo?.metaExtra ?? dict.hourly.subtitle,
  });
}

export default async function HourlyPage({
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
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
        {dict.hourly.title}
      </h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.hourly.subtitle}</p>
      <div className="mt-10">
        <HourlyTool locale={locale} />
      </div>
      <p className="mt-6 max-w-2xl text-sm text-[var(--muted)] leading-relaxed">
        {locale === "ru"
          ? "Считаете ставку для клиента из другого города или планируете переезд? "
          : "Pricing for a client in another city, or planning a move? "}
        <TrackedLink
          external
          href="https://costtrek.com/"
          event="outbound_click"
          params={{ to: "CostTrek", where: "hourly-rate" }}
          className="text-[var(--accent)] hover:underline"
        >
          {locale === "ru" ? "Сравните стоимость жизни между городами" : "Compare the cost of living between cities"}
        </TrackedLink>
        {locale === "ru" ? " в CostTrek." : " with CostTrek."}
      </p>
      {entry ? (
        <ToolContent
          locale={locale}
          slug={SLUG}
          toolTitle={dict.hourly.title}
          toolBlurb={entry.tool.blurb[locale]}
          priceCents={entry.tool.priceCents}
        />
      ) : null}
    </div>
  );
}
