import type { Metadata } from "next";
import { ToolBreadcrumbs } from "@/components/tool-breadcrumbs";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CompoundTool } from "@/components/tools/compound-tool";
import { TrackedLink } from "@/components/tracked-link";
import { ToolContent } from "@/components/tool-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "compound-interest";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = getToolContent(SLUG, locale);
  return pageMetadata({ locale, path: `tools/${SLUG}`, title: dict.compound.title, description: seo?.metaExtra ?? dict.compound.subtitle });
}

export default async function CompoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const entry = getTool(SLUG);
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <ToolBreadcrumbs locale={locale} slug={SLUG} />
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{dict.compound.title}</h1>
        <span className="text-xs font-semibold rounded-full bg-[var(--accent-soft)] text-[var(--accent)] px-3 py-1">{dict.compound.free}</span>
      </div>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.compound.subtitle}</p>
      <div className="mt-10"><CompoundTool locale={locale} /></div>
      <p className="mt-6 max-w-2xl text-sm text-[var(--muted)] leading-relaxed">
        {locale === "ru"
          ? "Нужны и другие повседневные калькуляторы — по финансам, стройке или здоровью? "
          : "Need other everyday calculators — finance, DIY or health? "}
        <TrackedLink
          external
          href="https://calclumen.com/en"
          event="outbound_click"
          params={{ to: "Calclumen", where: "compound-interest" }}
          className="text-[var(--accent)] hover:underline"
        >
          {locale === "ru" ? "Загляните в подборку калькуляторов на Calclumen" : "Browse the calculator collection on Calclumen"}
        </TrackedLink>
        {locale === "ru" ? "." : "."}
      </p>
      {entry ? <ToolContent locale={locale} slug={SLUG} toolTitle={dict.compound.title} toolBlurb={entry.tool.blurb[locale]} priceCents={entry.tool.priceCents} /> : null}
    </div>
  );
}
