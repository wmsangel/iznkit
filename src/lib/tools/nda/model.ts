export interface NdaData {
  theme: string;
  effectiveDate: string;
  mutual: boolean;
  disclosingName: string;
  disclosingDetails: string;
  receivingName: string;
  receivingDetails: string;
  purpose: string;
  termMonths: number;
  governingLaw: string;
}

export interface NdaClause {
  h: string;
  b: string;
}

/** The localized `nda` dictionary slice needed to build the document text. */
export interface NdaText {
  introTpl: string;
  clauses: readonly NdaClause[];
  mutualYes: string;
  mutualNo: string;
}

export interface ResolvedNda {
  intro: string;
  clauses: NdaClause[];
}

function interpolate(tpl: string, vars: Record<string, string>): string {
  return tpl
    .replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Fill the localized templates with the user's data. Used by preview and PDF. */
export function resolveNda(data: NdaData, t: NdaText): ResolvedNda {
  const dash = "—";
  const vars: Record<string, string> = {
    date: data.effectiveDate || dash,
    disclosing: data.disclosingName || dash,
    receiving: data.receivingName || dash,
    purpose: data.purpose || "…",
    term: String(data.termMonths || 0),
    law: data.governingLaw || dash,
    mutual: data.mutual ? t.mutualYes : t.mutualNo,
  };
  return {
    intro: interpolate(t.introTpl, vars),
    clauses: t.clauses.map((c) => ({ h: c.h, b: interpolate(c.b, vars) })),
  };
}

export function emptyNda(): NdaData {
  const today = new Date().toISOString().slice(0, 10);
  return {
    theme: "indigo",
    effectiveDate: today,
    mutual: false,
    disclosingName: "",
    disclosingDetails: "",
    receivingName: "",
    receivingDetails: "",
    purpose: "",
    termMonths: 24,
    governingLaw: "",
  };
}
