import type { Locale } from "@/lib/i18n/config";
import { allTools } from "@/lib/tools/registry";

/**
 * Source of truth for what we sell. Per-item prices come from the tool
 * registry; packs are defined here. The provider catalog (e.g. Lava products)
 * should mirror these price points.
 */

export interface Pack {
  id: string;
  credits: number;
  priceCents: number;
  label: Record<Locale, string>;
}

/** Multi-download bundles — better unit economics on micro-priced items. */
export const PACKS: Pack[] = [
  {
    id: "pack5",
    credits: 5,
    priceCents: 900,
    label: { en: "5 downloads", ru: "5 скачиваний" },
  },
  {
    id: "pack20",
    credits: 20,
    priceCents: 2900,
    label: { en: "20 downloads", ru: "20 скачиваний" },
  },
];

export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}

/** Distinct per-item price points across all paid tools — the tiers to create at the provider. */
export function priceTiers(): number[] {
  const set = new Set<number>();
  for (const t of allTools()) if (t.priceCents > 0) set.add(t.priceCents);
  return [...set].sort((a, b) => a - b);
}

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2).replace(/\.00$/, "")}`;
}
