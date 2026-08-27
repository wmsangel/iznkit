import Link from "next/link";
import { SITE_URL } from "@/lib/seo/site";

export interface Crumb {
  name: string;
  /** locale-prefixed path like "/en/tools/documents"; omit for the current page. */
  href?: string;
}

/**
 * Visual breadcrumb trail + matching BreadcrumbList JSON-LD in one component.
 * The last crumb is the current page (no href). Emitting both here keeps the
 * visible trail and the structured data in lockstep.
 */
export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${SITE_URL}${c.href}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--muted)]">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 ? (
              <span aria-hidden className="opacity-60">
                /
              </span>
            ) : null}
            {c.href ? (
              <Link href={c.href} className="hover:text-[var(--foreground)] transition-colors">
                {c.name}
              </Link>
            ) : (
              <span className="text-[var(--foreground)] truncate">{c.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
