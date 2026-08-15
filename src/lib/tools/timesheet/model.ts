import { round2 } from "@/lib/format";

export interface TimeEntry {
  date: string;
  hours: number;
  note: string;
}

export interface TimesheetData {
  logo: string | null;
  workerName: string;
  project: string;
  period: string;
  currency: string;
  hourlyRate: number;
  entries: TimeEntry[];
}

export function timesheetTotals(data: TimesheetData): { totalHours: number; totalPay: number } {
  const totalHours = round2(data.entries.reduce((s, e) => s + (Number(e.hours) || 0), 0));
  const totalPay = round2(totalHours * (Number(data.hourlyRate) || 0));
  return { totalHours, totalPay };
}

export function emptyTimesheet(): TimesheetData {
  return {
    logo: null,
    workerName: "",
    project: "",
    period: "",
    currency: "USD",
    hourlyRate: 0,
    entries: [{ date: new Date().toISOString().slice(0, 10), hours: 8, note: "" }],
  };
}
