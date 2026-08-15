export type ItemStatus = "ok" | "issue" | "na";

export interface InspectionItem {
  label: string;
  status: ItemStatus;
  note: string;
}

export interface InspectionPhoto {
  /** data URL (image/jpeg), already downscaled client-side. */
  src: string;
  caption: string;
}

export interface InspectionData {
  theme: string;
  title: string;
  number: string;
  date: string;
  location: string;
  inspector: string;
  inspectorDetails: string;
  items: InspectionItem[];
  photos: InspectionPhoto[];
  summary: string;
}

export const STATUSES: ItemStatus[] = ["ok", "issue", "na"];

/** Accent color per status (shared by preview and PDF). */
export const STATUS_COLOR: Record<ItemStatus, string> = {
  ok: "#059669",
  issue: "#e11d48",
  na: "#6b7280",
};

export function emptyInspection(): InspectionData {
  return {
    theme: "indigo",
    title: "",
    number: "0001",
    date: new Date().toISOString().slice(0, 10),
    location: "",
    inspector: "",
    inspectorDetails: "",
    items: [{ label: "", status: "ok", note: "" }],
    photos: [],
    summary: "",
  };
}
