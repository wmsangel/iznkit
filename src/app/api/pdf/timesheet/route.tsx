import { NextRequest } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ensureFonts } from "@/lib/pdf/fonts";
import { TimesheetDocument, type TimesheetLabels } from "@/lib/pdf/timesheet-document";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { verifyUnlock } from "@/lib/payments/provider";
import type { TimesheetData } from "@/lib/tools/timesheet/model";

export const runtime = "nodejs";
const SKU = "tool:timesheet";

export async function POST(req: NextRequest) {
  let body: { data?: TimesheetData; locale?: string; unlockToken?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }
  if (!body.data || !Array.isArray(body.data.entries)) {
    return new Response("Missing data", { status: 400 });
  }
  const locale = body.locale && isLocale(body.locale) ? body.locale : defaultLocale;
  const dict = getDictionary(locale);
  const unlocked = verifyUnlock(body.unlockToken, SKU);
  const t = dict.timesheet;
  const labels: TimesheetLabels = {
    docTitle: t.docTitle,
    workerName: t.workerName,
    project: t.project,
    period: t.period,
    date: t.date,
    hours: t.hours,
    note: t.note,
    totalHours: t.totalHours,
    totalPay: t.totalPay,
    hourlyRate: t.hourlyRate,
    signature: t.signature,
  };
  ensureFonts();
  const buffer = await renderToBuffer(
    <TimesheetDocument data={body.data} labels={labels} brand={dict.brand.name} watermark={!unlocked} />,
  );
  const filename = `timesheet${unlocked ? "" : "-preview"}.pdf`;
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
