import type { Metadata } from "next";
import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { UnitTool } from "@/components/tools/unit-tool";
import { ToolContent } from "@/components/tool-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "unit-economics";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = getToolContent(SLUG, locale);
  return pageMetadata({ locale, path: `tools/${SLUG}`, title: dict.unit.title, description: seo?.metaExtra ?? dict.unit.subtitle });
}

export default async function UnitPage({
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
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{dict.unit.title}</h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.unit.subtitle}</p>
      <div className="mt-10"><UnitTool locale={locale} /></div>
      {entry ? (
        <ToolContent locale={locale} slug={SLUG} toolTitle={dict.unit.title} toolBlurb={entry.tool.blurb[locale]} priceCents={entry.tool.priceCents} />
      ) : null}
    </div>
  );
}
