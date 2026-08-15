import type { Locale } from "@/lib/i18n/config";

export type TemplateId =
  | "classic"
  | "modern"
  | "minimal"
  | "rose"
  | "amber"
  | "royal";
export type HeaderStyle = "split" | "band" | "minimal";

export interface InvoiceTemplate {
  id: TemplateId;
  label: Record<Locale, string>;
  /** Accent color used for the title, totals, and highlights. */
  accent: string;
  /** How the header area is laid out. */
  header: HeaderStyle;
}

export const TEMPLATES: InvoiceTemplate[] = [
  {
    id: "classic",
    label: { en: "Classic", ru: "Классический" },
    accent: "#4f46e5",
    header: "split",
  },
  {
    id: "modern",
    label: { en: "Modern", ru: "Современный" },
    accent: "#0d9488",
    header: "band",
  },
  {
    id: "minimal",
    label: { en: "Minimal", ru: "Минимал" },
    accent: "#111827",
    header: "minimal",
  },
  {
    id: "rose",
    label: { en: "Rose", ru: "Роза" },
    accent: "#e11d48",
    header: "band",
  },
  {
    id: "amber",
    label: { en: "Amber", ru: "Янтарь" },
    accent: "#b45309",
    header: "split",
  },
  {
    id: "royal",
    label: { en: "Royal", ru: "Роял" },
    accent: "#6d28d9",
    header: "band",
  },
];

export const DEFAULT_TEMPLATE: TemplateId = "classic";

export function getTemplate(id: string | undefined | null): InvoiceTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
