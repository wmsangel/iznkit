/**
 * Thin wrapper over gtag for custom GA4 events. Safe to call anywhere: it no-ops
 * on the server and when the tag hasn't loaded (ad-blocked, etc.). GA4 attaches
 * page_location automatically, so events are attributable to the current tool
 * page without passing a slug.
 */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, params ?? {});
}
