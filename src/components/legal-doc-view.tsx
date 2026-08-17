import type { LegalDoc } from "@/lib/legal";

export function LegalDocView({
  doc,
  updatedLabel,
}: {
  doc: LegalDoc;
  updatedLabel: string;
}) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{doc.title}</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {updatedLabel}: {doc.updated}
      </p>
      <p className="mt-6 text-[var(--muted)] leading-relaxed">{doc.intro}</p>

      <div className="mt-10 space-y-8">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-semibold">{s.h}</h2>
            <div className="mt-2 space-y-3 text-[var(--muted)] leading-relaxed text-[15px]">
              {s.p.map((para, i) =>
                Array.isArray(para) ? (
                  <ul key={i} className="list-disc pl-5 space-y-1">
                    {para.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{para}</p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
