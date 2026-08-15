import type { Locale } from "@/lib/i18n/config";

export interface DocTheme {
  id: string;
  label: Record<Locale, string>;
  accent: string;
}

/** Shared accent themes — every tool offers these as a design choice. */
export const THEMES: DocTheme[] = [
  { id: "indigo", label: { en: "Indigo", ru: "Индиго" }, accent: "#4f46e5" },
  { id: "teal", label: { en: "Teal", ru: "Бирюза" }, accent: "#0d9488" },
  { id: "rose", label: { en: "Rose", ru: "Роза" }, accent: "#e11d48" },
  { id: "amber", label: { en: "Amber", ru: "Янтарь" }, accent: "#b45309" },
  { id: "violet", label: { en: "Violet", ru: "Фиолет" }, accent: "#7c3aed" },
  { id: "slate", label: { en: "Graphite", ru: "Графит" }, accent: "#334155" },
];

export const DEFAULT_THEME = "indigo";

export function getThemeAccent(id: string | undefined | null): string {
  return THEMES.find((t) => t.id === id)?.accent ?? THEMES[0].accent;
}
