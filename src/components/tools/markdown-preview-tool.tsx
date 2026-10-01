"use client";

import { useState } from "react";
import { marked } from "marked";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

const SAMPLE = `# Markdown → HTML

Write **Markdown** on the left, see the preview on the right.

- Bullet lists
- [Links](https://iznkit.com)
- \`inline code\`

> Blockquotes work too.

| Tool | Free |
| ---- | ---- |
| iznkit | yes |

\`\`\`js
const x = 1;
\`\`\`
`;

/** Wrap generated HTML in a minimal, readable document for the sandboxed preview. */
function previewDoc(html: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
    body{font:14px/1.65 system-ui,-apple-system,sans-serif;color:#1a1a1a;background:#fff;margin:16px}
    h1,h2,h3{line-height:1.25}
    pre{background:#f3f4f3;padding:12px;border-radius:8px;overflow:auto}
    code{font-family:ui-monospace,SFMono-Regular,monospace;font-size:.92em}
    pre code{font-size:.85rem}
    img{max-width:100%}
    table{border-collapse:collapse} th,td{border:1px solid #dce0dd;padding:6px 10px;text-align:left}
    blockquote{border-left:3px solid #d7dcd8;margin:0;padding-left:12px;color:#555}
    a{color:#0f8a57}
  </style></head><body>${html}</body></html>`;
}

export function MarkdownPreviewTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).mdPreview;
  const [input, setInput] = useState(SAMPLE);
  const [tab, setTab] = useState<"preview" | "html">("preview");
  const [copied, setCopied] = useState(false);

  const html = (marked.parse(input, { async: false }) as string) || "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(html);
      track("tool_use", { tool: "markdown-preview", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const areaCls =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm font-mono leading-relaxed outline-none focus:border-[var(--accent)] resize-y";
  const tabCls = (active: boolean) =>
    `flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--muted)] hover:text-[var(--foreground)]"
    }`;

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.input}
          rows={18}
          spellCheck={false}
          className={areaCls}
        />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-lg border border-[var(--border)] p-1 flex-1 max-w-56">
              <button type="button" className={tabCls(tab === "preview")} onClick={() => setTab("preview")}>
                {t.preview}
              </button>
              <button type="button" className={tabCls(tab === "html")} onClick={() => setTab("html")}>
                {t.html}
              </button>
            </div>
            <button
              type="button"
              onClick={copy}
              className="rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
            >
              {copied ? t.copied : t.copy}
            </button>
          </div>

          {tab === "preview" ? (
            <iframe
              title={t.preview}
              sandbox=""
              srcDoc={previewDoc(html)}
              className="w-full h-[420px] rounded-xl border border-[var(--border)] bg-white"
            />
          ) : (
            <textarea
              value={html}
              readOnly
              rows={16}
              className={areaCls}
            />
          )}
        </div>
      </div>
    </div>
  );
}
