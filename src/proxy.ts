import { NextRequest, NextResponse } from "next/server";
import { locales, pickLocale } from "@/lib/i18n/config";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocale) return NextResponse.next();

  const locale = pickLocale(req.headers.get("accept-language"));
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  // Permanent (308) so Google consolidates the bare domain onto the localized
  // home — fixes "duplicate, Google chose / instead of /en". The target still
  // varies by language, so mark the response Vary: Accept-Language for caches.
  const res = NextResponse.redirect(url, 308);
  res.headers.set("Vary", "Accept-Language");
  return res;
}

export const config = {
  // Only run where a redirect might be needed: paths that DON'T already start
  // with a locale. Already-localized paths (/en, /en/…, /ru, /ru/…) were a no-op
  // here anyway, so skipping them cuts Edge Requests on the bulk of traffic.
  // Also excludes API routes, Next internals, and static assets (anything with a dot).
  matcher: [
    "/((?!en$|ru$|en/|ru/|api|_next/static|_next/image|favicon.ico|fonts|.*\\..*).*)",
  ],
};
