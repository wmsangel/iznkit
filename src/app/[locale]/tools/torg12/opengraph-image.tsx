import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolContent } from "@/lib/seo/tool-content";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "ТОРГ-12 generator · iznkit";
export const dynamic = "force-static";
export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  const seo = getToolContent("torg12", loc);
  return ogImage({ title: dict.torg12.title, subtitle: seo?.metaExtra ?? dict.torg12.subtitle });
}
