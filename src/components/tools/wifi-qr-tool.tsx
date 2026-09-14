"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

type Enc = "WPA" | "WEP" | "nopass";

/** Escape per the Wi-Fi Network config QR spec: \ ; , " : must be backslash-escaped. */
function esc(s: string): string {
  return s.replace(/([\\;,":])/g, "\\$1");
}

function buildPayload(ssid: string, password: string, enc: Enc, hidden: boolean): string {
  const parts = [`T:${enc}`, `S:${esc(ssid)}`];
  if (enc !== "nopass") parts.push(`P:${esc(password)}`);
  if (hidden) parts.push("H:true");
  return `WIFI:${parts.join(";")};;`;
}

export function WifiQrTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).wifiQr;

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [enc, setEnc] = useState<Enc>("WPA");
  const [hidden, setHidden] = useState(false);
  const [fg, setFg] = useState("#111827");
  const [size, setSize] = useState(320);
  const [png, setPng] = useState("");

  const payload = ssid.trim() ? buildPayload(ssid, password, enc, hidden) : "";

  useEffect(() => {
    let cancelled = false;
    if (!payload) {
      setPng("");
      return;
    }
    QRCode.toDataURL(payload, {
      width: size,
      margin: 1,
      color: { dark: fg, light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        if (!cancelled) setPng(url);
      })
      .catch(() => {
        if (!cancelled) setPng("");
      });
    return () => {
      cancelled = true;
    };
  }, [payload, fg, size]);

  function download(href: string, name: string) {
    track("tool_use", { tool: "wifi-qr-code", action: "download" });
    const a = document.createElement("a");
    a.href = href;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function downloadPng() {
    if (png) download(png, "wifi-qr-code.png");
  }
  async function downloadSvg() {
    if (!payload) return;
    const svg = await QRCode.toString(payload, {
      type: "svg",
      margin: 1,
      color: { dark: fg, light: "#ffffff" },
      errorCorrectionLevel: "M",
    });
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    download(url, "wifi-qr-code.svg");
    URL.revokeObjectURL(url);
  }

  const inputCls =
    "w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]";
  const labelCls = "block text-xs font-medium text-[var(--muted)] mb-1";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div>
          <label className={labelCls}>{t.ssid}</label>
          <input
            className={inputCls}
            placeholder={t.ssidPlaceholder}
            value={ssid}
            onChange={(e) => setSsid(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div>
          <label className={labelCls}>{t.encryption}</label>
          <select className={inputCls} value={enc} onChange={(e) => setEnc(e.target.value as Enc)}>
            <option value="WPA">{t.wpa}</option>
            <option value="WEP">{t.wep}</option>
            <option value="nopass">{t.nopass}</option>
          </select>
        </div>
        {enc !== "nopass" ? (
          <div>
            <label className={labelCls}>{t.password}</label>
            <input
              className={inputCls}
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
            />
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm text-[var(--foreground)]">
          <input
            type="checkbox"
            checked={hidden}
            onChange={(e) => setHidden(e.target.checked)}
            className="accent-[var(--accent)]"
          />
          {t.hidden}
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t.fgColor}</label>
            <input
              type="color"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="h-10 w-16 rounded border border-[var(--border)] bg-transparent"
            />
          </div>
          <div>
            <label className={labelCls}>
              {t.size}: {size}px
            </label>
            <input
              type="range"
              min={160}
              max={800}
              step={20}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      <div className="lg:sticky lg:top-20 self-start space-y-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          {t.result}
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 grid place-items-center min-h-[220px]">
          {png ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={png}
              alt="Wi-Fi QR code"
              className="max-w-full h-auto rounded bg-white p-3"
              style={{ width: Math.min(size, 260) }}
            />
          ) : (
            <p className="text-sm text-[var(--muted)] text-center">{t.empty}</p>
          )}
        </div>
        {png ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={downloadPng}
              className="btn-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold"
            >
              {t.downloadPng}
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              className="flex-1 rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium hover:bg-[var(--background)]"
            >
              {t.downloadSvg}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
