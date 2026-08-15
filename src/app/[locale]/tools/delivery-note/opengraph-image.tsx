import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolContent } from "@/lib/seo/tool-content";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "Delivery note generator · iznkit";

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  const seo = getToolContent("delivery-note", loc);
  return ogImage({ title: dict.delivery.title, subtitle: seo?.metaExtra ?? dict.delivery.subtitle, accent: "#0d9488" });
}
