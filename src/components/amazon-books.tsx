"use client";

import { track } from "@/lib/analytics";
import { amazonSearch, booksForGuide } from "@/lib/amazon";

/**
 * "Recommended reading" — Amazon Associates book links for a guide. EN only (the page
 * gates on locale). No prices, no images (Amazon policy pre-PA-API); links are to an
 * Amazon search for the title, carry the Associates tag and rel="sponsored", and sit
 * above the required disclosure.
 */
export function AmazonBooks({ guideSlug }: { guideSlug: string }) {
  const books = booksForGuide(guideSlug);
  if (books.length === 0) return null;

  return (
    <section className="mt-14 max-w-2xl">
      <h2 className="text-xl font-semibold">Recommended reading</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {books.map((b) => (
          <li key={b.title}>
            <a
              href={amazonSearch(b.query)}
              target="_blank"
              rel="sponsored noopener"
              onClick={() => track("amazon_click", { guide: guideSlug, book: b.title })}
              className="group flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-colors hover:border-[var(--accent)]"
            >
              <span className="font-medium leading-snug group-hover:text-[var(--accent)] transition-colors">
                {b.title}
              </span>
              {b.author ? <span className="mt-0.5 text-sm text-[var(--muted)]">{b.author}</span> : null}
              <span className="mt-2 flex-1 text-sm text-[var(--muted)]">{b.why}</span>
              <span className="mt-3 text-sm font-medium text-[var(--accent)]">View on Amazon →</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-[var(--muted)] leading-relaxed">
        As an Amazon Associate, iznkit earns from qualifying purchases.{" "}
        <a href="/en/disclosure" className="underline hover:text-[var(--foreground)]">
          How this works
        </a>
        .
      </p>
    </section>
  );
}
