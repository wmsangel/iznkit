import type { Metadata } from "next";
import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CaseTool } from "@/components/tools/case-tool";
import { ToolContent } from "@/components/tool-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "case-converter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = getToolContent(SLUG, locale);
  return pageMetadata({ locale, path: `tools/${SLUG}`, title: dict.caseConverter.title, description: seo?.metaExtra ?? dict.caseConverter.subtitle });
}

export default async function CasePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const entry = getTool(SLUG);
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolBreadcrumbs locale={locale} slug={SLUG} />
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{dict.caseConverter.title}</h1>
        <span className="text-xs font-semibold rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-3 py-1">{dict.caseConverter.free}</span>
      </div>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.caseConverter.subtitle}</p>
      <div className="mt-10"><CaseTool locale={locale} /></div>
      {entry ? <ToolContent locale={locale} slug={SLUG} toolTitle={dict.caseConverter.title} toolBlurb={entry.tool.blurb[locale]} priceCents={entry.tool.priceCents} /> : null}
    </div>
  );
}
