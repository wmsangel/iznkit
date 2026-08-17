import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { termsDoc } from "@/lib/legal";
import { LegalDocView } from "@/components/legal-doc-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const doc = termsDoc(locale);
  return pageMetadata({ locale, path: "terms", title: doc.title, description: doc.intro });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const doc = termsDoc(locale);
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/${locale}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
        ← {locale === "ru" ? "На главную" : "Home"}
      </Link>
      <div className="mt-6">
        <LegalDocView doc={doc} updatedLabel={locale === "ru" ? "Обновлено" : "Last updated"} />
      </div>
    </div>
  );
}
