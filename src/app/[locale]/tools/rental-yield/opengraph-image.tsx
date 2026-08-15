import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getToolContent } from "@/lib/seo/tool-content";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "Rental yield calculator · iznkit";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  const seo = getToolContent("rental-yield", loc);
  return ogImage({
    title: dict.rental.title,
    subtitle: seo?.metaExtra ?? dict.rental.subtitle,
    accent: "#10b981",
  });
}
