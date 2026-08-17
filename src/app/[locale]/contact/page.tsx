import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { CONTACT_EMAIL, ADS_EMAIL } from "@/lib/seo/site";

const COPY = {
  en: {
    title: "Contact",
    intro:
      "Have feedback, found a bug, want a new tool, or have a partnership idea? Send an email — we read everything.",
    emailLabel: "General",
    adsLabel: "Advertising & partnerships",
    note: "We usually reply within a couple of days. For privacy questions, mention it in the subject.",
    home: "Home",
  },
  ru: {
    title: "Контакты",
    intro:
      "Есть отзыв, нашли ошибку, хотите новый инструмент или идею для сотрудничества? Напишите — мы читаем всё.",
    emailLabel: "Общие вопросы",
    adsLabel: "Реклама и партнёрства",
    note: "Обычно отвечаем в течение пары дней. По вопросам конфиденциальности укажите это в теме письма.",
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
  return pageMetadata({ locale, path: "contact", title: c.title, description: c.intro });
}

export default async function ContactPage({
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
      <div className="max-w-2xl mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">{c.intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="card rounded-xl p-6">
            <div className="eyebrow">{c.emailLabel}</div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-2 inline-block text-lg font-semibold text-[var(--accent)] hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div className="card rounded-xl p-6">
            <div className="eyebrow">{c.adsLabel}</div>
            <a
              href={`mailto:${ADS_EMAIL}`}
              className="mt-2 inline-block text-lg font-semibold text-[var(--accent)] hover:underline break-all"
            >
              {ADS_EMAIL}
            </a>
          </div>
        </div>
        <p className="mt-5 text-sm text-[var(--muted)]">{c.note}</p>
      </div>
    </div>
  );
}
