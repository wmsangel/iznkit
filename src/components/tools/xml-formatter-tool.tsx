"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

const SAMPLE = `<?xml version="1.0"?><root><item id="1"><name>Alpha</name><tags><t>a</t><t>b</t></tags></item><item id="2"><name>Beta</name></item></root>`;

function parseXml(raw: string): { doc: Document | null; error: string | null } {
  if (typeof DOMParser === "undefined") return { doc: null, error: "DOMParser unavailable" };
  const doc = new DOMParser().parseFromString(raw, "application/xml");
  const err = doc.querySelector("parsererror");
  if (err) {
    const text = (err.textContent || "Invalid XML").replace(/\s+/g, " ").trim();
    return { doc: null, error: text.slice(0, 280) };
  }
  return { doc, error: null };
}

function serializeNode(node: Node, indentUnit: string, depth: number): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent || "").replace(/\s+/g, " ").trim();
    return text;
  }
  if (node.nodeType === Node.CDATA_SECTION_NODE) {
    return `<![CDATA[${node.textContent || ""}]]>`;
  }
  if (node.nodeType === Node.COMMENT_NODE) {
    const pad = indentUnit.repeat(depth);
    return `${pad}<!--${node.textContent || ""}-->`;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const el = node as Element;
  const pad = indentUnit.repeat(depth);
  const attrs = Array.from(el.attributes)
    .map((a) => ` ${a.name}="${a.value.replace(/"/g, "&quot;")}"`)
    .join("");
  const children = Array.from(el.childNodes);
  const meaningful = children.filter((c) => {
    if (c.nodeType === Node.TEXT_NODE) return (c.textContent || "").trim().length > 0;
    return (
      c.nodeType === Node.ELEMENT_NODE ||
      c.nodeType === Node.COMMENT_NODE ||
      c.nodeType === Node.CDATA_SECTION_NODE
    );
  });

  if (!meaningful.length) return `${pad}<${el.tagName}${attrs}/>`;

  const onlyText =
    meaningful.length === 1 && meaningful[0].nodeType === Node.TEXT_NODE;
  if (onlyText) {
    const text = serializeNode(meaningful[0], indentUnit, depth + 1);
    return `${pad}<${el.tagName}${attrs}>${text}</${el.tagName}>`;
  }

  const inner = meaningful
    .map((c) => serializeNode(c, indentUnit, depth + 1))
    .filter(Boolean)
    .join("\n");
  return `${pad}<${el.tagName}${attrs}>\n${inner}\n${pad}</${el.tagName}>`;
}

function beautifyXml(doc: Document, indent: "2" | "4" | "tab"): string {
  const unit = indent === "tab" ? "\t" : " ".repeat(Number(indent));
  const root = doc.documentElement;
  if (!root) return "";
  const body = serializeNode(root, unit, 0);
  const hasDecl = doc.firstChild?.nodeType === Node.PROCESSING_INSTRUCTION_NODE;
  return (hasDecl ? `<?xml version="1.0"?>\n` : "") + body;
}

function minifyXml(doc: Document): string {
  const root = doc.documentElement;
  if (!root) return "";
  return serializeNode(root, "", 0).replace(/>\s+</g, "><");
}

export function XmlFormatterTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).xmlFormatter;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState<"2" | "4" | "tab">("2");
  const [copied, setCopied] = useState(false);

  function run(mode: "beautify" | "minify") {
    if (!input.trim()) {
      setOutput("");
      setError(null);
      return;
    }
    const { doc, error: parseError } = parseXml(input);
    if (!doc || parseError) {
      setError(parseError || t.invalid);
      setOutput("");
      return;
    }
    setError(null);
    setOutput(mode === "minify" ? minifyXml(doc) : beautifyXml(doc, indent));
    track("tool_use", { tool: "xml-formatter", action: "convert" });
  }

  function clear() {
    setInput("");
    setOutput("");
    setError(null);
  }

  async function copy() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      track("tool_use", { tool: "xml-formatter", action: "copy" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const area =
    "w-full h-80 rounded-xl border bg-[var(--card)] p-3 font-mono text-[13px] leading-relaxed outline-none resize-none";
  const btn =
    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:opacity-50";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => run("beautify")} className={`btn-primary ${btn}`}>
          {t.beautify}
        </button>
        <button type="button" onClick={() => run("minify")} className={`btn-outline ${btn}`}>
          {t.minify}
        </button>
        <button type="button" onClick={() => setInput(SAMPLE)} className={`btn-outline ${btn}`}>
          {t.sample}
        </button>
        <button type="button" onClick={clear} className={`btn-outline ${btn}`}>
          {t.clear}
        </button>

        <div className="ml-auto flex items-center gap-2 text-sm">
          <span className="text-[var(--muted)]">{t.indent}:</span>
          {(["2", "4", "tab"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setIndent(v)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                indent === v
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {v === "tab" ? t.tab : `${v} ${t.spaces}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <label className="eyebrow mb-2 inline-block">{t.input}</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.placeholder}
            spellCheck={false}
            className={`${area} ${error ? "border-[var(--bad)]" : "border-[var(--border)]"} focus:border-[var(--accent)]`}
          />
          {error ? <p className="mt-2 text-sm text-[var(--bad)]">{error}</p> : null}
        </div>
        <div>
          <div className="flex items-center justify-between mb-2 h-[18px]">
            <span className="eyebrow">{t.output}</span>
            {output ? (
              <button
                type="button"
                onClick={copy}
                className="text-xs font-medium text-[var(--accent)] hover:underline"
              >
                {copied ? t.copied : t.copy}
              </button>
            ) : null}
          </div>
          <textarea
            readOnly
            value={output}
            placeholder={t.empty}
            className={`${area} border-[var(--border)]`}
          />
        </div>
      </div>
    </div>
  );
}
