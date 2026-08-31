import type { Locale } from "@/lib/i18n/config";

/** Parsed 5-field cron expression: an allowed-value set per field. */
export interface CronFields {
  minutes: Set<number>;
  hours: Set<number>;
  doms: Set<number>;
  months: Set<number>;
  dows: Set<number>; // 0 = Sunday
  domRestricted: boolean;
  dowRestricted: boolean;
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const DOWS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function parseField(
  raw: string,
  min: number,
  max: number,
  names?: string[],
): Set<number> | null {
  const set = new Set<number>();
  const token = (s: string): number | null => {
    const low = s.toLowerCase();
    if (names) {
      const idx = names.indexOf(low);
      if (idx >= 0) return idx + (names === MONTHS ? 1 : 0);
    }
    if (!/^\d+$/.test(s)) return null;
    return Number(s);
  };

  for (const part of raw.split(",")) {
    if (!part) return null;
    let step = 1;
    let range = part;
    const slash = part.split("/");
    if (slash.length === 2) {
      range = slash[0];
      if (!/^\d+$/.test(slash[1])) return null;
      step = Number(slash[1]);
      if (step < 1) return null;
    } else if (slash.length > 2) return null;

    let lo: number;
    let hi: number;
    if (range === "*") {
      lo = min;
      hi = max;
    } else {
      const dash = range.split("-");
      if (dash.length === 1) {
        const v = token(dash[0]);
        if (v === null) return null;
        lo = v;
        hi = slash.length === 2 ? max : v; // "a/n" means a, a+n, … up to max
      } else if (dash.length === 2) {
        const a = token(dash[0]);
        const b = token(dash[1]);
        if (a === null || b === null) return null;
        lo = a;
        hi = b;
      } else return null;
    }
    if (lo < min || hi > max || lo > hi) return null;
    for (let v = lo; v <= hi; v += step) set.add(v);
  }
  return set.size ? set : null;
}

/** Parse a standard 5-field cron expression, or return null if invalid. */
export function parseCron(expr: string): CronFields | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const minutes = parseField(parts[0], 0, 59);
  const hours = parseField(parts[1], 0, 23);
  const doms = parseField(parts[2], 1, 31);
  const months = parseField(parts[3], 1, 12, MONTHS);
  let dows = parseField(parts[4], 0, 7, DOWS);
  if (!minutes || !hours || !doms || !months || !dows) return null;

  // Normalise Sunday (7 -> 0).
  if (dows.has(7)) {
    dows = new Set(dows);
    dows.delete(7);
    dows.add(0);
  }

  return {
    minutes,
    hours,
    doms,
    months,
    dows,
    domRestricted: parts[2] !== "*",
    dowRestricted: parts[4] !== "*",
  };
}

/** Does a given local time match the cron fields? */
function matches(f: CronFields, d: Date): boolean {
  if (!f.minutes.has(d.getMinutes())) return false;
  if (!f.hours.has(d.getHours())) return false;
  if (!f.months.has(d.getMonth() + 1)) return false;
  const domOk = f.doms.has(d.getDate());
  const dowOk = f.dows.has(d.getDay());
  // Cron rule: if both day-of-month and day-of-week are restricted, either may match.
  if (f.domRestricted && f.dowRestricted) return domOk || dowOk;
  if (f.domRestricted) return domOk;
  if (f.dowRestricted) return dowOk;
  return true;
}

/** Up to `count` upcoming run times (local), searching at most ~1 year ahead. */
export function nextRuns(f: CronFields, from: Date, count: number): Date[] {
  const out: Date[] = [];
  const d = new Date(from.getTime());
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1); // strictly after `from`
  const limit = 366 * 24 * 60;
  for (let i = 0; i < limit && out.length < count; i++) {
    if (matches(f, d)) out.push(new Date(d.getTime()));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}

// ---- Human-readable description ------------------------------------------

const L = {
  en: {
    everyMinute: "Every minute",
    everyNMin: (n: number) => `Every ${n} minutes`,
    hourlyAt: (m: number) => `Every hour at minute ${m}`,
    dailyAt: (t: string) => `Every day at ${t}`,
    weekdaysAt: (days: string, t: string) => `Every ${days} at ${t}`,
    domAt: (dom: string, t: string) => `On day ${dom} of every month at ${t}`,
    monthDomAt: (mon: string, dom: string, t: string) => `On ${mon} ${dom} at ${t}`,
    custom: "Custom schedule — see the field breakdown below",
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    sep: ", ",
    and: " and ",
  },
  ru: {
    everyMinute: "Каждую минуту",
    everyNMin: (n: number) => `Каждые ${n} минут`,
    hourlyAt: (m: number) => `Каждый час на ${m}-й минуте`,
    dailyAt: (t: string) => `Каждый день в ${t}`,
    weekdaysAt: (days: string, t: string) => `Каждый ${days} в ${t}`,
    domAt: (dom: string, t: string) => `${dom}-го числа каждого месяца в ${t}`,
    monthDomAt: (mon: string, dom: string, t: string) => `${dom} ${mon} в ${t}`,
    custom: "Своё расписание — см. разбор по полям ниже",
    days: ["воскресенье", "понедельник", "вторник", "среду", "четверг", "пятницу", "субботу"],
    months: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
    sep: ", ",
    and: " и ",
  },
} as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function listNames(set: Set<number>, names: readonly string[], base: number, loc: keyof typeof L): string {
  const arr = [...set].sort((a, b) => a - b).map((v) => names[v - base]);
  if (arr.length === 1) return arr[0];
  return arr.slice(0, -1).join(L[loc].sep) + L[loc].and + arr[arr.length - 1];
}

const isAll = (s: Set<number>, min: number, max: number) => s.size === max - min + 1;

/** Best-effort plain-language summary for common cron shapes. */
export function describeCron(f: CronFields, rawParts: string[], locale: Locale): string {
  const t = L[locale];
  const [rawMin, rawHour, rawDom, rawMon, rawDow] = rawParts;
  const minAll = isAll(f.minutes, 0, 59);
  const hourAll = isAll(f.hours, 0, 23);
  const oneMin = f.minutes.size === 1 ? [...f.minutes][0] : null;
  const oneHour = f.hours.size === 1 ? [...f.hours][0] : null;
  const time = oneMin !== null && oneHour !== null ? `${pad(oneHour)}:${pad(oneMin)}` : null;

  if (minAll && hourAll && !f.domRestricted && !f.dowRestricted) return t.everyMinute;

  const stepMin = /^\*\/(\d+)$/.exec(rawMin);
  if (stepMin && hourAll && !f.domRestricted && !f.dowRestricted) return t.everyNMin(Number(stepMin[1]));

  if (oneMin !== null && hourAll && !f.domRestricted && !f.dowRestricted) return t.hourlyAt(oneMin);

  if (time && !f.domRestricted && !f.dowRestricted && rawMon === "*") return t.dailyAt(time);

  if (time && f.dowRestricted && !f.domRestricted && rawMon === "*") {
    return t.weekdaysAt(listNames(f.dows, t.days, 0, locale), time);
  }

  if (time && f.domRestricted && !f.dowRestricted && rawMon === "*") {
    return t.domAt(listNames(f.doms, [...Array(31)].map((_, i) => String(i + 1)), 1, locale), time);
  }

  if (time && f.domRestricted && !f.dowRestricted && rawMon !== "*") {
    const dom = listNames(f.doms, [...Array(31)].map((_, i) => String(i + 1)), 1, locale);
    return t.monthDomAt(listNames(f.months, t.months, 1, locale), dom, time);
  }

  return t.custom;
}
