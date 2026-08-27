import { notFound } from "next/navigation";

// Any unmatched path under a locale (e.g. /en/broken-link) lands here and is
// funnelled into the locale's not-found UI — so 404s keep the site chrome and
// the correct <html lang>. Static routes and /tools/[category] take precedence.
export default function CatchAll() {
  notFound();
}
