"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

function b64urlToJson(seg: string): unknown {
  const norm = seg.replace(/-/g, "+").replace(/_/g, "/");
  const pad = norm + "=".repeat((4 - (norm.length % 4)) % 4);
  const bin = atob(pad);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

type Decoded = {
  header: unknown;
  payload: Record<string, unknown>;
  signature: string;
};

function fmtDate(v: unknown): string | null {
  if (typeof v !== "number") return null;
  try {
    return new Date(v * 1000).toLocaleString();
  } catch {
    return null;
  }
}

export function JwtTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).jwt;
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState<"header" | "payload" | null>(null);

  const { decoded, error } = useMemo(() => {
    const raw = token.trim();
    if (!raw) return { decoded: null as Decoded | null, error: null as string | null };
    const parts = raw.split(".");
    if (parts.length < 2) return { decoded: null, error: t.invalid };
    try {
      return {
        decoded: {
          header: b64urlToJson(parts[0]),
          payload: b64urlToJson(parts[1]) as Record<string, unknown>,
          signature: parts[2] ?? "",
        },
        error: null,
      };
    } catch {
      return { decoded: null, error: t.invalid };
    }
  }, [token, t.invalid]);

  async function copy(which: "header" | "payload", value: unknown) {
    try {
      await navigator.clipboard.writeText(JSON.stringify(value, null, 2));
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const now = Date.now() / 1000;
  const exp = decoded && typeof decoded.payload.exp === "number" ? decoded.payload.exp : null;
  const claims: { label: string; value: string; badge?: "expired" | "valid" }[] = [];
  if (decoded) {
    const iat = fmtDate(decoded.payload.iat);
    const nbf = fmtDate(decoded.payload.nbf);
    const expStr = fmtDate(decoded.payload.exp);
    if (iat) claims.push({ label: t.issuedAt, value: iat });
    if (nbf) claims.push({ label: t.notBefore, value: nbf });
    if (expStr)
      claims.push({
        label: t.expiresAt,
        value: expStr,
        badge: exp !== null && exp < now ? "expired" : "valid",
      });
  }

  const pre =
    "rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed overflow-x-auto whitespace-pre";

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <label className="eyebrow mb-2 inline-block">{t.input}</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t.placeholder}
          spellCheck={false}
          className={`w-full h-28 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none break-all ${
            error ? "border-[var(--bad)]" : "border-[var(--border)]"
          } focus:border-[var(--accent)]`}
        />
      </div>

      {error ? <p className="text-sm text-[var(--bad)]">⚠ {error}</p> : null}

      {decoded ? (
        <div className="space-y-5">
          {claims.length ? (
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {claims.map((c) => (
                <div key={c.label} className="flex items-center gap-2">
                  <span className="text-[var(--muted)]">{c.label}:</span>
                  <span className="font-medium tabular-nums">{c.value}</span>
                  {c.badge ? (
                    <span
                      className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        color: c.badge === "expired" ? "var(--bad)" : "var(--good)",
                        background:
                          c.badge === "expired"
                            ? "color-mix(in oklab, var(--bad) 12%, transparent)"
                            : "color-mix(in oklab, var(--good) 14%, transparent)",
                      }}
                    >
                      {c.badge === "expired" ? t.expired : t.valid}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          <Section
            title={t.header}
            onCopy={() => copy("header", decoded.header)}
            copyLabel={copied === "header" ? t.copied : t.copy}
          >
            <pre className={pre}>{JSON.stringify(decoded.header, null, 2)}</pre>
          </Section>

          <Section
            title={t.payload}
            onCopy={() => copy("payload", decoded.payload)}
            copyLabel={copied === "payload" ? t.copied : t.copy}
          >
            <pre className={pre}>{JSON.stringify(decoded.payload, null, 2)}</pre>
          </Section>

          <div>
            <div className="eyebrow mb-2">{t.signature}</div>
            <pre className={`${pre} break-all whitespace-pre-wrap text-[var(--muted)]`}>
              {decoded.signature || "—"}
            </pre>
            <p className="mt-2 text-xs text-[var(--muted)]">{t.sigNote}</p>
          </div>
        </div>
      ) : !error ? (
        <p className="text-sm text-[var(--muted)]">{t.empty}</p>
      ) : null}
    </div>
  );
}

function Section({
  title,
  onCopy,
  copyLabel,
  children,
}: {
  title: string;
  onCopy: () => void;
  copyLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="eyebrow">{title}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs font-medium text-[var(--accent)] hover:underline"
        >
          {copyLabel}
        </button>
      </div>
      {children}
    </div>
  );
}
