/**
 * Infer TypeScript interfaces or Go structs from a JSON value — client-side.
 * Objects become named types; arrays of objects are merged into one shape with
 * optional fields for keys not present in every element.
 */
type Node =
  | { kind: "string" }
  | { kind: "boolean" }
  | { kind: "null" }
  | { kind: "any" }
  | { kind: "number"; int: boolean }
  | { kind: "array"; elem: Node }
  | { kind: "ref"; name: string };

interface ObjType {
  name: string;
  fields: { key: string; node: Node; optional: boolean }[];
}

interface Schema {
  root: Node;
  objects: ObjType[];
}

const RESERVED = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function pascal(raw: string): string {
  const parts = raw.split(/[^A-Za-z0-9]+/).filter(Boolean);
  let out = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  if (!out) out = "Field";
  if (/^[0-9]/.test(out)) out = "F" + out;
  return out;
}

function singular(name: string): string {
  if (/ies$/i.test(name)) return name.replace(/ies$/i, "y");
  if (/([^s])s$/i.test(name)) return name.replace(/s$/i, "");
  return name;
}

function buildSchema(value: unknown, rootName: string): Schema {
  const objects: ObjType[] = [];
  const used = new Map<string, number>();

  function uniqueName(base: string): string {
    let name = pascal(base) || "Root";
    if (!used.has(name)) {
      used.set(name, 1);
      return name;
    }
    const n = (used.get(name) as number) + 1;
    used.set(name, n);
    return name + n;
  }

  function node(v: unknown, suggested: string): Node {
    if (v === null || v === undefined) return { kind: "null" };
    if (typeof v === "string") return { kind: "string" };
    if (typeof v === "boolean") return { kind: "boolean" };
    if (typeof v === "number") return { kind: "number", int: Number.isInteger(v) };
    if (Array.isArray(v)) return { kind: "array", elem: arrayElem(v, suggested) };
    return objectNode(v as Record<string, unknown>, suggested);
  }

  function objectNode(obj: Record<string, unknown>, suggested: string): Node {
    const name = uniqueName(suggested);
    const rec: ObjType = { name, fields: [] };
    objects.push(rec);
    for (const [k, v] of Object.entries(obj)) {
      rec.fields.push({ key: k, node: node(v, singular(k)), optional: false });
    }
    return { kind: "ref", name };
  }

  function isPlainObject(x: unknown): x is Record<string, unknown> {
    return !!x && typeof x === "object" && !Array.isArray(x);
  }

  function arrayElem(arr: unknown[], suggested: string): Node {
    if (arr.length === 0) return { kind: "any" };
    if (arr.every(isPlainObject)) return mergeObjects(arr as Record<string, unknown>[], suggested);
    return mergeNodes(arr.map((x) => node(x, singular(suggested))));
  }

  function mergeObjects(arr: Record<string, unknown>[], suggested: string): Node {
    const name = uniqueName(suggested);
    const rec: ObjType = { name, fields: [] };
    objects.push(rec);
    const keys = new Map<string, { nodes: Node[]; present: number }>();
    for (const o of arr) {
      for (const [k, v] of Object.entries(o)) {
        if (!keys.has(k)) keys.set(k, { nodes: [], present: 0 });
        const info = keys.get(k) as { nodes: Node[]; present: number };
        info.nodes.push(node(v, singular(k)));
        info.present++;
      }
    }
    for (const [k, info] of keys) {
      rec.fields.push({ key: k, node: mergeNodes(info.nodes), optional: info.present < arr.length });
    }
    return { kind: "ref", name };
  }

  function mergeNodes(nodes: Node[]): Node {
    const kinds = new Set(nodes.map((n) => n.kind));
    kinds.delete("null");
    if (kinds.size === 0) return { kind: "null" };
    if (kinds.size > 1) return { kind: "any" };
    const kind = [...kinds][0];
    if (kind === "number") {
      const allInt = nodes.every((n) => n.kind !== "number" || n.int);
      return { kind: "number", int: allInt };
    }
    if (kind === "array") {
      const elems = nodes.filter((n) => n.kind === "array").map((n) => (n as { elem: Node }).elem);
      return { kind: "array", elem: mergeNodes(elems) };
    }
    if (kind === "ref") return nodes.find((n) => n.kind === "ref") as Node;
    return { kind } as Node;
  }

  const root = node(value, rootName);
  return { root, objects };
}

// ── TypeScript ───────────────────────────────────────────────
function tsType(n: Node): string {
  switch (n.kind) {
    case "string": return "string";
    case "boolean": return "boolean";
    case "null": return "null";
    case "any": return "unknown";
    case "number": return "number";
    case "array": return `${tsType(n.elem)}[]`;
    case "ref": return n.name;
  }
}
function tsKey(k: string): string {
  return RESERVED.test(k) ? k : JSON.stringify(k);
}

export function jsonToTypeScript(json: string, rootName = "Root"): string {
  const { root, objects } = buildSchema(JSON.parse(json), rootName || "Root");
  const blocks = objects.map((o) => {
    const fields = o.fields
      .map((f) => `  ${tsKey(f.key)}${f.optional ? "?" : ""}: ${tsType(f.node)};`)
      .join("\n");
    return `interface ${o.name} {\n${fields}\n}`;
  });
  if (root.kind !== "ref") {
    blocks.unshift(`type ${pascal(rootName || "Root")} = ${tsType(root)};`);
  }
  return blocks.join("\n\n");
}

// ── Go ───────────────────────────────────────────────────────
function goType(n: Node): string {
  switch (n.kind) {
    case "string": return "string";
    case "boolean": return "bool";
    case "null": return "interface{}";
    case "any": return "interface{}";
    case "number": return n.int ? "int" : "float64";
    case "array": return `[]${goType(n.elem)}`;
    case "ref": return n.name;
  }
}

export function jsonToGo(json: string, rootName = "Root"): string {
  const { root, objects } = buildSchema(JSON.parse(json), rootName || "Root");
  const blocks = objects.map((o) => {
    const fields = o.fields
      .map((f) => {
        const tag = `\`json:"${f.key}${f.optional ? ",omitempty" : ""}"\``;
        return `\t${pascal(f.key)} ${goType(f.node)} ${tag}`;
      })
      .join("\n");
    return `type ${o.name} struct {\n${fields}\n}`;
  });
  if (root.kind !== "ref") {
    blocks.unshift(`type ${pascal(rootName || "Root")} ${goType(root)}`);
  }
  return blocks.join("\n\n");
}
