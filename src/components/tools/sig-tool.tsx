"use client";
import { track } from "@/lib/analytics";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const STORAGE_KEY = "izn.tools:sig:draft";
const MAX_AVATAR_BYTES = 512 * 1024;

interface SigData {
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  avatar: string | null;
  accent: string;
}

function empty(): SigData {
  return {
    name: "",
    role: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    linkedin: "",
    avatar: null,
    accent: "#4f46e5",
  };
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Email-safe, table-based HTML signature with inline styles. */
function buildHtml(d: SigData): string {
  const a = d.accent || "#4f46e5";
  const url = d.website && !/^https?:\/\//i.test(d.website) ? `https://${d.website}` : d.website;
  const rows: string[] = [];
  if (d.role || d.company) {
    rows.push(
      `<div style="font-size:13px;color:#555;margin-top:2px;">${esc(d.role)}${d.role && d.company ? " · " : ""}<span style="color:${a};font-weight:600;">${esc(d.company)}</span></div>`,
    );
  }
  const contacts: string[] = [];
  if (d.phone) contacts.push(`<a href="tel:${esc(d.phone.replace(/[^+\d]/g, ""))}" style="color:#555;text-decoration:none;">${esc(d.phone)}</a>`);
  if (d.email) contacts.push(`<a href="mailto:${esc(d.email)}" style="color:#555;text-decoration:none;">${esc(d.email)}</a>`);
  if (url) contacts.push(`<a href="${esc(url)}" style="color:${a};text-decoration:none;">${esc(d.website)}</a>`);
  if (d.linkedin) contacts.push(`<a href="${esc(d.linkedin)}" style="color:${a};text-decoration:none;">LinkedIn</a>`);
  if (contacts.length) {
    rows.push(`<div style="font-size:12px;color:#555;margin-top:8px;line-height:1.7;">${contacts.join('<span style="color:#ccc;"> &nbsp;|&nbsp; </span>')}</div>`);
  }

  const avatarCell = d.avatar
    ? `<td style="padding-right:16px;vertical-align:top;"><img src="${esc(d.avatar)}" width="64" height="64" alt="" style="width:64px;height:64px;border-radius:50%;object-fit:cover;display:block;border:0;" /></td>`
    : "";
  const border = `<td style="border-left:3px solid ${a};padding-left:16px;vertical-align:top;">`;

  return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;color:#111;"><tr>${avatarCell}${border}<div style="font-size:16px;font-weight:700;color:#111;">${esc(d.name) || "&nbsp;"}</div>${rows.join("")}</td></tr></table>`;
}

export function SigTool({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.sig;

  const [d, setD] = useState<SigData>(empty);
  const [copied, setCopied] = useState<"" | "rich" | "code">("");
  const avatarInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setD({ ...empty(), ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
    } catch {
      /* ignore */
    }
  }, [d]);

  const html = useMemo(() => buildHtml(d), [d]);

  function set<K extends keyof SigData>(key: K, value: SigData[K]) {
    setD((s) => ({ ...s, [key]: value }));
    setCopied("");
  }
  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/") || file.size > MAX_AVATAR_BYTES) return;
    const reader = new FileReader();
    reader.onload = () => set("avatar", String(reader.result));
    reader.readAsDataURL(file);
  }
  async function copyRich() {
    try {
      const blob = new Blob([html], { type: "text/html" });
      const plain = new Blob([html], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({ "text/html": blob, "text/plain": plain }),
      ]);
      setCopied("rich");
    } catch {
      try {
        await navigator.clipboard.writeText(html);
        track("tool_use", { tool: "email-signature", action: "copy" });
        setCopied("rich");
      } catch {
        /* ignore */
      }
    }
  }
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(html);
      track("tool_use", { tool: "email-signature", action: "copy" });
      setCopied("code");
    } catch {
      /* ignore */
    }
  }
  function reset() {
    setD(empty());
    if (avatarInput.current) avatarInput.current.value = "";
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";
  const field = (key: keyof SigData, label: string) => (
    <div>
      <label className={labelCls}>{label}</label>
      <input className={inputCls} value={(d[key] as string) ?? ""} onChange={(e) => set(key, e.target.value as SigData[typeof key])} />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {d.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.avatar} alt="" className="w-10 h-10 rounded-full object-cover border border-[var(--border)]" />
            ) : null}
            <label className="text-sm text-[var(--accent)] hover:underline cursor-pointer">
              {d.avatar ? t.avatar : `+ ${t.uploadAvatar}`}
              <input ref={avatarInput} type="file" accept="image/*" className="hidden" onChange={onAvatar} />
            </label>
            {d.avatar ? (
              <button type="button" onClick={() => { set("avatar", null); if (avatarInput.current) avatarInput.current.value = ""; }} className="text-sm text-[var(--muted)] hover:text-red-500">
                {t.removeAvatar}
              </button>
            ) : null}
          </div>
          <button type="button" onClick={reset} className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">↺ {t.reset}</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {field("name", t.name)}
          {field("role", t.role)}
          {field("company", t.company)}
          {field("phone", t.phone)}
          {field("email", t.email)}
          {field("website", t.website)}
        </div>
        {field("linkedin", t.linkedin)}
        <div>
          <label className={labelCls}>{t.accent}</label>
          <input type="color" value={d.accent} onChange={(e) => set("accent", e.target.value)} className="h-10 w-16 rounded border border-[var(--border)] bg-transparent" />
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{t.preview}</div>
        <div className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <p className="text-xs text-[var(--muted)]">{t.howTo}</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <button type="button" onClick={copyRich} className="btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold">
              {copied === "rich" ? t.copied : t.copyHtml}
            </button>
            <button type="button" onClick={copyCode} className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--background)]">
              {copied === "code" ? t.copied : t.copyCode}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
