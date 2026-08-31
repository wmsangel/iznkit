import { useEffect } from "react";

/**
 * Read the URL query once on mount and apply it, so a shared link like
 * /tools/loan-calculator?amount=30000&rate=7 restores the same inputs.
 * Runs in an effect (after hydration) to avoid a server/client mismatch.
 */
export function useHydrateFromUrl(apply: (params: URLSearchParams) => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sp = new URLSearchParams(window.location.search);
    if ([...sp.keys()].length > 0) apply(sp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** A finite number from a query param, or the fallback. */
export function numParam(sp: URLSearchParams, key: string, fallback: number): number {
  const raw = sp.get(key);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Build a shareable URL for the current page carrying the given values as query
 * params (empty/NaN values are dropped). The address bar is left untouched — the
 * link is only produced when the user asks to copy it.
 */
export function buildShareUrl(values: Record<string, string | number>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(values)) {
    const s = String(v);
    if (s !== "" && s !== "NaN" && s !== "undefined" && s !== "null") sp.set(k, s);
  }
  const qs = sp.toString();
  return `${window.location.origin}${window.location.pathname}${qs ? `?${qs}` : ""}`;
}
