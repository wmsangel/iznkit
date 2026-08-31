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

/** UTF-8-safe base64url encode of a JSON-serialisable object (for a ?d= share param). */
export function encodeData(obj: unknown): string {
  try {
    const bytes = new TextEncoder().encode(JSON.stringify(obj));
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch {
    return "";
  }
}

/** Inverse of encodeData; returns null if the string isn't valid. */
export function decodeData<T>(s: string): T | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64);
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}
