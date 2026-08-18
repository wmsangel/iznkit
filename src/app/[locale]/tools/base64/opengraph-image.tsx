import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ogImage, size, contentType } from "@/lib/seo/og-image";

export { size, contentType };
export const alt = "Base64 encoder / decoder · iznkit";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = isLocale(locale) ? locale : "en";
  const dict = getDictionary(loc);
  return ogImage({ title: dict.b64.title, subtitle: dict.b64.subtitle });
}
