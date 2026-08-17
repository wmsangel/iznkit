import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { PROJECTS } from "@/lib/projects";

const COPY = {
  en: {
    title: "Our projects",
    intro:
      "A small family of independent sites — free calculators, tools, games and guides. If you like iznkit, one of these might help too.",
    visit: "Visit",
    home: "Home",
  },
  ru: {
    title: "Наши проекты",
    intro:
      "Небольшая семья независимых сайтов — бесплатные калькуляторы, инструменты, игры и гайды. Если нравится iznkit, что-то из этого тоже может пригодиться.",
    visit: "Перейти",
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
  return pageMetadata({ locale, path: "projects", title: c.title, description: c.intro });
}

export default async function ProjectsPage({
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
        {PROJECTS.map((p) => (
          <a
            key={p.url}
            href={p.url}
            target="_blank"
            rel="noopener"
            className="card card-hover rounded-xl p-5 flex flex-col group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">{p.name}</span>
              <span className="text-[10px] uppercase tracking-wide rounded-full bg-[var(--card-2)] text-[var(--muted)] px-2 py-0.5 font-semibold">
                {p.lang}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-[var(--muted)] flex-1">{p.tagline[locale]}</p>
            <span className="mt-4 text-sm font-medium text-[var(--accent)]">{c.visit} ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
