import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { GUIDES } from "@/lib/guides";

const COPY = {
  en: {
    title: "Guides",
    intro:
      "Short, practical guides on the things our tools help with — invoices, contracts, passwords and more. No fluff, and a free tool at the end of each.",
    read: "Read guide",
    home: "Home",
  },
  ru: {
    title: "Гайды",
    intro:
      "Короткие практичные гайды по тому, с чем помогают наши инструменты — счета, договоры, пароли и другое. Без воды, и в конце каждого — бесплатный инструмент.",
    read: "Читать гайд",
    home: "На главную",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const c = COPY[locale];
  return pageMetadata({ locale, path: "guides", title: c.title, description: c.intro });
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const c = COPY[locale];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <Link href={`/${locale}`} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
        ← {c.home}
      </Link>
      <div className="mt-6 max-w-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-4 text-lg text-[var(--muted)] leading-relaxed">{c.intro}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((g) => {
          const body = g.content[locale];
          return (
            <Link
              key={g.slug}
              href={`/${locale}/guides/${g.slug}`}
              className="card card-hover rounded-xl p-5 flex flex-col group"
            >
              <span className="font-semibold leading-snug">{body.title}</span>
              <span className="mt-2 text-sm text-[var(--muted)] flex-1">{body.description}</span>
              <span className="mt-4 text-sm font-medium text-[var(--accent)]">{c.read} →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
