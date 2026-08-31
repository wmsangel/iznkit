import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { CONTACT_EMAIL } from "@/lib/seo/site";

const COPY = {
  en: {
    title: "About iznkit",
    intro:
      "iznkit is a small, independent project — a growing set of free, bilingual (EN/RU) web tools: calculators and document generators that give you a clean, branded PDF or a quick answer, right in your browser.",
    paras: [
      "There are no accounts and no uploads. Everything runs on your device, so the numbers and details you type stay with you — nothing is stored on our servers.",
      "The goal is simple: small tools that each do one job well, look professional, and don't get in your way. Invoices, quotes, NDAs, receipts, a password generator, QR codes and everyday calculators — with more added over time.",
      "Everything is free to use right now. If a tool saves you time, an optional donation helps keep the project running.",
      "iznkit is built and maintained by the iznkit editorial team — an independent maker who designs each tool, tests it, and writes the short guide that goes with it.",
    ],
    linkLabel: "See our other projects",
    home: "Home",
  },
  ru: {
    title: "О проекте iznkit",
    intro:
      "iznkit — небольшой независимый проект: растущий набор бесплатных двуязычных (EN/RU) веб-инструментов. Калькуляторы и генераторы документов, которые выдают чистый брендированный PDF или быстрый ответ прямо в браузере.",
    paras: [
      "Здесь нет аккаунтов и загрузок на сервер. Всё работает на вашем устройстве — суммы и данные, которые вы вводите, остаются у вас, ничего не хранится у нас.",
      "Идея простая: маленькие инструменты, каждый из которых делает одно дело хорошо, выглядит профессионально и не мешает. Счета, КП, NDA, чеки, генератор паролей, QR-коды и повседневные калькуляторы — и дальше больше.",
      "Сейчас всё бесплатно. Если инструмент экономит вам время, необязательный донат помогает проекту жить.",
      "Проект ведёт редакция iznkit — независимый разработчик, который сам проектирует каждый инструмент, проверяет его и пишет к нему короткий гайд.",
    ],
    linkLabel: "Наши другие проекты",
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
  return pageMetadata({ locale, path: "about", title: c.title, description: c.intro });
}

export default async function AboutPage({
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
      <div className="max-w-3xl mt-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{c.title}</h1>
        <p className="mt-6 text-lg text-[var(--muted)] leading-relaxed">{c.intro}</p>
        <div className="mt-5 space-y-4 text-[var(--muted)] leading-relaxed">
          {c.paras.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/${locale}/projects`}
            className="btn-outline inline-flex rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            {c.linkLabel} →
          </Link>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="btn-outline inline-flex rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
