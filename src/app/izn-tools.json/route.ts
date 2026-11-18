import { sections } from "@/lib/tools/registry";

// Tool-name dictionary for the izn-beacon collector (slug → {en, ru}), so the
// network stats show tool names, not slugs. Built from the registry so it stays
// in sync. Static: it only changes at build time. See beacon README.
export const dynamic = "force-static";

export function GET() {
  const tools: Record<string, { en: string; ru: string }> = {};
  for (const section of sections) {
    for (const tool of section.tools) {
      tools[tool.slug] = { en: tool.title.en, ru: tool.title.ru };
    }
  }
  return Response.json({ site: "iznkit.com", tools });
}
