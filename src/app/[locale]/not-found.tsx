import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link href="/en" className="inline-flex items-center gap-2.5">
          <span className="grid place-items-center w-8 h-8 rounded-md bg-[var(--accent)] text-[var(--accent-fg)] font-mono font-semibold text-[13px]">
            iz
          </span>
          <span className="font-mono font-semibold text-lg tracking-tight">iznkit</span>
        </Link>
        <div className="mt-10">
          <span className="eyebrow justify-center">Error 404</span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">This page went missing</h1>
        <p className="mt-3 text-[var(--muted)]">
          The link may be broken or the tool moved. Let&apos;s get you back to the tools.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/en"
            className="btn-primary inline-flex rounded-lg px-6 py-3 text-sm font-medium"
          >
            All tools
          </Link>
          <Link
            href="/ru"
            className="btn-outline inline-flex rounded-lg px-6 py-3 text-sm font-medium"
          >
            Русская версия
          </Link>
        </div>
      </div>
    </main>
  );
}
