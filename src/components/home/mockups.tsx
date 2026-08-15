import type { getDictionary } from "@/lib/i18n/dictionaries";

type Dict = ReturnType<typeof getDictionary>;

/**
 * A quiet, realistic invoice preview for the hero. No glow, no gradients —
 * just the product, framed on paper.
 */
export function InvoiceMockup({ dict }: { dict: Dict }) {
  const t = dict.invoice;
  return (
    <div className="mx-auto w-full max-w-md">
      <div className="card rounded-xl overflow-hidden" style={{ boxShadow: "var(--shadow-lg)" }}>
        <div className="bg-white text-slate-900">
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <div className="text-lg font-bold tracking-wide" style={{ color: "var(--accent)" }}>
                {t.docTitle}
              </div>
              <div className="mt-1 h-[3px] w-10 rounded" style={{ backgroundColor: "var(--accent)" }} />
            </div>
            <div className="text-right text-[11px] text-slate-500">
              <div>#0042</div>
              <div className="mt-1">2026-08-15</div>
            </div>
          </div>
          <div className="px-6 pb-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <div className="space-y-1.5">
                <div className="h-2.5 w-24 rounded bg-slate-300" />
                <div className="h-2 w-16 rounded bg-slate-200" />
              </div>
              <div className="space-y-1.5 flex flex-col items-end">
                <div className="h-2.5 w-20 rounded bg-slate-300" />
                <div className="h-2 w-14 rounded bg-slate-200" />
              </div>
            </div>
            <div className="space-y-2 pt-1">
              {["100%", "92%", "84%"].map((w, i) => (
                <div key={i} className="flex items-center justify-between gap-6">
                  <div className="h-2 rounded bg-slate-200" style={{ width: w, maxWidth: 190 }} />
                  <div className="h-2 w-12 rounded bg-slate-200 shrink-0" />
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {t.total}
              </span>
              <span className="text-xl font-bold text-slate-900">$1,260.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
