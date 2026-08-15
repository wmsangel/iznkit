import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { TEMPLATES, type InvoiceTemplate } from "@/lib/tools/invoice/templates";

/**
 * Static, crawlable gallery of the available invoice designs — the "examples
 * of how it looks" for the tool page. Each thumbnail mirrors the header style
 * and accent of a template.
 */
export function InvoiceDesigns({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold">{dict.content.designs}</h2>
      <p className="mt-1.5 text-sm text-[var(--muted)] max-w-2xl">
        {dict.content.designsIntro}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {TEMPLATES.map((tpl) => (
          <figure key={tpl.id}>
            <Thumb tpl={tpl} docTitle={dict.invoice.docTitle} total={dict.invoice.total} />
            <figcaption className="mt-2 flex items-center gap-1.5 text-sm">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tpl.accent }}
              />
              {tpl.label[locale]}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Bar({ w, dark }: { w: string; dark?: boolean }) {
  return (
    <div
      className="h-1.5 rounded"
      style={{ width: w, backgroundColor: dark ? "#cbd5e1" : "#e2e8f0" }}
    />
  );
}

function Thumb({
  tpl,
  docTitle,
  total,
}: {
  tpl: InvoiceTemplate;
  docTitle: string;
  total: string;
}) {
  const accent = tpl.accent;
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white overflow-hidden shadow-sm">
      {/* Header */}
      {tpl.header === "band" ? (
        <div className="px-4 py-3" style={{ backgroundColor: accent }}>
          <div className="text-white font-bold tracking-wide text-sm">{docTitle}</div>
        </div>
      ) : (
        <div className="px-4 pt-4 pb-2">
          <div
            className="font-bold tracking-wide text-sm"
            style={{ color: tpl.header === "minimal" ? "#0f172a" : accent }}
          >
            {docTitle}
          </div>
          {tpl.header === "minimal" ? (
            <div className="h-0.5 mt-2" style={{ backgroundColor: accent }} />
          ) : null}
        </div>
      )}

      {/* Body skeleton */}
      <div className="px-4 py-3 space-y-2.5">
        <div className="flex justify-between">
          <div className="space-y-1.5">
            <Bar w="70px" dark />
            <Bar w="50px" />
          </div>
          <div className="space-y-1.5 items-end flex flex-col">
            <Bar w="60px" dark />
            <Bar w="40px" />
          </div>
        </div>
        <div className="pt-1 space-y-1.5">
          <div className="flex justify-between">
            <Bar w="90px" />
            <Bar w="34px" />
          </div>
          <div className="flex justify-between">
            <Bar w="70px" />
            <Bar w="34px" />
          </div>
        </div>
        <div
          className="flex justify-between items-center pt-2 mt-1 border-t"
          style={{ borderColor: "#e2e8f0" }}
        >
          <span className="text-[10px] font-semibold text-slate-500 uppercase">
            {total}
          </span>
          <span className="text-sm font-bold" style={{ color: accent }}>
            $1,260
          </span>
        </div>
      </div>
    </div>
  );
}
