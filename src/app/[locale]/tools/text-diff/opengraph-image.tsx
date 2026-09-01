import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "Text diff / compare · iznkit";
export const dynamic = "force-static";
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  return ogImage({ title: dict.diff.title, subtitle: dict.diff.subtitle });
}
