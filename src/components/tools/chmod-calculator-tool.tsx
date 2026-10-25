"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { track } from "@/lib/analytics";

type Triad = { r: boolean; w: boolean; x: boolean };

function triadToBits(t: Triad): number {
  return (t.r ? 4 : 0) + (t.w ? 2 : 0) + (t.x ? 1 : 0);
}

function bitsToTriad(n: number): Triad {
  return { r: (n & 4) !== 0, w: (n & 2) !== 0, x: (n & 1) !== 0 };
}

function triadToSymbolic(t: Triad): string {
  return `${t.r ? "r" : "-"}${t.w ? "w" : "-"}${t.x ? "x" : "-"}`;
}

function specialChar(bit: number, exec: boolean, letter: "s" | "t"): string {
  if (bit && exec) return letter;
  if (bit && !exec) return letter.toUpperCase();
  return exec ? "x" : "-";
}

export function ChmodCalculatorTool({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).chmodCalculator;
  const [owner, setOwner] = useState<Triad>({ r: true, w: true, x: true });
  const [group, setGroup] = useState<Triad>({ r: true, w: false, x: true });
  const [other, setOther] = useState<Triad>({ r: true, w: false, x: true });
  const [showSpecial, setShowSpecial] = useState(false);
  const [setuid, setSetuid] = useState(false);
  const [setgid, setSetgid] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [octalInput, setOctalInput] = useState("755");
  const [copied, setCopied] = useState<string | null>(null);

  const specialBits = (setuid ? 4 : 0) + (setgid ? 2 : 0) + (sticky ? 1 : 0);
  const mode = triadToBits(owner) * 64 + triadToBits(group) * 8 + triadToBits(other);
  const octal = showSpecial
    ? `${specialBits}${mode.toString(8).padStart(3, "0")}`
    : mode.toString(8).padStart(3, "0");

  const symbolic = useMemo(() => {
    const o = triadToSymbolic(owner);
    const g = triadToSymbolic(group);
    const th = triadToSymbolic(other);
    if (!showSpecial) return o + g + th;
    const oChars = o.split("") as [string, string, string];
    const gChars = g.split("") as [string, string, string];
    const tChars = th.split("") as [string, string, string];
    oChars[2] = specialChar(setuid ? 1 : 0, owner.x, "s");
    gChars[2] = specialChar(setgid ? 1 : 0, group.x, "s");
    tChars[2] = specialChar(sticky ? 1 : 0, other.x, "t");
    return oChars.join("") + gChars.join("") + tChars.join("");
  }, [owner, group, other, showSpecial, setuid, setgid, sticky]);

  const command = `chmod ${octal} file`;

  function applyOctal(raw: string) {
    const cleaned = raw.replace(/\D/g, "").slice(0, 4);
    setOctalInput(cleaned);
    if (!cleaned) return;
    if (cleaned.length === 3 || cleaned.length === 4) {
      const n = parseInt(cleaned, 8);
      if (Number.isNaN(n) || n > 0o7777) return;
      const body = cleaned.length === 4 ? cleaned.slice(1) : cleaned;
      const special = cleaned.length === 4 ? parseInt(cleaned[0], 8) : 0;
      const o = parseInt(body[0], 8);
      const g = parseInt(body[1], 8);
      const th = parseInt(body[2], 8);
      if ([o, g, th].some((v) => v > 7)) return;
      setOwner(bitsToTriad(o));
      setGroup(bitsToTriad(g));
      setOther(bitsToTriad(th));
      if (cleaned.length === 4) {
        setShowSpecial(true);
        setSetuid((special & 4) !== 0);
        setSetgid((special & 2) !== 0);
        setSticky((special & 1) !== 0);
      } else {
        setSetuid(false);
        setSetgid(false);
        setSticky(false);
      }
    }
  }

  function syncOctalFromChecks(
    nextOwner: Triad,
    nextGroup: Triad,
    nextOther: Triad,
    nextSpecial: { setuid: boolean; setgid: boolean; sticky: boolean; show: boolean },
  ) {
    const m =
      triadToBits(nextOwner) * 64 + triadToBits(nextGroup) * 8 + triadToBits(nextOther);
    const sp =
      (nextSpecial.setuid ? 4 : 0) + (nextSpecial.setgid ? 2 : 0) + (nextSpecial.sticky ? 1 : 0);
    setOctalInput(
      nextSpecial.show ? `${sp}${m.toString(8).padStart(3, "0")}` : m.toString(8).padStart(3, "0"),
    );
  }

  function toggle(
    who: "owner" | "group" | "other",
    bit: keyof Triad,
  ) {
    const cur = who === "owner" ? owner : who === "group" ? group : other;
    const next = { ...cur, [bit]: !cur[bit] };
    const nextOwner = who === "owner" ? next : owner;
    const nextGroup = who === "group" ? next : group;
    const nextOther = who === "other" ? next : other;
    if (who === "owner") setOwner(next);
    else if (who === "group") setGroup(next);
    else setOther(next);
    syncOctalFromChecks(nextOwner, nextGroup, nextOther, {
      setuid,
      setgid,
      sticky,
      show: showSpecial,
    });
  }

  async function copy(key: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      track("tool_use", { tool: "chmod-calculator", action: "copy" });
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
    } catch {
      /* clipboard blocked */
    }
  }

  const roles: { key: "owner" | "group" | "other"; label: string; value: Triad }[] = [
    { key: "owner", label: t.owner, value: owner },
    { key: "group", label: t.group, value: group },
    { key: "other", label: t.other, value: other },
  ];

  const checkCls =
    "flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm";

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid gap-4 sm:grid-cols-3">
        {roles.map(({ key, label, value }) => (
          <div key={key} className="space-y-2">
            <div className="eyebrow">{label}</div>
            {(
              [
                ["r", t.read],
                ["w", t.write],
                ["x", t.execute],
              ] as const
            ).map(([bit, bitLabel]) => (
              <label key={bit} className={checkCls}>
                <input
                  type="checkbox"
                  checked={value[bit]}
                  onChange={() => toggle(key, bit)}
                  className="accent-[var(--accent)]"
                />
                <span>{bitLabel}</span>
              </label>
            ))}
          </div>
        ))}
      </div>

      <label className={checkCls + " w-fit"}>
        <input
          type="checkbox"
          checked={showSpecial}
          onChange={(e) => {
            const show = e.target.checked;
            setShowSpecial(show);
            syncOctalFromChecks(owner, group, other, { setuid, setgid, sticky, show });
          }}
          className="accent-[var(--accent)]"
        />
        <span>{t.specialBits}</span>
      </label>

      {showSpecial ? (
        <div className="flex flex-wrap gap-3">
          {(
            [
              ["setuid", setuid, setSetuid, t.setuid],
              ["setgid", setgid, setSetgid, t.setgid],
              ["sticky", sticky, setSticky, t.sticky],
            ] as const
          ).map(([id, val, setVal, label]) => (
            <label key={id} className={checkCls}>
              <input
                type="checkbox"
                checked={val}
                onChange={(e) => {
                  const on = e.target.checked;
                  setVal(on);
                  syncOctalFromChecks(owner, group, other, {
                    setuid: id === "setuid" ? on : setuid,
                    setgid: id === "setgid" ? on : setgid,
                    sticky: id === "sticky" ? on : sticky,
                    show: true,
                  });
                }}
                className="accent-[var(--accent)]"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      ) : null}

      <div>
        <label className="eyebrow mb-2 inline-block">{t.octalInput}</label>
        <input
          type="text"
          inputMode="numeric"
          value={octalInput}
          onChange={(e) => applyOctal(e.target.value)}
          placeholder="755"
          spellCheck={false}
          className="w-full max-w-xs rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 font-mono text-base outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
        {(
          [
            ["octal", t.octal, octal],
            ["symbolic", t.symbolic, symbolic],
            ["command", t.command, command],
          ] as const
        ).map(([key, label, value]) => (
          <div key={key} className="flex items-center gap-3 px-4 py-3">
            <span className="eyebrow w-24 shrink-0">{label}</span>
            <span className="flex-1 font-mono text-sm break-all">{value}</span>
            <button
              type="button"
              onClick={() => copy(key, value)}
              className="text-xs font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              {copied === key ? t.copied : t.copy}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
