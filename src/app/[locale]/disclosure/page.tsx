import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo/metadata";
import { CONTACT_EMAIL } from "@/lib/seo/site";

const COPY = {
  en: {
    title: "Affiliate Disclosure",
    intro:
      "Some links on iznkit are affiliate or partner links — including the “You may like” suggestions under our tools.",
    paras: [
      "If you click one of those links and then sign up or buy something, we may earn a commission. It costs you nothing extra: the price you pay is exactly the same as going there directly.",
      "We only suggest tools that we think are genuinely useful and relevant to what you're doing on the page. A commission never changes which tools we recommend or the order they appear in.",
      "iznkit is a participant in the Amazon Associates Program. As an Amazon Associate, iznkit earns from qualifying purchases; the book links in our guides are Amazon affiliate links, labelled where they appear.",
      "On a few document and contract pages you may also see a “Sponsored” block of ad cards from a partner ad network. They are chosen by the topic of the page — never by anything about you — are clearly labelled “Sponsored”, and we pass no personal data to show them.",
      "iznkit is free to use, and these partnerships help keep it that way.",
    ],
    contact: `Questions about this? Email ${CONTACT_EMAIL}.`,
    home: "Home",
  },
  ru: {
    title: "Партнёрское раскрытие",
    intro:
      "Некоторые ссылки на iznkit — партнёрские, включая рекомендации в блоке «Вам может пригодиться» под инструментами.",
    paras: [
      "Если вы перейдёте по такой ссылке и затем зарегистрируетесь или что-то купите, мы можем получить комиссию. Для вас это бесплатно: цена ровно такая же, как при прямом переходе.",
      "Мы предлагаем только те сервисы, которые считаем действительно полезными и уместными для того, что вы делаете на странице. Комиссия не влияет на то, что мы рекомендуем и в каком порядке.",
      "iznkit участвует в партнёрской программе Amazon Associates. Как участник, iznkit получает комиссию с соответствующих покупок; книжные ссылки в наших гайдах — партнёрские ссылки Amazon и помечены рядом.",
      "На нескольких страницах о документах и договорах может также появляться блок «Sponsored» — рекламные карточки партнёрской рекламной сети. Они подбираются по теме страницы, а не по данным о вас, явно помечены «Sponsored», и мы не передаём для их показа никаких персональных данных.",
      "iznkit бесплатен, и эти партнёрства помогают сохранять его таким.",
    ],
    contact: `Вопросы — на ${CONTACT_EMAIL}.`,
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
  return pageMetadata({ locale, path: "disclosure", title: c.title, description: c.intro });
}

export default async function DisclosurePage({
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
        <p className="mt-8 text-sm text-[var(--muted)]">{c.contact}</p>
      </div>
    </div>
  );
}
