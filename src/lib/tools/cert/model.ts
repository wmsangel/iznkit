import type { Locale } from "@/lib/i18n/config";

export type FrameStyle = "line" | "double" | "none";

export interface CertDesign {
  id: string;
  label: Record<Locale, string>;
  bg: string; // background color
  accent: string; // amount / brand / frame accent
  ink: string; // main text color
  frame: FrameStyle;
  band: boolean; // top accent band behind the title
}

/** 18 ready-made looks. One parametrized template renders all of them. */
export const CERT_DESIGNS: CertDesign[] = [
  { id: "cream-gold", label: { en: "Cream & gold", ru: "Крем и золото" }, bg: "#fdf6e3", accent: "#b8860b", ink: "#3b2f14", frame: "double", band: false },
  { id: "black-gold", label: { en: "Black & gold", ru: "Чёрное золото" }, bg: "#111111", accent: "#d4af37", ink: "#f5f5f5", frame: "line", band: false },
  { id: "white-indigo", label: { en: "Clean indigo", ru: "Чистый индиго" }, bg: "#ffffff", accent: "#4f46e5", ink: "#111827", frame: "line", band: true },
  { id: "navy-sky", label: { en: "Navy", ru: "Тёмно-синий" }, bg: "#0f172a", accent: "#38bdf8", ink: "#f8fafc", frame: "none", band: true },
  { id: "rose-soft", label: { en: "Soft rose", ru: "Нежная роза" }, bg: "#fff1f2", accent: "#e11d48", ink: "#4c0519", frame: "line", band: false },
  { id: "emerald", label: { en: "Emerald", ru: "Изумруд" }, bg: "#ecfdf5", accent: "#059669", ink: "#064e3b", frame: "double", band: false },
  { id: "kraft", label: { en: "Kraft", ru: "Крафт" }, bg: "#d7c4a3", accent: "#6b4f2a", ink: "#3b2f1e", frame: "double", band: false },
  { id: "teal-dark", label: { en: "Deep teal", ru: "Глубокая бирюза" }, bg: "#042f2e", accent: "#2dd4bf", ink: "#f0fdfa", frame: "line", band: false },
  { id: "violet", label: { en: "Violet", ru: "Фиолет" }, bg: "#2e1065", accent: "#c4b5fd", ink: "#f5f3ff", frame: "none", band: true },
  { id: "coral", label: { en: "Coral", ru: "Коралл" }, bg: "#fff7ed", accent: "#ea580c", ink: "#7c2d12", frame: "line", band: false },
  { id: "slate", label: { en: "Slate", ru: "Графит" }, bg: "#f8fafc", accent: "#334155", ink: "#0f172a", frame: "line", band: false },
  { id: "blush", label: { en: "Blush", ru: "Пудра" }, bg: "#fdf2f8", accent: "#db2777", ink: "#500724", frame: "double", band: false },
  { id: "forest", label: { en: "Forest", ru: "Лес" }, bg: "#14532d", accent: "#86efac", ink: "#f0fdf4", frame: "line", band: false },
  { id: "burgundy", label: { en: "Burgundy", ru: "Бордо" }, bg: "#4c0519", accent: "#fda4af", ink: "#fff1f2", frame: "double", band: false },
  { id: "sky", label: { en: "Sky", ru: "Небо" }, bg: "#f0f9ff", accent: "#0284c7", ink: "#0c4a6e", frame: "line", band: true },
  { id: "charcoal-lime", label: { en: "Charcoal lime", ru: "Уголь и лайм" }, bg: "#1c1917", accent: "#a3e635", ink: "#fafaf9", frame: "line", band: false },
  { id: "midnight-pink", label: { en: "Midnight pink", ru: "Полночь и розовый" }, bg: "#1e1b4b", accent: "#f472b6", ink: "#eef2ff", frame: "none", band: true },
  { id: "sand-red", label: { en: "Sand & red", ru: "Песок и красный" }, bg: "#fef3c7", accent: "#dc2626", ink: "#451a03", frame: "double", band: false },
];

export function getCertDesign(id: string | undefined | null): CertDesign {
  return CERT_DESIGNS.find((d) => d.id === id) ?? CERT_DESIGNS[0];
}

export interface CertData {
  design: string;
  bgImage: string | null; // optional uploaded background (data URL)
  brandName: string;
  amount: string; // free text: "$100" or "1 free class"
  recipient: string;
  sender: string;
  message: string;
  code: string;
  expiry: string;
}

export function emptyCert(): CertData {
  return {
    design: "cream-gold",
    bgImage: null,
    brandName: "",
    amount: "$100",
    recipient: "",
    sender: "",
    message: "",
    code: "GIFT-2026",
    expiry: "",
  };
}
