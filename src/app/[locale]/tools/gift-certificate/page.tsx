import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { CertTool } from "@/components/tools/cert-tool";
import { ToolContent } from "@/components/tool-content";
import { pageMetadata } from "@/lib/seo/metadata";
import { getToolContent } from "@/lib/seo/tool-content";
import { getTool } from "@/lib/tools/registry";

const SLUG = "gift-certificate";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const seo = getToolContent(SLUG, locale);
  return pageMetadata({ locale, path: `tools/${SLUG}`, title: dict.cert.title, description: seo?.metaExtra ?? dict.cert.subtitle });
}

export default async function CertPage({
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
      <Link href={`/${locale}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">← {dict.nav.allTools}</Link>
      <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">{dict.cert.title}</h1>
      <p className="mt-2 text-lg text-[var(--muted)] max-w-2xl">{dict.cert.subtitle}</p>
      <div className="mt-10"><CertTool locale={locale} /></div>
      {entry ? (
        <ToolContent locale={locale} slug={SLUG} toolTitle={dict.cert.title} toolBlurb={entry.tool.blurb[locale]} priceCents={entry.tool.priceCents} />
      ) : null}
    </div>
  );
}
