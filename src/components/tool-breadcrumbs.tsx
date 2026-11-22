import type { Locale } from "@/lib/i18n/config";
import { getTool } from "@/lib/tools/registry";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SITE_NAME } from "@/lib/seo/site";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { ToolOpened } from "@/components/tool-opened";

/** Home → All tools → Category → Tool breadcrumb for a tool page (visual + JSON-LD).
 *  Also fires the tool_opened funnel event (every tool page renders this). */
export function ToolBreadcrumbs({ locale, slug }: { locale: Locale; slug: string }) {
  const entry = getTool(slug);
  const items: Crumb[] = [
    { name: SITE_NAME, href: `/${locale}` },
    { name: getDictionary(locale).nav.allTools, href: `/${locale}/tools` },
  ];
  if (entry) {
    items.push({
      name: entry.section.title[locale],
      href: `/${locale}/tools/${entry.section.id}`,
    });
    items.push({ name: entry.tool.title[locale] });
  }
  return (
    <>
      <ToolOpened tool={slug} />
      <Breadcrumbs items={items} className="mb-4" />
    </>
  );
}
