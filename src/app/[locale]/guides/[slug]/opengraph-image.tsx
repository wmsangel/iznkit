import { isLocale, locales } from "@/lib/i18n/config";
import { getGuide, GUIDES } from "@/lib/guides";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "iznkit guide";
export const dynamic = "force-static";
export function generateStaticParams() {
  return locales.flatMap((locale) => GUIDES.map((g) => ({ locale, slug: g.slug })));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const guide = getGuide(slug);
  const body = guide?.content[loc];
  return ogImage({
    title: body?.title ?? "Guide",
    subtitle: body?.description ?? "",
    footer: loc === "ru" ? "Гайд · iznkit" : "Guide · iznkit",
  });
}
